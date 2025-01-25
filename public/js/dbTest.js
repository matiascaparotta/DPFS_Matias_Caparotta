const { Sequelize } = require("sequelize");
const { User } = require("./models");

const sequelize = new Sequelize("nombre_de_tu_base_de_datos", "tu_usuario", "tu_contraseña", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito.");

    const users = await User.findAll();
    console.log("Usuarios:", users);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  } finally {
    await sequelize.close();
  }
};

testConnection();