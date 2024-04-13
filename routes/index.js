var express = require('express');
var router = express.Router();
var products = require('../public/javascripts/productos');

/* 
 * GET home page.
 * Si el usuario tiene una sesión activa, renderiza la vista 'login' con el nombre del usuario.
 * Si no, renderiza la vista 'index' con la lista de productos.
 */
router.get('/', function(req, res, next) {
  if (req.session.userName) {
    res.render('login', {
      title: "Sonidos",
      usuario: req.session.userName,
      layout: "layout"
      
    });
  } else {
    res.render('index', { productos: products });
  }
});

/*
 * Ruta para mostrar la página de inicio.
 * Renderiza la vista 'index' con la lista de productos.
 */
router.get('/index' ,function(req, res, next) {
  res.render('index', { title: "Sonidos",  productos: products});
});

/*
 * Ruta para la página de compra.
 * Renderiza la vista 'compra'.
 */
router.get('/compra', function(req, res, next) {
  res.render('compra', { title: "Sonidos" });
});

/*
 * Controlador para manejar las solicitudes GET a /carrito.
 * Calcula el total del carrito y renderiza la vista 'carrito' con el total y los productos del carrito.
 */
router.get('/carrito', function(req, res, next) {
  // Calcular el total del carrito
  let total = 0;
  if (req.session.carrito) {
    req.session.carrito.forEach(item => {
      total += item.precio * item.cantidad;
    });
  }

  // Pasar el título, los datos del carrito y el total a la vista
  res.render('carrito', { title: "Carrito de Compra", carrito: req.session.carrito || [], total: total });
});

/*
 * Ruta para la página de inicio de sesión.
 * Renderiza la vista 'login'.
 */
router.get('/login', function(req, res, next) {
  res.render('login', { title: "Sonidos" });
});

/*
 * Ruta para agregar productos al carrito.
 * Agrega un producto al carrito de compras del usuario.
 */
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

/*
 * Ruta para eliminar productos del carrito.
 * Elimina un producto del carrito de compras del usuario.
 */
router.post('/eliminar-carrito', function(req, res, next) {
  const productoId = req.body.productoId;
  if (req.session.carrito) {
    req.session.carrito = req.session.carrito.filter(item => item.id !== productoId);
  }
  res.redirect('/carrito');
});

/*
 * Ruta para la página de agradecimiento.
 * Renderiza la vista 'gracias'.
 */
router.get('/gracias', function(req, res, next) {
  res.render('gracias', { title: "Gracias por tu compra" });
});

/*
 * Ruta para procesar la compra.
 * Procesa la compra, calcula el total y guarda la compra en la lista de compras realizadas.
 */
router.post('/procesar-compra', function(req, res, next) {
  try {
    // Obtener los detalles del carrito de la sesión
    const carrito = req.session.carrito || [];
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const cliente = req.body.cliente;

    const compra = {
      id: generateID(),  // Generar un ID único para la compra
      productos: carrito.map(item => item.nombre).join(', '),
      total,
      moneda: carrito[0] ? carrito[0].moneda : '',
      cliente
    };

    // Almacenar la compra en la lista de compras realizadas
    let compras = req.session.compras || [];
    compras.push(compra);
    req.session.compras = compras;

    // Limpiar el carrito de compras de la sesión
    req.session.carrito = [];

    // Redirigir al usuario a la página de agradecimiento
    res.redirect('/gracias');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la compra');
  }
});

/*
 * Función para generar un ID único para la compra.
 */
function generateID() {
  return Math.random().toString(36).substr(2, 9);
}

/*
 * Vista para mostrar todos los productos (solo para administradores).
 */
router.get('/admin/productos', function(req, res, next) {
  if (!req.session.userName || req.session.userName !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  res.render('gestion', { productos: products });
});


module.exports = router;