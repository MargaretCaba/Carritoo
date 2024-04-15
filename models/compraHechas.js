
    //Creacion del esquema de datos de la compra
const mongoose = require('mongoose');
const compraHechasSchema = new mongoose.Schema({
    cliente: {type: String, required: true },
    producto: {type: String, required: true },
    cantidad: {type: Number, required: true },
    fecha: {type: Date, default: Date.now }
});
module.exports = mongoose.model('compraHechas', compraHechasSchema);
