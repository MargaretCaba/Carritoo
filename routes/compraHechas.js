const express = require('express');
const router = express.Router();
const compraHechas = require('../models/compraHechas');

// Ruta para procesar una compra
router.post('/realizar-compra', async (req, res) => {
const { cliente, producto, cantidad } = req.body;
    try {
        // Guardar la compra en la base de datos
        await compraHechas.create({ cliente, producto, cantidad });
        res.redirect('/compraHechas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el historial.');
    }
});

module.exports = router;