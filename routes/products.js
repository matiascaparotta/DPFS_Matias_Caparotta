// routes/products.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/multerConfig"); 
const { isAuthenticated } = require("../middlewares/authMiddleware");
const validateProduct = require("../middlewares/productValidationMiddleware");

router.get("/", productController.listProducts);
router.get("/category/:categoryId", productController.listByCategory);
router.get("/search", productController.searchProducts);

router.get("/create", isAuthenticated, productController.showCreateForm);
router.post(
  "/create",
  isAuthenticated,
  upload.single("product_image"),
  validateProduct,
  productController.createProduct
);

router.get("/:productId/edit", isAuthenticated, productController.showEditForm);
router.post(
  "/:productId/edit",
  isAuthenticated,
  upload.single("product_image"),
  validateProduct,
  productController.editProduct
);

router.post("/:productId/delete", isAuthenticated, productController.deleteProduct);
router.get("/:productId", productController.showProductDetail);

module.exports = router;