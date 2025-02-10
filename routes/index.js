const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const homeController = require("../controllers/homeController");


router.get("/", async (req, res, next) => {
  try {
    await homeController.index(req, res);
  } catch (error) {
    next(error); 
  }
});


router.get("/protected-route", isAuthenticated, async (req, res, next) => {
  try {
    res.render("protected", { title: "Ruta Protegida", user: req.session.user });
  } catch (error) {
    next(error); 
  }
});

module.exports = router;