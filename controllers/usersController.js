const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Ruta al archivo JSON de usuarios
const usersFilePath = path.join(__dirname, "../data/users.json");

// Crear archivo si no existe
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
  console.log("Archivo users.json creado.");
}

// Leer usuarios del archivo JSON
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return [];
  }
};

// Guardar usuarios en el archivo JSON
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log("Usuarios guardados exitosamente.");
  } catch (error) {
    console.error("Error al guardar usuarios:", error);
  }
};

// Mostrar formulario de registro
const showRegisterForm = (req, res) => {
  res.render("users/register", {
    title: "Registro de Usuario",
    errors: [],
    oldData: {},
  });
};

// Registrar un usuario
const registerUser = (req, res) => {
  const { name, lastName, email, password, confirmPassword } = req.body;
  const users = getUsers();
  const errors = [];

  // Validaciones
  if (!name.trim()) errors.push("El nombre es obligatorio.");
  if (!lastName.trim()) errors.push("El apellido es obligatorio.");
  if (!email.trim()) errors.push("El correo electrónico es obligatorio.");
  if (!password || password.length < 8)
    errors.push("La contraseña debe tener al menos 8 caracteres.");
  if (password !== confirmPassword)
    errors.push("Las contraseñas no coinciden.");

  // Validar si el email ya existe
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) errors.push("El correo electrónico ya está registrado.");

  // Si hay errores, volver a la vista de registro
  if (errors.length > 0) {
    return res.render("users/register", {
      title: "Registro de Usuario",
      errors,
      oldData: { name, lastName, email },
    });
  }

  // Subir imagen de perfil (si no hay, usar default.png)
  const imageFilename = req.file ? req.file.filename : "default.png";

  // Encriptar contraseña y guardar usuario
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error al encriptar la contraseña:", err);
      return res.status(500).send("Error interno del servidor.");
    }

    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      name,
      lastName,
      email,
      password: hashedPassword,
      image: imageFilename,
    };

    users.push(newUser);
    saveUsers(users);

    console.log("Usuario registrado:", newUser);
    res.redirect("/users/login");
  });
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

// Manejar inicio de sesión
const loginUser = (req, res) => {
  const { email, password, rememberMe } = req.body;
  const users = getUsers();

  // Buscar usuario por email
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.cookie("loginError", "Usuario no encontrado.", { maxAge: 5000 });
    return res.redirect("/users/login");
  }

  // Comparar contraseña
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) {
      console.error("Error al comparar contraseñas:", err);
      return res.status(500).send("Error interno del servidor.");
    }

    if (!isMatch) {
      res.cookie("loginError", "Contraseña incorrecta.", { maxAge: 5000 });
      return res.redirect("/users/login");
    }

    // Manejar sesión
    req.session.user = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
    };

    // Recordar al usuario si seleccionó "Recordarme"
    if (rememberMe) {
      res.cookie("rememberedUser", email, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 días
    }

    res.redirect("/users/profile");
  });
};

// Mostrar perfil de usuario
const showProfile = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  res.render("users/profile", {
    title: "Perfil de Usuario",
    user: req.session.user,
  });
};

// Cerrar sesión
const logoutUser = (req, res) => {
  res.clearCookie("rememberedUser"); // Eliminar cookie de "Recordarme"
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
};

module.exports = {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser,
  logoutUser,
  showProfile,
  getUsers,
};