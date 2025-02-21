const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { check, validationResult } = require("express-validator");
const upload = require("../middlewares/multerConfig");


const showRegisterForm = (req, res) => {
  res.render("users/register", {
    title: "Registro de Usuario",
    errors: [],
    oldData: {},
  });
};


const registerUser = [
  (req, res, next) => {
    upload.single("user_image")(req, res, function (err) {
      if (err) {
        return res.render("users/register", {
          title: "Registro de Usuario",
          errors: [err.message],
          oldData: req.body,
        });
      }
      next();
    });
  },
  
  check('first_name')
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
  check('last_name')
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
  check('email')
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('El correo debe tener un formato válido.')
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('El correo ya está registrado.');
      }
    }),
  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).withMessage('La contraseña debe tener letras mayúsculas, minúsculas, un número y un carácter especial.'),
  
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("users/register", {
        title: "Registro de Usuario",
        errors: errors.array().map(error => error.msg),
        oldData: req.body,
      });
    }

    try {
      const { first_name, last_name, email, password } = req.body;

      
      if (!req.file) {
        return res.render("users/register", {
          title: "Registro de Usuario",
          errors: ["Debes subir una imagen de perfil."],
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
  }
];


const showLoginForm = (req, res) => {
  const errorMessage = req.cookies?.loginError || null;
  res.clearCookie("loginError");
  res.render("users/login", {
    title: "Iniciar Sesión",
    errorMessage,
    oldEmail: req.cookies?.rememberedUser || null,
  });
};

const loginUser = [
  
  check('email')
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('El correo debe tener un formato válido.')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('El correo no está registrado.');
      }
      req.user = user; 
    }),
  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("users/login", {
        title: "Iniciar Sesión",
        errorMessage: errors.array().map(error => error.msg).join(', '),
        oldEmail: req.body.email,
      });
    }

    try {
      const { email, password } = req.body;
      const user = req.user;

      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render("users/login", {
          title: "Iniciar Sesión",
          errorMessage: "Contraseña incorrecta.",
          oldEmail: email,
        });
      }

     
      req.session.user = {
        id: user.userId,
        name: user.first_name,
        lastName: user.last_name,
        email: user.email,
        image: user.user_image,
      };

      res.redirect("/users/profile");
    } catch (error) {
      console.error("Error en loginUser:", error.message);
      res.status(500).render("error", {
        title: "Error",
        message: "Error interno del servidor.",
      });
    }
  }
];

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
  listUsers,
};