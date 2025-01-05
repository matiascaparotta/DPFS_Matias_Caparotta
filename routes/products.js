const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");


router.get("/create", productController.showCreateForm);

router.post("/create", productController.createProduct);

router.get("/:id/edit", productController.showEditForm);

router.post("/:id/edit", productController.editProduct);

router.get("/:id", productController.showProductDetail);

module.exports = router;
