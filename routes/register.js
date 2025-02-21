const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig"); 
const usersController = require("../controllers/usersController");


router.get("/", usersController.showRegisterForm);


router.post("/", upload.single("user_image"), usersController.registerUser);

module.exports = router;