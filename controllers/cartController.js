const getCart = (req, res) => {
    res.render('products/productCart', { title: 'Carrito de Compras' });
  };
  
  module.exports = { getCart };