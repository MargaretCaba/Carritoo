var express = require('express');
var router = express.Router();const bcrypt = require('bcrypt');
const usersModel = require('../models/user');
var Producto = require('../models/producto');
/*
 * GET users listing.
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
 * Vista para gestionar productos (solo para administradores).
 */
router.get('/gestion-productos', function(req, res, next) {
  if (req.session.userName && req.session.userRole === 'admin') {
      const productos = require('../public/javascripts/productos');
      res.render('gestion', { productos: productos });
  } else {
      res.redirect('/login');
  }
});

/*
 * Ruta para agregar producto.
 */
router.post('/agregarProducto', function(req, res, next) {
  const nuevoProducto = {
      id: req.body.id,
      nombre: req.body.nombre,
      precio: req.body.precio,
      Descripcion: req.body.descripcion,
      cantidad: req.body.cantidad,
      moneda: req.body.moneda
  };
  
  productos.push(nuevoProducto);
  
  // Guardar los productos actualizados
  const fs = require('fs');
  fs.writeFileSync('./public/javascripts/productos.js', `module.exports = ${JSON.stringify(productos)};`);

  res.redirect('/users/gestion');
});

/*
 * Ruta para eliminar producto.
 */
router.post('/eliminar-producto', function(req, res, next) {
  const productoId = req.body.id;
  
  productos = productos.filter(producto => producto.id !== parseInt(productoId));
  
  // Guardar los productos actualizados
  const fs = require('fs');
  fs.writeFileSync('./public/javascripts/productos.js', `module.exports = ${JSON.stringify(productos)};`);

  res.redirect('/users/gestion');
});




module.exports = router;
