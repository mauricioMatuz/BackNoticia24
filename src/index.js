import app from "./app.js";
import { sequelize } from "./database/database.js";
import { Rol } from "./models/rol.models.js";
import { Usuarios } from "./models/usuario.models.js";

async function main() {
  try {
    await sequelize.sync({ force: false });
    const roleNames = ["administrador", "escritor", "lector"];
    for (let i = 0; i < roleNames.length; i++) {
      await Rol.findOrCreate({
        where: { rol: roleNames[i] },
        defaults: { rol: roleNames[i] },
      });
    }
    const adminRole = await Rol.findOne({
      where: { rol: "administrador" },
      attributes: ["id"],
    });
    const [user, created] = await Usuarios.findOrCreate({
      where: { correo: "root@root" },
      defaults: {
        nombre: "root",
        apellido: "root",
        correo: "root@root",
        password: "root",
        rolID: adminRole.id,
      },
    });

    console.log("Connection has been established successfull");
    app.listen(8080, () => {
      console.log("Servidor Ok", 8080);
    });
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
}

main();
