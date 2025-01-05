const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("users/register");
});

router.post("/", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Las contraseñas no coinciden");
  }

  console.log("Nuevo Usuario:", { name, email, password });

  res.redirect("users/login");
});

module.exports = router;
