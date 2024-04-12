var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/gestion-productos', function(req, res, next) {
  if (req.session.userName && req.session.userRole === 'admin') {
      const productos = require('../public/javascripts/productos');
      res.render('gestion', { productos: productos });
  } else {
      res.redirect('/login');
  }
});

router.get('/compras-realizadas', function(req, res, next) {
  if (req.session.userName && req.session.userRole === 'admin') {
      const compras = []; // Aquí deberías obtener las compras de tu base de datos
      res.render('compraHechas', { compras: compras });
  } else {
      res.redirect('/login');
  }
});



module.exports = router;