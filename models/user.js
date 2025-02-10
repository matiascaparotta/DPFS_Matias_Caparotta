"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre no puede estar vacío.",
          },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El apellido no puede estar vacío.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Este correo ya está registrado.",
        },
        validate: {
          isEmail: {
            msg: "Debe ser un correo electrónico válido.",
          },
        },
      },
      password: {
        type: DataTypes.TEXT, 
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "La contraseña no puede estar vacía.",
          },
        },
      },
      user_image: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
    },
    {
      timestamps: false, 
      tableName: "Users", 
    }
  );

  return User;
};