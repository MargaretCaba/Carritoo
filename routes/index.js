var express = require('express');
var router = express.Router();
var products = require('../public/javascripts/productos')

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.userName){
    res.render('login',{
      title: "Sonidos",
      usuario: req.session.userName,
      layout: "layout"
    })
  }else {
    res.render('index', {productos:products});
  }
});

router.get('/compra', function(req, res, next){
  res.render('compra', {title: "Sonidos"});
});

router.get('/carrito', function(req, res, next){
  res.render('carrito', {title: "Sonidos"});
});

router.get('/login', function(req, res, next){
  res.render('login', {title: "Sonidos"});
});


module.exports = router;
