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

// Controlador para manejar las solicitudes GET a /carrito
router.get('/carrito', function(req, res, next){
  // Calcular el total del carrito
  let total = 0;
  if (req.session.carrito) {
      req.session.carrito.forEach(item => {
          total += item.precio * item.cantidad;
      });
  }

  // Pasar el título, los datos del carrito y el total a la vista
  res.render('carrito', {title: "Carrito de Compra", carrito: req.session.carrito || [], total: total});
});

router.get('/login', function(req, res, next){
  res.render('login', {title: "Sonidos"});
});

router.post('/agregar-carrito', function(req, res, next) {
  // Obtener el ID del producto y la cantidad del cuerpo de la solicitud
  const productoId = req.body.productoId;
  const cantidad = req.body.cantidad;

  // Buscar el producto en la lista de productos
  const producto = products.find(p => p.id === parseInt(productoId));

  // Verificar si el producto existe y si hay suficiente cantidad
  if (!producto || cantidad > producto.cantidad) {
      return res.status(400).send('Producto no disponible o cantidad insuficiente');
  }

  // Agregar el producto al carrito de compras del usuario
  if (!req.session.carrito) {
      req.session.carrito = [];
  }
  const itemCarrito = req.session.carrito.find(item => item.id === productoId);
  if (itemCarrito) {
      itemCarrito.cantidad += parseInt(cantidad);
  } else {
      req.session.carrito.push({
          id: productoId,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: parseInt(cantidad),
          moneda: producto.moneda
      });
  }

  // Redirigir al usuario a la página del carrito
  res.redirect('/carrito');
});


router.post('/procesar-compra', function(req, res, next) {
  try {
        // Obtener los detalles del carrito de la sesión
        const carrito = req.session.carrito || [];
        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
        // Limpiar el carrito de compras de la sesión
        req.session.carrito = [];
    
        // Redirigir al usuario a la página de agradecimiento
        res.redirect('/gracias');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la compra');
      }
    });
    
  

module.exports = router;
