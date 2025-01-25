const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const registerRoutes = require("./routes/register"); 
const loginRoutes = require("./routes/login"); 

const { User } = require("./models"); 

const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: "mi_secreto_seguro",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      httpOnly: true,
      secure: false,
    },
  })
);


app.use(async (req, res, next) => {
  if (!req.session.user && req.cookies.rememberedUser) {
    try {
      const email = req.cookies.rememberedUser;
      const user = await User.findOne({ where: { email } });

      if (user) {
        req.session.user = {
          id: user.userId,
          name: user.first_name,
          lastName: user.last_name,
          email: user.email,
          image: user.user_image,
        };
      }
    } catch (error) {
      console.error("Error al restaurar sesión desde cookie:", error.message);
      res.clearCookie("rememberedUser");
    }
  }
  next();
});


app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.user;
  res.locals.user = req.session.user || null;
  next();
});


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/users/register", registerRoutes); 
app.use("/users/login", loginRoutes); 
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);


app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message,
    error: res.locals.error,
  });
});

module.exports = app;