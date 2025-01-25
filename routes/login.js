const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { guestOnly } = require("../middlewares/authMiddleware"); 


router.get("/", guestOnly, usersController.showLoginForm);


router.post("/", usersController.loginUser);

module.exports = router;