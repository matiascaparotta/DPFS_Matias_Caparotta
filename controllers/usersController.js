const bcrypt = require("bcryptjs");
const { User, Op } = require("../models");

// Mostrar formulario de registro
const showRegisterForm = (req, res) => {
  res.render("users/register", {
    title: "Registro de Usuario",
    errors: [],
    oldData: {},
  });
};

// Registrar un usuario
const registerUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Archivo subido:", req.file);

    const { first_name, last_name, email, password } = req.body;
    const errors = [];

    
    if (!first_name || !last_name || !email || !password) {
      errors.push("Todos los campos son obligatorios.");
    }
    if (!req.file) {
      errors.push("Debes subir una imagen de perfil.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("El correo debe tener un formato válido.");
    }

    
    if (errors.length > 0) {
      return res.render("users/register", {
        title: "Registro de Usuario",
        errors,
        oldData: { first_name, last_name, email },
      });
    }

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render("users/register", {
        title: "Registro de Usuario",
        errors: ["El correo ya está registrado."],
        oldData: { first_name, last_name, email },
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      user_image: req.file.filename,
    });

    console.log("Usuario registrado:", newUser);
    res.redirect("/users/login");
  } catch (error) {
    console.error("Error en registerUser:", error.message);
    res.status(500).render("error", {
      title: "Error",
      message: "Error interno del servidor.",
    });
  }
};

// Mostrar formulario de login
const showLoginForm = (req, res) => {
  const errorMessage = req.cookies?.loginError || null;
  res.clearCookie("loginError");
  res.render("users/login", {
    title: "Iniciar Sesión",
    errorMessage,
    oldEmail: req.cookies?.rememberedUser || null,
  });
};


const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.cookie("loginError", "Usuario no encontrado.", { maxAge: 5000 });
      return res.redirect("/users/login");
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.cookie("loginError", "Contraseña incorrecta.", { maxAge: 5000 });
      return res.redirect("/users/login");
    }

    
    req.session.user = {
      id: user.userId,
      name: user.first_name,
      lastName: user.last_name,
      email: user.email,
      image: user.user_image,
    };

    
    if (rememberMe) {
      res.cookie("rememberedUser", email, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    res.redirect("/users/profile");
  } catch (error) {
    console.error("Error en loginUser:", error.message);
    res.status(500).render("error", {
      title: "Error",
      message: "Error interno del servidor.",
    });
  }
};

// Mostrar perfil de usuario
const showProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/users/login");
    }

    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      req.session.destroy();
      return res.redirect("/users/login");
    }

    res.render("users/profile", {
      title: "Perfil de Usuario",
      user,
    });
  } catch (error) {
    console.error("Error en showProfile:", error.message);
    res.status(500).render("error", {
      title: "Error",
      message: "Error interno del servidor.",
    });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie("rememberedUser");
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
};
const showEditForm = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.redirect("/users/login");
    }
    res.render("users/edit", {
      title: "Editar Perfil",
      user,
      errors: [],
    });
  } catch (error) {
    console.error("Error al mostrar formulario de edición:", error.message);
    res.status(500).send("Error interno del servidor.");
  }
};

// Editar usuario
const editUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    
    if (!first_name || !last_name || !email) {
      return res.render("users/edit", {
        title: "Editar Perfil",
        user: req.body,
        errors: ["Todos los campos son obligatorios."],
      });
    }

    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.redirect("/users/login");
    }

    
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;

    
    if (password && password.length >= 8) {
      user.password = await bcrypt.hash(password, 10);
    }

    
    if (req.file) {
      user.user_image = req.file.filename;
    }

    await user.save();
    req.session.user = {
      id: user.userId,
      name: user.first_name,
      lastName: user.last_name,
      email: user.email,
      image: user.user_image,
    };

    res.redirect("/users/profile");
  } catch (error) {
    console.error("Error al editar usuario:", error.message);
    res.status(500).send("Error interno del servidor.");
  }
};

const showUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).render("error", {
        title: "Usuario no encontrado",
        message: "El usuario que intentas ver no existe.",
        error: {},
      });
    }

    res.render("users/detail", {
      title: "Detalle del Usuario",
      user,
    });
  } catch (error) {
    console.error("Error al mostrar detalle del usuario:", error.message);
    res.status(500).send("Error interno del servidor.");
  }
};
const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["userId", "first_name", "last_name", "email", "user_image"],
    });

    res.render("users/userList", {
      title: "Lista de Usuarios",
      users,
      loggedInUser: req.session.user, 
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error.message);
    res.status(500).send("Error interno del servidor.");
  }
};

module.exports = {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser,
  logoutUser,
  showProfile,
  showEditForm,
  editUser,
  showUserDetail,
  listUsers
};