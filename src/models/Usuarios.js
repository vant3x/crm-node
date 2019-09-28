const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    nombre: {
        type: String,
        required: false,
        trim: true,
    },
    apellido: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: Number,
        default: 0
        
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_ultimo_ingreso: {
        type: Date
    },
    estado: {
        type: Number,
        default: 0
    }
});

// antes de guardar
usuariosSchema.pre('save', async function (next)  {
    const user = this;

    const hash = await bcrypt.hash(this.password, 12);

    this.password = hash;

    next();
});

usuariosSchema.methods.isValidPassword = async function (password)  {
     const user = this;

     const compare = await bcrypt.compare(password, user.password);
     return compare;         
}

module.exports = mongoose.model('Usuarios', usuariosSchema); 