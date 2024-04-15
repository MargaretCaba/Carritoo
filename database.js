const mongoose = require('mongoose');

async function db() {
    try {
        await mongoose.connect('mongodb://localhost:27017/tienda-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        console.log('Database conneced successfully');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
    }


module.exports = db;