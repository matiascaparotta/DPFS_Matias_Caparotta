const express = require("express");
const router = express.Router();
const multer = require("multer");
const usersController = require("../controllers/usersController");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/users"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });


router.get("/", usersController.showRegisterForm);


router.post("/", upload.single("image"), usersController.registerUser);

module.exports = router;