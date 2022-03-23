//Palabra deservada
const mongoose = require('mongoose');

//Estructura de la BD
const empleadoSchema = new mongoose.Schema(
    {
        nombreCli: String,
        apellidoPatCli: String,
        apellidoMatCli: String,
        sexo: String,
        fechaNac: String,
        rfc: String,
        "direccion.calle": String,
        "direccion.colonia": String,
        telefono: String,
        correo: String,
        estado: String
    }
);

mongoose.model('Cliente', empleadoSchema);