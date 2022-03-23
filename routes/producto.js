var express = require('express');
var router = express.Router();

const {check, validationResult} = require('express-validator');

const mongoose= require('mongoose');

const Producto = mongoose.model('Producto');

const fs = require("fs-extra");
const path = require('path');
const upload = require('../libs/almacen');

/*GET Producto*/
router.get('/', async function(req, res, next) {
    
    
    //Consultar todo
    await Producto.find((err,producto)=>{
        if(err){
            return res.status(404).send("No se encontrarón producto");
        }

        res.send(producto);
    }).clone();

    //res.send('Entraste a empleado');

});

/* Insertar información con post */
router.post('/',upload.single('imagen'),async(req,res)=>{
    const errores = validationResult(req);

    if(!errores.isEmpty()){
      return res.status(422).send({error:errores.array()});
    }

    //Crear objeto en base a model y llenarlo con información
          producto = new Producto({
            nombreProd: req.body.nombreProd,
            descripcionProd: req.body.descripcionProd,
            costoIndividual: req.body.costoIndividual,
            marca: req.body.marca,
            condicion: req.body.condicion,
            stock: req.body.stock,
            ultimaVenta: req.body.ultimaVenta,
            ultimoSurtido: req.body.ultimoSurtido,
            estado: req.body.estado,
       });

       if(req.file){
        const {filename} = req.file;
        producto.setimgurl(filename);
    }
   
       await producto.save();
   
       //Respuesta exitosa y mostrar información
       res.status(201).send({producto});
   
   });// fin post de inserción 

      /* Modificar información con put */
router.put('/',upload.single('imagen'),async(req,res)=>{

    producto= await Producto.findOne({nombreProd: req.body.nombreProd});
  
    if(!producto){
        return res.status(422).send("No se encontró información");
    }

    /* */
    let urlfotoanterior = producto.imgurl.split("/");
    console.log(urlfotoanterior[4]);
    //obtiene la url de la imagen almacenada
    //Agregar a imgurl dicha url obtenida
    if(req.file){
        const {filename} = req.file;
        pepe=producto.setimgurl(filename);

        //Elimina la imagen anterior del servidor de backend
        await fs.unlink(path.resolve("almacen/img/"+urlfotoanterior[4]));
    }

  
    producto_mod = await Producto.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        {nombreProd: req.body.nombreProd},
        
            //Cosas que se van a cambiar
        {   
            descripcionProd: req.body.descripcionProd,
            costoIndividual: req.body.costoIndividual,
            marca: req.body.marca,
            condicion: req.body.condicion,
            stock: req.body.stock,
            estado: req.body.estado,
            imgurl: producto.imgurl
        },
        
            //Respuesta del metodo
        {
            new:true
        }
    );

    res.send({producto_mod});
  
  });//fin put de modificación

    //Método para consultar un solo documento con POST
router.post('/buscar',/*[
    check('nombre','El nombre debe tener una longitud minima de 5 caracteres').isLength({min:5})
],*/async(req,res)=>{
    /*const errores = validationResult(req);

    if(!errores.isEmpty()){
      return res.status(422).send({error:errores.array()});
    }*/

    producto =  await Producto.findOne({nombreProd: req.body.nombreProd}, /*'nombreProd'*/);
  
    if(!producto){
        return res.status(422).send("No hay información que mostrar");
    }
  
    res.send({producto});
  
  });//fin POST de consulta
  
  /* Eliminar información con POST */
  router.post('/borrar',/*[
    check('nombre','El nombre debe tener una longitud minima de 5 caracteres').isLength({min:5})
],*/async(req,res)=>{
    producto = await Producto.findOne({nombreProd:req.body.nombreProd});
  
    if(!producto){
        return res.status(422).send("No se ha podido eliminar");
    }
  
    let urlfoto = producto.imgurl.split("/");

    producto_eli = await Producto.findOneAndDelete({nombreProd:req.body.nombreProd});

    await fs.unlink(path.resolve("almacen/img/"+urlfoto[4]));
  
    res.send({producto_eli})
  });// fin delete de eliminación

module.exports = router;