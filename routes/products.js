const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Listado de productos
router.get("/", productController.listProducts);

// Ruta de búsqueda
router.get("/search", productController.searchProducts);

// Crear producto
router.get("/create", productController.showCreateForm);
router.post("/create", productController.createProduct);

// Editar producto
router.get("/:id/edit", productController.showEditForm);
router.post("/:id/edit", productController.editProduct);

// Eliminar producto
router.post("/:id/delete", productController.deleteProduct);

// Detalle del producto
router.get("/:id", productController.showProductDetail);

module.exports = router;