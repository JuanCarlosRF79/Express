var express = require('express');
const { send } = require('express/lib/response');
var router = express.Router();

const {check, validationResult} = require('express-validator');

const mongoose= require('mongoose');

const Empleado = mongoose.model('Empleado');

/*GET EMPLEADO*/
router.get('/', async function(req, res, next) {
    
    
    //Consultar todo
    await Empleado.find((err,empleado)=>{
        if(err){
            return res.status(404).send("No se encontrarón empleados");
        }

        res.send(empleado);
    }).clone();

    //res.send('Entraste a empleado');

});

//Método para consultar un solo documento con POST
router.post('/buscar',[
    check('correo','La busqueda se realiza por email').isEmail()
],async(req,res)=>{
    empleado =  await Empleado.findOne({correo: req.body.correo}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    if(!empleado){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send({empleado});

});//fin POST de consulta


/* Modificar información con put */
router.put('/',[
    check('nombreEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoMatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('puesto','Mayor a 4 caracteres y solo letras').isLength({min:4}),
    check('sexo','Masculino, femenino o indeterminado').isLength({min:4}),
    check('turno','Seleccione uno de los turnos establecidos').isLength({min:5}),
    check('salario','Sólo numéros').isNumeric(),
    check('rfc','Longitud de 13 caracteres').isLength({min:13, max:13}),
    check('direccionCalle','Mayor a 7 caracteres').isLength({min:7}),
    check('direccionColonia','Mayor a 7 caracteres').isLength({min:7}),
    check('telefono','Longitud de 10 caracteres y solo numéros').isNumeric().isLength({min:10, max:10}),
    check('correo','Verifique que su email sea valido').isEmail(),
    check('estado','Debe contener arroba y punto').isLength({min:6, max:7})
],async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    empleado= await Empleado.findOne({correo: req.body.correo});

    if(!empleado){
        return res.status(422).send("No se encontró información");
    }

    empleado_mod = await Empleado.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        { correo: req.body.correo},
        
            //Cosas que se van a cambiar
        {  
            nombreEmp: req.body.nombreEmp,
            apellidoPatEmp: req.body.apellidoPatEmp,
            apellidoMatEmp: req.body.apellidoMatEmp,
            puesto: req.body.puesto,
            sexo: req.body.sexo,
            turno: req.body.turno,
            fechaNac: req.body.fechaNac,
            salario: req.body.salario,
            ingresoEmpresa: req.body.ingresoEmpresa,
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

    res.send({empleado_mod});

});//fin put de modificación

/* Insertar información con post */
router.post('/',[
    check('nombreEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoMatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('puesto','Mayor a 4 caracteres y solo letras').isLength({min:4}),
    check('sexo','Masculino, femenino o indeterminado').isLength({min:4}),
    check('turno','Seleccione uno de los turnos establecidos').isLength({min:5}),
    check('salario','Sólo numéros').isNumeric(),
    check('rfc','Longitud de 13 caracteres').isLength({min:13, max:13}),
    check('direccionCalle','Mayor a 7 caracteres').isLength({min:7}),
    check('direccionColonia','Mayor a 7 caracteres').isLength({min:7}),
    check('telefono','Longitud de 10 caracteres y solo numéros').isNumeric().isLength({min:10, max:10}),
    check('correo','Verifique que su email sea valido').isEmail(),
    check('estado','Debe contener arroba y punto').isLength({min:6, max:7})
],async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    empleado = new Empleado({
        correo: req.body.correo,
        nombreEmp: req.body.nombreEmp,
        apellidoPatEmp: req.body.apellidoPatEmp,
        apellidoMatEmp: req.body.apellidoMatEmp,
        puesto: req.body.puesto,
        sexo: req.body.sexo,
        turno: req.body.turno,
        fechaNac: req.body.fechaNac,
        salario: req.body.salario,
        ingresoEmpresa: req.body.ingresoEmpresa,
        rfc: req.body.rfc,
        "direccion.calle": req.body.direccionCalle,
        "direccion.colonia": req.body.direccionColonia,
        telefono: req.body.telefono,
        estado: req.body.estado
    });

    await empleado.save();

    //Respuesta exitosa y mostrar información
    res.status(201).send({empleado});

});// fin post de inserción


/* Eliminar información con POST */
router.post('/borrar',[
    check('correo','Verifique que su email sea valido').isEmail()
],async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    empleado = await Empleado.findOne({correo: req.body.correo});

    if(!empleado){
        return res.status(422).send("No se ha podido eliminar");
    }

    empleado_eli = await Empleado.findOneAndDelete({correo: req.body.correo});

    res.send({empleado_eli})
});// fin delete de eliminación

/*
===================================================================
==============================FILTROS==============================
===================================================================
*/

//APELLIDO PATERNO
router.post('/buscar/apellidoPat',[
],async(req,res)=>{
    empleado =  await Empleado.find({apellidoPatEmp: req.body.apellidoPatEmp});

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    if(!empleado){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send({empleado});

});//fin POST de consulta

//APELLIDO MATERNO
router.post('/buscar/apellidoMat',[
],async(req,res)=>{
    empleado =  await Empleado.find({apellidoMatEmp: req.body.apellidoMatEmp});

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    if(!empleado){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send({empleado});

});//fin POST de consulta


module.exports = router;