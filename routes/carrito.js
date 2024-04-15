const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const CompraHechas = require('../models/compraHechas');

router.get('/', function(req, res, next) {
    let total = 0;
    if (req.session.carrito) {
      req.session.carrito.forEach(item => {
        total += item.precio * item.cantidad;
      });
    }
    res.render('carrito', { title: "Carrito de Compra", carrito: req.session.carrito || [], total: total });
  });
  

router.post('/agregar-carrito', async function(req, res, next) {
  try {
    const productoId = req.body.productoId;
    const cantidad = parseInt(req.body.cantidad);
    const producto = await Producto.findById(productoId);

    if (!producto || cantidad > producto.cantidad) {
      return res.status(400).send('Producto no disponible o cantidad insuficiente');
    }

    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    const itemCarrito = req.session.carrito.find(item => item.id === productoId);
    if (itemCarrito) {
      itemCarrito.cantidad += cantidad;
    } else {
      req.session.carrito.push({
        id: productoId,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
      });
    }

    res.redirect('/carrito');
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error al agregar producto al carrito');
  }
});

router.post('/eliminar-carrito', function(req, res, next) {
  const productId = req.body.productId;
  if (req.session.carrito) {
    req.session.carrito = req.session.carrito.filter(item => item.id !== productId);
  }
  res.redirect('/carrito');
});

router.post('/procesar-compra', async function(req, res, next) {
  const nombre = req.body.nombre;
  const carrito = req.session.carrito;

  if (!nombre || !carrito || carrito.length === 0) {
    return res.status(400).send('Nombre o carrito no especificado');
  }

  try {
    for (const item of carrito) {
      const compraHecha = new CompraHechas({
        cliente: nombre,
        producto: item.nombre,
        cantidad: item.cantidad
      });
      await compraHecha.save();
    }

    req.session.carrito = [];
    res.redirect('/');
  } catch (error) {
    console.error('Error al guardar la compra:', error);
    res.status(500).send('Error al procesar la compra. Por favor, inténtalo de nuevo más tarde.');
  }
});

module.exports = router;
