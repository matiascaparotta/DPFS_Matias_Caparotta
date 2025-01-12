const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const homeController = require("../controllers/homeController");


router.get("/", homeController.index);


router.get("/protected-route", isAuthenticated, (req, res) => {
  res.render("protected", { title: "Ruta Protegida", user: req.session.user });
});

module.exports = router;