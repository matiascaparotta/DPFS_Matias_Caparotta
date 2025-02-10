const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (req.baseUrl.includes("/products")) {
      uploadPath = path.join(__dirname, "../public/images/products");
    } else if (req.baseUrl.includes("/users")) {
      uploadPath = path.join(__dirname, "../public/images/users");
    } else {
      return cb(new Error("Ruta no reconocida para subir archivos."));
    }

    try {
      fs.mkdirSync(uploadPath, { recursive: true });
    } catch (err) {
      return cb(new Error("Error al crear el directorio de subida."));
    }

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
    req.fileValidationError = "Solo se permiten imágenes en formato .png, .jpg, .jpeg, .gif.";
    return cb(null, false); 
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});

module.exports = upload;