import { Categoria } from '../models/categoria.models.js';
import { Rol } from '../models/rol.models.js';
import { Usuarios } from '../models/usuario.models.js';

export const CreateDefaultCategories = async () => {
  try {
    console.log('SI CREO?');
    const categories = [
      { categoria: 'Internacional' },
      { categoria: 'Nacional' },
      { categoria: 'Opinion publica' },
      { categoria: 'Estado de Chiapas' },
    ];

    for (const categoryData of categories) {
      const [category, created] = await Categoria.findOrCreate({
        where: { categoria: categoryData.categoria },
        defaults: categoryData,
      });

      if (created) {
        console.log(`Categoría "${category.categoria}" creada.`);
      } else {
        console.log(`Categoría "${category.categoria}" ya existe.`);
      }
    }
  } catch (error) {
    console.error('Error al crear categorías por defecto:', error);
  }
};

export const CreateRolsAndUser = async () => {
  const roleNames = ['administrador', 'escritor', 'lector'];
  for (let i = 0; i < roleNames.length; i++) {
    await Rol.findOrCreate({
      where: { rol: roleNames[i] },
      defaults: { rol: roleNames[i] },
    });
  }
  const adminRole = await Rol.findOne({
    where: { rol: 'administrador' },
    attributes: ['id'],
  });
  const [user, created] = await Usuarios.findOrCreate({
    where: { correo: 'root@root' },
    defaults: {
      nombre: 'root',
      apellido: 'root',
      correo: 'root@root',
      password: 'root',
      rolID: adminRole.id,
    },
  });
};
