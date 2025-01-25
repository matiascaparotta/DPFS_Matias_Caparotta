const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const usersController = require("../controllers/usersController");
const { isAuthenticated } = require("../middlewares/authMiddleware");


router.get("/profile", isAuthenticated, usersController.showProfile);
router.get("/edit", isAuthenticated, usersController.showEditForm);
router.post("/edit", isAuthenticated, upload.single("user_image"), usersController.editUser);


router.get("/login", usersController.showLoginForm);
router.post("/login", usersController.loginUser);
router.get("/logout", usersController.logoutUser);


router.get("/register", usersController.showRegisterForm);
router.post("/register", upload.single("user_image"), usersController.registerUser);
router.get("/:id/detail", isAuthenticated, usersController.showUserDetail);

router.get("/list", isAuthenticated, usersController.listUsers);
module.exports = router;