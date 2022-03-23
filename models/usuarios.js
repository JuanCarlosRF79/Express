const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
    {
        correo: String,
        password: String,
        tipo:String
    }
);

mongoose.model('Usuario',usuarioSchema);