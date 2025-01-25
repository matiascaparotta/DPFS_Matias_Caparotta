const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    
    if (req.baseUrl.includes("products")) {
      uploadPath = path.join(__dirname, "../public/images/products");
    } else if (req.baseUrl.includes("users")) {
      uploadPath = path.join(__dirname, "../public/images/users");
    } else {
      return cb(new Error("Ruta no reconocida para subir archivos"));
    }

    
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});


const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Solo se permiten imágenes (.png, .jpg, .jpeg, .gif)"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});

module.exports = upload;