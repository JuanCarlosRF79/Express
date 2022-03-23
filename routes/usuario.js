var express = require('express');
var router = express.Router();

const mongoose= require('mongoose');
const Usuario = mongoose.model('Usuario');

const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');


//INICIO DE SESIÓN
router.post('/iniciarsesion',[
  check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail(),
  check('password','Contraseña incorrecta, minimo 10 caracteres').isLength({min: 4})
],async(req,res)=>{
  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).send({error:errores.array()});
  }

  usuario = await Usuario.findOne({correo: req.body.correo});

  if(!usuario){
    return res.status(422).send("usuario o contraseña incorrectos");
  }

  pass_cifr = await bcrypt.compare(req.body.password,usuario.password);

  if(!pass_cifr){
    return res.status(422).send("usuario o contraseña incorrectos");
  }

  res.send({usuario});
});//fin POST de Log-in

/* Get usuario */
router.get('/', async function(req, res, next) {
    
    
  //Consultar todo
  await Usuario.find((err,usuario)=>{
      if(err){
          return res.status(404).send("No hay información que mostrar");
      }

      res.send(usuario);
  }).clone();

});

//Método para consultar un solo documento con POST
router.post('/buscar',[
  check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail()
],async(req,res)=>{
  
  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).send({error:errores.array()});
  }

  usuario =  await Usuario.findOne({correo: req.body.correo});

  if(!usuario){
      return res.status(422).send("No hay información que mostrar");
  }

  res.send({usuario});

});//fin POST de consulta


/* Insertar información con post */
router.post('/',[
  check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail(),
  check('password','Contraseña incorrecta, minimo 5 caracteres').isLength({min: 5}),
  check('tipo').isLength({min:5,max:8})
],async(req,res)=>{
  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).send({error:errores.array()});
  }

  salt = await bcrypt.genSalt(10);
  pass_cifr = await bcrypt.hash(req.body.password,salt);
  

  //Crear objeto en base a model y llenarlo con información
        usuario = new Usuario({
         correo: req.body.correo,
         password: pass_cifr,
         tipo: req.body.tipo
     });
 
     await usuario.save();
 
     //Respuesta exitosa y mostrar información
     res.status(201).send({usuario});
 
 });// fin post de inserción

 /* Modificar información con put */
router.put('/',[
  check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail(),
  check('password','Contraseña incorrecta, minimo 5 caracteres').isLength({min: 5}),
  check('tipo').isLength({min:5,max:8})
],async(req,res)=>{
  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).send({error:errores.array()});
  }

  usuario= await Usuario.findOne({correo:req.body.correo});

  if(!usuario){
      return res.status(422).send("No se encontró información");
  }

  salt = await bcrypt.genSalt(10);
  pass_cifr = await bcrypt.hash(req.body.password,salt);


  usuario_mod = await Usuario.findOneAndUpdate(
      //Parametros del metodo FindOneAndUpdate
      
          //Parametro por el que se va a buscar
      {correo: req.body.correo},
      
          //Cosas que se van a cambiar
      {   
        password: pass_cifr,
        tipo: req.body.tipo
      },
      
          //Respuesta del metodo
      {
          new:true
      }
  );

  res.send({usuario_mod});

});//fin put de modificación

/* Eliminar información con POST */
router.post('/borrar',[
  check('correo','Por favor ingresa un correo electronico o verifica que sea correcto').isEmail()
],async(req,res)=>{
  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.status(422).send({error:errores.array()});
  }

  usuario = await Usuario.findOne({correo:req.body.correo});

  if(!usuario){
      return res.status(422).send("No se ha podido eliminar");
  }

  usuario_eli = await Usuario.findOneAndDelete({correo:req.body.correo});

  res.send({usuario_eli})
});// fin delete de eliminación

//==============================================================================
//=====================================FILTROS==================================
//==============================================================================

module.exports = router;
