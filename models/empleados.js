//Palabra deservada
const mongoose = require('mongoose');

//Estructura de la BD
const empleadoSchema = new mongoose.Schema(
    {
        nombreEmp: String,//
        apellidoPatEmp: String,//
        apellidoMatEmp: String,//
        puesto: String,//
        sexo: String,//
        turno: String,//
        fechaNac: String,
        salario: Number,
        ingresoEmpresa: String,
        rfc: String,//
        "direccion.calle": String,//
        "direccion.colonia": String,//
        telefono: String,
        correo: String,//
        estado: String//
    }
);

mongoose.model('Empleado', empleadoSchema);