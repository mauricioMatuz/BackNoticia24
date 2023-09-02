import { Usuarios } from '../models/usuario.models.js';
import { Rol } from '../models/rol.models.js';
import jwt from 'jsonwebtoken';
import { sequelize } from '../database/database.js';

export const RegistrarLector = async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;
    await sequelize.transaction(async (t) => {
      await Usuarios.create(
        {
          nombre,
          apellido,
          correo,
          password,
          rolID: 3,
        },
        { transaction: t },
      );
    });

    return res.status(201).json({ message: 'Registro exitoso' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Correo ya existente' });
    }
    return res.status(503).json({ message: 'Servicio no disponible', error });
  }
};

export const RegistrarAdministrador = async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rolID } = req.body;

    await sequelize.transaction(async (t) => {
      const banderaToken = jwt.verify(req.token, 'administrador');
      if (!banderaToken) {
        return res.status(403).json({ message: 'Token inválido' });
      }
      await Usuarios.create(
        {
          nombre,
          apellido,
          correo,
          password,
          rolID,
        },
        { transaction: t },
      );
    });

    return res
      .status(201)
      .json({ message: 'Nuevo administrador/escritor creado' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token inválido' });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Correo ya existente' });
    }
    return res.status(503).json({ message: 'Servicio no disponible', error });
  }
};

export const ActualizarDatos = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el valor de id de los parámetros
    const usuario = await Usuarios.findOne({
      where: { id },
      attributes: ['correo', 'password', 'rolID'],
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let secretKey;
    switch (usuario.rolID) {
      case 1:
        secretKey = 'administrador';
        break;
      case 2:
        secretKey = 'escritor';
        break;
      case 3:
        secretKey = 'lector';
        break;
      default:
        return res.status(400).json({ message: 'Rol inválido' });
    }

    jwt.verify(req.token, secretKey, async (error) => {
      if (error) {
        return res.status(403).json({ message: 'Token inválido' });
      }

      await sequelize.transaction(async (t) => {
        await usuario.set(req.body).save({ transaction: t });
      });

      return res.status(200).json({ message: 'Actualizado exitosamente' });
    });
  } catch (error) {
    return res.status(503).json({ message: 'Servicio no disponible', error });
  }
};

export const Login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuarios.findOne({
      where: { correo, password },
    });

    if (!usuario) {
      return res.status(401).json({ message: 'No hay usuario' });
    }

    let secretKey;
    switch (usuario.rolID) {
      case 1:
        secretKey = 'administrador';
        break;
      case 2:
        secretKey = 'escritor';
        break;
      case 3:
        secretKey = 'lector';
        break;
      default:
        return res.status(400).json({ message: 'Rol inválido' });
    }

    const token = jwt.sign({ user: usuario }, secretKey);
    return res.status(200).json({ token, rol: secretKey });
  } catch (error) {
    return res.status(503).json({ message: 'Servicio no disponible' });
  }
};

export const crearRoot = async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rol } = req.body;
    await sequelize.transaction(async (t) => {
      await Usuarios.create(
        {
          nombre,
          apellido,
          correo,
          password,
          rolID: 1,
        },
        { transaction: t },
      );
    });

    return res.status(201).json({ message: 'Usuario root creado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const Roles = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const bandera = jwt.verify(req.token, 'administrador');
    if (!bandera) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    const { rolcito } = req.body;
    await Rol.create(
      {
        rol: rolcito,
      },
      { transaction: t },
    );

    await t.commit();
    return res.status(201).json({ message: 'Rol creado exitosamente' });
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const Borrar = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    const roles = await Rol.findAll();
    return res.json({ roles, usuarios });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const ListaEscritor = async (req, res) => {
  try {
    try {
      jwt.verify(req.token, 'administrador');
    } catch (error) {
      return res.status(401).json({ message: 'Toekn inválido' });
    }
    const escritorRol = await Rol.findOne({
      where: {
        rol: 'escritor', // Nombre del rol de escritor en tu base de datos
      },
    });
    if (!escritorRol) {
      return res.status(404).json({ message: 'No hay rol escritor' });
    }
    const escritores = await Usuarios.findAll({
      where: {
        rolID: escritorRol.id,
      },
    });
    if (escritores) {
      return res.status(200).json({ message: escritores });
    } else {
      return res.status(404).json({ message: 'No hay escritores' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
