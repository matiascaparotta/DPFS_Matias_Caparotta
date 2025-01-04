const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  const productId = req.params.id;
 
  res.render('productDetail', {
    product: {
      id: productId,
      name: "Producto",
      description: "Descripción del producto.",
      price: "$100000",
      image: "./images/sillonvintage.png"
    }
  });
});

module.exports = router;