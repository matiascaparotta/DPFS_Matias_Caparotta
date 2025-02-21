const { body } = require("express-validator");
const path = require("path");

const validateProduct = [
  body("product_name")
    .trim()
    .notEmpty().withMessage("El nombre del producto es obligatorio.")
    .isLength({ min: 5 }).withMessage("El nombre debe tener al menos 5 caracteres."),

  body("description")
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria.")
    .isLength({ min: 20 }).withMessage("La descripción debe tener al menos 20 caracteres."),

  body("price")
    .notEmpty().withMessage("El precio es obligatorio.")
    .isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor que 0."),

  body("product_image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("La imagen del producto es obligatoria.");
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Solo se permiten imágenes en formato JPG, JPEG, PNG o GIF.");
    }

    return true;
  }),
];

module.exports = validateProduct;