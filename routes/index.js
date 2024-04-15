const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const userModel = require('../models/user');
const compraHechas = require('../models/compraHechas');

router.get("/", async (req, res, next) => {
  try {
    const productos = await Producto.find();
    res.render("index", { title: "Sonidos Del Cielo", productos: productos });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: "Sonidos" });
});


router.get('/compraHechas', async (req, res) => {
  try {
    if (!req.session.userName) {
      return res.redirect('/login');
    }
    const user = userModel.find(user => user.username === req.session.userName);
    if (!user || user.role !== 'admin') {
      return res.redirect('/');
    }
    const comprasHechas = await compraHechas.find().exec();
    res.render('compraHechas', {title: 'Compras exitosas.', comprasHechas: comprasHechas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el historial de compras');
  }
});

/* Ruta para agregar un producto 
router.post('/agregar-producto', async function(req, res) {
  const { nombre, precio, cantidad } = req.body;
  try {
      // Crear y guardar el nuevo producto
      await Producto.create({
          nombre: nombre,
          precio: precio,
          cantidad: cantidad
      });
      res.render('/gestion');
  } catch (error) {
      console.error('Error al agregar el producto:', error);
      res.status(500).send('Error al agregar el producto');
  }
});

// Ruta para editar un producto 
router.post('/editar-producto', async function(req, res) {
  const { nombre, nuevoNombre, nuevoPrecio, nuevaCantidad } = req.body;
  try {
      // Buscar el producto por su nombre y actualizar sus datos
      await Producto.findOneAndUpdate({ nombre: nombre }, {
          nombre: nuevoNombre,
          precio: nuevoPrecio,
          cantidad: nuevaCantidad
      });
      res.render('/gestion');
  } catch (error) {
      console.error('Error al editar el producto:', error);
      res.status(500).send('Error al editar el producto');
  }
});

// Ruta para eliminar un producto 
router.post('/eliminar-producto', async function(req, res) {
  const nombreProducto = req.body.nombre;
  try {
      // Buscar y eliminar el producto por su nombre
      await Producto.findOneAndDelete({ nombre: nombreProducto });
      res.render('/gestion');
  } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).send('Error al eliminar el producto');
  }
});*/


module.exports = router;
