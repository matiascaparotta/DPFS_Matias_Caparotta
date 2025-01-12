const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const usersController = require("../controllers/usersController");
const { isAuthenticated, guestOnly } = require("../middlewares/authMiddleware");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/users"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });


router.get("/register", guestOnly, usersController.showRegisterForm);
router.post("/register", upload.single("image"), usersController.registerUser);
router.get("/login", guestOnly, usersController.showLoginForm);
router.post("/login", usersController.loginUser);


router.get("/profile", isAuthenticated, usersController.showProfile);
router.get("/logout", isAuthenticated, usersController.logoutUser);

module.exports = router;