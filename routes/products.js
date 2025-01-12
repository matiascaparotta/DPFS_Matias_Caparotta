const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware"); 


function checkAuthentication(req, res, next) {
  if (req.session && req.session.user) {
    next(); 
  } else {
    res.redirect("/"); 
  }
}


router.get("/", productController.listProducts);


router.get("/search", productController.searchProducts);


router.get("/create", isAuthenticated, checkAuthentication, productController.showCreateForm);
router.post("/create", isAuthenticated,checkAuthentication, productController.createProduct);


router.get("/:id/edit", isAuthenticated, checkAuthentication, productController.showEditForm);
router.post("/:id/edit", isAuthenticated, checkAuthentication, productController.editProduct);


router.post("/:id/delete", isAuthenticated, productController.deleteProduct);



router.get("/:id", productController.showProductDetail);

module.exports = router;