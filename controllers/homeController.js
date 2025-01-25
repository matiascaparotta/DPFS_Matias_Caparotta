const products = require('../models/products.json'); 

const homeController = {
  index: (req, res) => {
    res.render('index', { products }); 
  }
};

module.exports = homeController;