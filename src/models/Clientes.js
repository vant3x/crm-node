const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientesSchema = new Schema({
    nombre: {
         type: String, 
         required: true,
         trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    empresa: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Clientes', clientesSchema);