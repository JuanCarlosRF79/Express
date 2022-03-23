var express = require('express');
const { send } = require('express/lib/response');
var router = express.Router();

const {check, validationResult} = require('express-validator');

const mongoose= require('mongoose');

const Cliente = mongoose.model('Cliente');

/*GET Cliente*/
router.get('/', async function(req, res, next) {
    
    
    //Consultar todo
    await Cliente.find((err,cliente)=>{
        if(err){
            return res.status(404).send("No se encontrarón cliente");
        }

        res.send(cliente);
    }).clone();

    //res.send('Entraste a empleado');

});

/* Insertar información con post */
router.post('/',[
    check('nombreCli','El nombre debe tener por lo menos 3 caracteres y solo usar letras').isLength({min:3}),
    check('apellidoPatCli','El nombre debe tener por lo menos 3 caracteres y solo usar letras').isLength({min:3}),
    check('apellidoMatCli','El nombre debe tener por lo menos 3 caracteres y solo usar letras').isLength({min:3}),
    check('sexo','Masculino, femenino o indeterminado').isLength({min:4}),
    check('rfc','Longitud de 13 caracteres').isLength({min:13, max:13}),
    check('telefono','Longitud de 10 caracteres y solo numéros').isNumeric().isLength({min:10, max:10}),
    check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail(),
    check('direccionCalle','Mayor a 7 caracteres').isLength({min:7}),
    check('direccionColonia','Mayor a 7 caracteres').isLength({min:7}),
    check('estado','Debe contener arroba y punto').isLength({min:6, max:7})
],async(req,res)=>{
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error:errores.array()});
    }

    //Crear objeto en base a model y llenarlo con información
          cliente = new Cliente({
            nombreCli: req.body.nombreCli,
            apellidoPatCli: req.body.apellidoPatCli,
            apellidoMatCli: req.body.apellidoMatCli,
            sexo: req.body.sexo,
            fechaNac: req.body.fechaNac,
            rfc: req.body.rfc,
            "direccion.calle": req.body.direccionCalle,
            "direccion.colonia": req.body.direccionColonia,
            telefono: req.body.telefono,
            correo: req.body.correo,
            estado: req.body.estado
       });
   
       await cliente.save();
   
       //Respuesta exitosa y mostrar información
       res.status(201).send({cliente});
   
   });// fin post de inserción

   /* Modificar información con put */
router.put('/',[
    check('nombreCli','El nombre debe tener por lo menos 3 caracteres y solo usar letras').isLength({min:3}),
    check('apellidoPatCli','El nombre debe tener por lo menos 3 caracteres y solo usar letras').isLength({min:3}),
    check('apellidoMatCli','El nombre debe tener por lo menos 3 caracteres y solo usar letras').isLength({min:3}),
    check('sexo','Masculino, femenino o indeterminado').isLength({min:4}),
    check('rfc','Longitud de 13 caracteres').isLength({min:13, max:13}),
    check('telefono','Longitud de 10 caracteres y solo numéros').isNumeric().isLength({min:10, max:10}),
    check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail(),
    check('direccionCalle','Mayor a 7 caracteres').isLength({min:7}),
    check('direccionColonia','Mayor a 7 caracteres').isLength({min:7}),
    check('estado','Debe contener arroba y punto').isLength({min:6, max:7})
],async(req,res)=>{
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error:errores.array()});
    }

    cliente= await Cliente.findOne({correo:req.body.correo});
  
    if(!cliente){
        return res.status(422).send("No se encontró información");
    }
  
    cliente_mod = await Cliente.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        {correo: req.body.correo},
        
            //Cosas que se van a cambiar
        {   
            nombreCli: req.body.nombreCli,
            apellidoPatCli: req.body.apellidoPatCli,
            apellidoMatCli: req.body.apellidoMatCli,
            sexo: req.body.sexo,
            fechaNac: req.body.fechaNac,
            rfc: req.body.rfc,
            "direccion.calle": req.body.direccionCalle,
            "direccion.colonia": req.body.direccionColonia,
            telefono: req.body.telefono,
            estado: req.body.estado
        },
        
            //Respuesta del metodo
        {
            new:true
        }
    );
  
    res.send({cliente_mod});
  
  });//fin put de modificación

  //Método para consultar un solo documento con POST
router.post('/buscar',[
    check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail()
],async(req,res)=>{
    const errores = validationResult(req);

    if(!errores.isEmpty()){
      return res.status(422).send({error:errores.array()});
    }

    cliente =  await Cliente.findOne({correo: req.body.correo});
  
    if(!cliente){
        return res.status(422).send("No hay información que mostrar");
    }
  
    res.send({cliente});
  
  });//fin POST de consulta

  /* Eliminar información con POST */
router.post('/borrar',[
    check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail()
],async(req,res)=>{
    const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).send({error:errores.array()});
  }
    cliente = await Cliente.findOne({correo:req.body.correo});
  
    if(!cliente){
        return res.status(422).send("No se ha podido eliminar");
    }
  
    cliente_eli = await Cliente.findOneAndDelete({correo:req.body.correo});
  
    res.send({cliente_eli})
  });// fin delete de eliminación


  /*
===================================================================
==============================FILTROS==============================
===================================================================
*/

//APELLIDO PATERNO
router.post('/buscar/apellidoPat',[
],async(req,res)=>{
    cliente =  await Cliente.find({apellidoPatEmp: req.body.apellidoPatEmp});

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    if(!cliente){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send({cliente});

});//fin POST de consulta

//APELLIDO MATERNO
router.post('/buscar/apellidoMat',[
],async(req,res)=>{
    cliente =  await Cliente.find({apellidoMatEmp: req.body.apellidoMatEmp});

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    if(!cliente){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send({cliente});

});//fin POST de consulta

module.exports = router;