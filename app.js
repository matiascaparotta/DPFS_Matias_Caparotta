var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const session = require("express-session");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRoutes = require("./routes/products");
var cartRoutes = require("./routes/cart");
var registerRoutes = require("./routes/register");
var loginRoutes = require("./routes/login");

var app = express();


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


app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.user; 
  res.locals.user = req.session.user || null; 
  next();
});
function rememberMe(req, res, next) {
  if (!req.session.user && req.cookies.rememberedUser) {
    const users = getUsers(); 
    const user = users.find((u) => u.email === req.cookies.rememberedUser);

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
}



app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use(rememberMe);



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

app.use((req, res, next) => {
  if (!req.session.user && req.cookies.rememberedUser) {
    const users = getUsers();
    const user = users.find((u) => u.email === req.cookies.rememberedUser);

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
});

app.use((req, res, next) => {
  if (!req.session.user && req.cookies.rememberedUser) {
    const users = getUsers(); 
    const user = users.find((u) => u.email === req.cookies.rememberedUser);

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
});
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});




module.exports = app;