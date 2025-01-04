var express = require('express');
var router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.index); 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
