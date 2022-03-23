const mongoose = require ('mongoose');
/*
const detallesVenta = new mongoose.Schema({
    nombreProd: String,
    costoIndividual: Number,
    cantidadVendida: Number,
    total: Number
})
/*
const servicio = new mongoose.Schema({
    calle:String,
    colonia: String,
    descripcionProblema: String,
    estadoPago: String,
    fechaFin: String
})

const envio = new mongoose.Schema({
    calle: String,
    colonia: String,
    fechaFin: String,
    ultimaActualizacion: String,
    estadoEnvio: String
})
*/

const detalles = new mongoose.Schema({
    nombreProd: String,
    costoIndividual: Number,
    cantidadVendida: Number,
    total: Number
})


const ticketSchema = new mongoose.Schema(
    {
        "cliente.nombreCli": String,
        "cliente.apellidoPatCli": String,
        "cliente.telefono": String,
        "empleado.nombreEmp": String,
        "empleado.apellidoPatEmp": String,
        "descuento.total": Number,        
        "descuento.descripcion": String,
        "metodoPago": String,
        "tipoTicket": String,

        //CAMPOS ENVIO
        "detallesEnvio.calle": String,
        "detallesEnvio.colonia": String,
        "detallesEnvio.telefono": String,
        "detallesEnvio.fechaFin": String,
        "detallesEnvio.ultimaActualizacion": String,
        "detallesEnvio.estadoEnvio": String,

        //CAMPOS VENTA
        detalles: [detalles],

        //CAMPOS SERVICIO
        "detallesServicio.calle": String,
        "detallesServicio.colonia": String,
        "detallesServicio.descViv": String,
        "detallesServicio.descProb": String,
        "detallesServicio.fechaSol": String,
        "detallesServicio.fechaFin": String,
        "detallesServicio.estado": String,
        
        "costoTotal": Number,
        "fechaTicket": String
    }
);

mongoose.model('Ticket', ticketSchema);