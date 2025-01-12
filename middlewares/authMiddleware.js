const { getUsers } = require("../controllers/usersController");


const restoreSession = (req, res, next) => {
  if (!req.session.user && req.cookies.rememberedUser) {
    try {
      const userData = JSON.parse(req.cookies.rememberedUser); 
      req.session.user = userData; 
    } catch (error) {
      console.error("Error al leer la cookie de Recordarme:", error);
      res.clearCookie("rememberedUser"); 
    }
  }

  
  if (!req.session.user && req.cookies.rememberUser) {
    const users = getUsers(); 
    const user = users.find((u) => u.email === req.cookies.rememberUser);

    if (user) {
      req.session.user = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      };
    }
  }

  next();
};


const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next(); 
  } else {
    res.redirect("/users/login"); 
  }
};


const guestOnly = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/users/profile"); 
  } else {
    next(); 
  }
};

module.exports = {
  restoreSession, 
  isAuthenticated, 
  guestOnly, 
};