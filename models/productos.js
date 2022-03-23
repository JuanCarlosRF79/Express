//Palabra deservada
const mongoose = require('mongoose');

//Estructura de la BD
const productoSchema = new mongoose.Schema(
    {
        nombreProd: String,
        descripcionProd: String,
        costoIndividual: Number,
        marca: String,
        condicion: String,
        stock: Number,
        ultimaVenta: String,
        ultimoSurtido: String,
        estado: String,
        imgurl: String
    }
);

productoSchema.methods.setimgurl = function setimgurl(imagen){
    this.imgurl = "http://localhost:3000/foto/" + imagen;
    //this.imgurl = "http://192.168.0.106:3000/foto/" + imagen;
}

mongoose.model('Producto', productoSchema);