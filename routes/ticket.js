var express = require('express');
const { send } = require('express/lib/response');
var router = express.Router();

const {check, validationResult} = require('express-validator');

const mongoose= require('mongoose');

const Ticket = mongoose.model('Ticket');

/*=================================================
============= Detalles Ticket =====================
===================================================*/

/* Eliminar un documento embebido */
router.post('/detalles/borrar',async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    ticket= await Ticket.findById(req.body.codigoTick);

    if(!ticket.detalles){
        return res.status(422).send("No se encontró información");
    }

    ticket_eli = await Ticket.findOneAndUpdate(
        {_id: req.body.codigoTick },
        {$pull: { detalles:{ _id: req.body.codigoDet }}},
        {new:true},
    );

    await ticket.save();

    res.status(201).send(ticket_eli);

});// fin post de inserción



/* Modificar información con PUT */
router.put('/detalles',[
    check('nombreProd','Nombre mayor a 5 caracteres').isLength({min:5}),
    check('costoIndividual','Sólo numéros').isNumeric(),
    check('cantidadVendida','Sólo numéros').isNumeric(),
    check('totalDetalle','Sólo numéros').isNumeric(),

    check('nuevoPrecio','Sólo numéros').isNumeric(),
],async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    ticket= await Ticket.findById(req.body.codigoTick);

    if(!ticket.detalles){
        return res.status(422).send("No se encontró información");
    }

    var nuevoDetalle= {
        "nombreProd": req.body.nombreProd,
        "costoIndividual": req.body.costoIndividual,
        "cantidadVendida": req.body.cantidadVendida,
        "totalDetalle": req.body.totalDetalle, };

        ticket_eli = await Ticket.findOneAndUpdate(
            {_id: req.body.codigoTick },
            {$pull: { detalles:{ _id: req.body.codigoDet }}},
            {new:true}
        );

    await ticket.save();

    ticket_mod = await Ticket.findOneAndUpdate(
        {_id: req.body.codigoTick },
        {$push:{ detalles:nuevoDetalle}}
    );

    await ticket.save();

    ticket_mod = await Ticket.findOneAndUpdate(
        {_id: req.body.codigoTick },
        {"costoTotal": req.body.nuevoPrecio}
    );

    await ticket.save();

    //Respuesta exitosa y mostrar información
    res.status(201).send(ticket_mod);

});// fin post de inserción

/* Insertar información con post */
router.post('/detalles',[
    check('nombreProd','Nombre mayor a 5 caracteres').isLength({min:5}),
    check('costoIndividual','Sólo numéros').isNumeric(),
    check('cantidadVendida','Sólo numéros').isNumeric(),
    check('totalDetalle','Sólo numéros').isNumeric(),

    check('nuevoPrecio','Sólo numéros').isNumeric(),
],async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    ticket= await Ticket.findById(req.body.codigoTick);

    if(!ticket){
        return res.status(422).send("No se encontró información");
    }

    var nuevoDetalle= {
        "nombreProd": req.body.nombreProd,
        "costoIndividual": req.body.costoIndividual,
        "cantidadVendida": req.body.cantidadVendida,
        "total": req.body.totalDetalle, };

    ticket_mod = await Ticket.findOneAndUpdate(
        {_id: req.body.codigoTick },
        {$push:{ detalles:nuevoDetalle}}
    );

    await ticket.save();

    ticket_mod = await Ticket.findOneAndUpdate(
        {_id: req.body.codigoTick },
        {"costoTotal": req.body.nuevoPrecio}
    );

    await ticket.save();

    ticket= await Ticket.findById(req.body.codigoTick);

    //Respuesta exitosa y mostrar información
    res.status(201).send(ticket);

});// fin post de inserción

/* Modificar información con put */
router.put('/venta',[
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('nombreEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),
    check('tipoTicket','De 5 a 8 caracteres').isLength({min:5, max: 8}),

    check('total','Sólo numéros').isNumeric(),
    //check('fechaTicket','Tiene que ser fecha').isDate()
],async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    ticket= await Ticket.findOne({_id: req.body.codigo});

    if(!empleado){
        return res.status(422).send("No se encontró información");
    }

    ticket_mod = await Ticket.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        { _id: req.body.codigo },
        
            //Cosas que se van a cambiar
        {  
            "cliente.nombreCli": req.body.nombreCli,
            "cliente.apellidoPatCli": req.body.apellidoPatCli,
            "empleado.nombreEmp": req.body.nombreEmp,
            "empleado.apellidoPatEmp": req.body.apellidoPatEmp,
            "descuento.total": req.body.descuento,        
            "descuento.descripcion": req.body.descuentoDesc,
            "metodoPago": req.body.metodoPago,
            "tipoTicket": req.body.tipoTicket,
            "costoTotal": req.body.total,
            "fechaTicket": Date.now()
        },
        
            //Respuesta del metodo
        {
            new:true
        }
    );

    res.send({ticket_mod});

});//fin put de modificación



/*=================================================
============= Ticket Venta ========================
===================================================*/

/*GET Ticket
router.get('/', async function(req, res, next) {
    
    
    //Consultar todo
    await Ticket.find((err,ticket)=>{
        if(err){
            return res.status(404).send("No se encontrarón ticket");
        }

        res.send(ticket);
    }).clone();

    //res.send('Entraste a empleado');

});*/

//Método para consultar un solo documento con POST
router.post('/venta/buscar',[
],async(req,res)=>{
    //ticket =  await Ticket.find({tipoTicket: "Venta"}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    ticket =  await Ticket.findById(req.body.codigo/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

//Método para consultar TODAS LAS VENTAS
router.post('/venta/todo',[
],async(req,res)=>{
    ticket =  await Ticket.find({tipoTicket: "Venta"}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

/* Insertar información con post */
router.post('/venta',[
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('nombreEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),
    check('tipoTicket','De 5 a 8 caracteres').isLength({min:5, max: 8}),

    check('nombreProd','Nombre mayor a 5 caracteres').isLength({min:5}),
    check('costoIndividual','Sólo numéros').isNumeric(),
    check('cantidadVendida','Sólo numéros').isNumeric(),
    check('totalDetalle','Sólo numéros').isNumeric(),

    check('total','Sólo numéros').isNumeric(),
    //check('fechaTicket','Tiene que ser fecha').isDate()

],async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    var todayDate = new Date().toISOString().slice(0, 10);

    var nuevoDetalle= {
        "nombreProd": req.body.nombreProd,
        "costoIndividual": req.body.costoIndividual,
        "cantidadVendida": req.body.cantidadVendida,
        "total": req.body.totalDetalle};

    ticket = new Ticket({
        "cliente.nombreCli": req.body.nombreCli,
        "cliente.apellidoPatCli": req.body.apellidoPatCli,
        "empleado.nombreEmp": req.body.nombreEmp,
        "empleado.apellidoPatEmp": req.body.apellidoPatEmp,
        "descuento.total": req.body.descuento,        
        "descuento.descripcion": req.body.descuentoDesc,
        "metodoPago": req.body.metodoPago,
        "tipoTicket": req.body.tipoTicket,
        "detalles": nuevoDetalle,
        "costoTotal": req.body.total,
        "fechaTicket": todayDate
    });

    await ticket.save();

    //Respuesta exitosa y mostrar información
    res.status(201).send({ticket});

});// fin post de inserción

/* Modificar información con put */
router.put('/venta',[
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('nombreEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatEmp','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),
    check('tipoTicket','De 5 a 8 caracteres').isLength({min:5, max: 8}),
/*
    check('nombreProd','Nombre mayor a 5 caracteres').isLength({min:5}),
    check('costoIndividual','Sólo numéros').isNumeric(),
    check('cantidadVendida','Sólo numéros').isNumeric(),
    check('totalDetalle','Sólo numéros').isNumeric(),
*/
    check('total','Sólo numéros').isNumeric(),
    check('fechaTicket','Tiene que ser fecha').isDate()
],async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    ticket= await Ticket.findOne({_id: req.body.codigo});

    if(!ticket){
        return res.status(422).send("No se encontró información");
    }
/*
    var nuevoDetalle= {
        "nombreProd": req.body.nombreProd,
        "costoIndividual": req.body.costoIndividual,
        "cantidadVendida": req.body.cantidadVendida,
        "total": req.body.totalDetalle};
*/
    ticket_mod = await Ticket.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        { _id: req.body.codigo },
        
            //Cosas que se van a cambiar
        {  
            "cliente.nombreCli": req.body.nombreCli,
            "cliente.apellidoPatCli": req.body.apellidoPatCli,
            "empleado.nombreEmp": req.body.nombreEmp,
            "empleado.apellidoPatEmp": req.body.apellidoPatEmp,
            "descuento.total": req.body.descuento,        
            "descuento.descripcion": req.body.descuentoDesc,
            "metodoPago": req.body.metodoPago,
            "tipoTicket": req.body.tipoTicket,
            //"detallesVenta": req.body.nuevoDetalle,
            "costoTotal": req.body.total,
            "fechaTicket": req.body.fechaTicket
        },
        
            //Respuesta del metodo
        {
            new:true
        }
    );

    res.send({ticket_mod});

});//fin put de modificación

/* Eliminar información con POST */
router.post('/venta/borrar',async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    ticket = await Ticket.findOne({_id: req.body.codigo});

    if(!ticket){
        return res.status(422).send("No se ha podido eliminar");
    }

    ticket_eli = await Ticket.findOneAndDelete({_id: req.body.codigo});

    res.send({ticket_eli})
});// fin delete de eliminación

/*=================================================
============= Ticket Servicio ========================
===================================================*/

//Método para consultar un solo documento con POST
router.post('/servicio/buscar',[
],async(req,res)=>{
    //ticket =  await Ticket.find({tipoTicket: "Venta"}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    if(req.body.codigoTick!=""){
        ticket =  await Ticket.findById(req.body.codigoTick /* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    }else{
        return res.status(422).send("No hay información que mostrar");
    }
    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

//Método para consultar TODAS LAS VENTAS
router.post('/servicio/todo',[
],async(req,res)=>{
    ticket =  await Ticket.find({tipoTicket: "Servicio"}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

//FILTRAR POR ESTADO
router.post('/servicio/filtrar/estado',[
    check('estado','Seleccione un tipo de estado').isLength({min:5}),
],async(req,res)=>{
    ticket =  await Ticket.find({"detallesServicio.estado": req.body.estado });

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

/* Insertar información con post */
router.post('/servicio',[
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),

    check('calle','Mayor a 5 caracteres').isLength({min:5}),
    check('colonia','Mayor a 5 caracteres').isLength({min:5}),
    check('descProb','Mayor a 7 caracteres').isLength({min:7}),
    check('descViv','Mayor a 7 caracteres').isLength({min:7}),
    check('telefono','Sólo numéros').isNumeric().isLength({min:10, max:10}),

],async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    var todayDate = new Date().toISOString().slice(0, 10);

    ticket = new Ticket({
        "cliente.nombreCli": req.body.nombreCli,
        "cliente.apellidoPatCli": req.body.apellidoPatCli,
        "cliente.telefono": req.body.telefono,
        "empleado.nombreEmp": req.body.nombreEmp,
        "empleado.apellidoPatEmp": req.body.apellidoPatEmp,
        "descuento.total": req.body.descuento,        
        "descuento.descripcion": req.body.descuentoDesc,
        "metodoPago": req.body.metodoPago,
        "tipoTicket": "Servicio",
        
        "detallesServicio.calle": req.body.calle,
        "detallesServicio.colonia": req.body.colonia,
        "detallesServicio.descViv": req.body.descViv,
        "detallesServicio.descProb": req.body.descProb,
        "detallesServicio.fechaSol": todayDate,
        "detallesServicio.estado":"Sin revisar",
        "detallesServicio.fechaFin": "Sin finalizar",

        "costoTotal": req.body.total,
        "fechaTicket": todayDate
    });

    await ticket.save();

    //Respuesta exitosa y mostrar información
    res.status(201).send({ticket});

});// fin post de inserción

/* Modificar información con put */
router.put('/servicio',[
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),

    check('calle','Mayor a 5 caracteres').isLength({min:5}),
    check('colonia','Mayor a 5 caracteres').isLength({min:5}),
    check('descProb','Mayor a 7 caracteres').isLength({min:7}),
    check('descViv','Mayor a 7 caracteres').isLength({min:7}),
    check('telefono','Sólo numéros').isNumeric().isLength({min:10, max:10}),
],async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    if(req.body.codigoTick!=""){
        ticket =  await Ticket.findById(req.body.codigoTick /* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    }else{
        return res.status(422).send("No hay información que mostrar");
    }

    if(!ticket){
        return res.status(422).send("No se encontró información");
    }

    ticket_mod = await Ticket.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        { _id: req.body.codigoTick },
        
            //Cosas que se van a cambiar
        {  
            "cliente.nombreCli": req.body.nombreCli,
            "cliente.apellidoPatCli": req.body.apellidoPatCli,
            "cliente.telefono": req.body.telefono,
            "empleado.nombreEmp": req.body.nombreEmp,
            "empleado.apellidoPatEmp": req.body.apellidoPatEmp,
            "descuento.total": req.body.descuento,        
            "descuento.descripcion": req.body.descuentoDesc,
            "metodoPago": req.body.metodoPago,
            "tipoTicket": "Servicio",
            "costoTotal": req.body.costoTotal,

            "detallesServicio.calle": req.body.calle,
            "detallesServicio.colonia": req.body.colonia,
            "detallesServicio.descViv": req.body.descViv,
            "detallesServicio.descProb": req.body.descProb,
            "detallesServicio.fechaFin": req.body.fechaFin,
            "detallesServicio.estado": req.body.estado,
        },
        
            //Respuesta del metodo
        {
            new:true
        }
    );

    ticket= await Ticket.findOne({_id: req.body.codigoTick});

    res.send(ticket);

});//fin put de modificación

/* Eliminar información con POST */
router.post('/servicio/borrar',async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

     if(req.body.codigoTick!=""){
        ticket =  await Ticket.findById(req.body.codigoTick);
    }else{
        return res.status(422).send("No hay información que mostrar");
    }

    if(!ticket){
        return res.status(422).send("No se ha podido eliminar");
    }

    ticket_eli = await Ticket.findOneAndDelete({_id: req.body.codigoTick});

    res.send({ticket_eli})
});// fin delete de eliminación




/*=================================================
============= Ticket Envio ========================
===================================================*/

//Método para consultar un solo documento con POST
router.post('/envio/buscar',[
],async(req,res)=>{
    //ticket =  await Ticket.find({tipoTicket: "Venta"}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    if(req.body.codigoTick !=""){
        ticket =  await Ticket.findById(req.body.codigoTick /* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    }else{
        return res.status(422).send("No hay información que mostrar");
    }

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

//Método para consultar TODAS LAS VENTAS
router.post('/envio/todo',[
],async(req,res)=>{
    ticket =  await Ticket.find({tipoTicket: "Envio"}/* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

//FILTRAR POR ESTADO
router.post('/envio/filtrar/estado',[
    check('estado','Seleccione un tipo de estado').isLength({min:5}),
],async(req,res)=>{
    ticket =  await Ticket.find({"detallesEnvio.estadoEnvio": req.body.estado});

    //Mostrar errores check-validator
    const errores = validationResult(req);

    if(!ticket){
        return res.status(422).send("No hay información que mostrar");
    }

    res.send(ticket);

});//fin POST de consulta

/* Insertar información con post */
router.post('/envio',[
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),

    check('calle','Mayor a 5 caracteres').isLength({min:5}),
    check('colonia','Mayor a 5 caracteres').isLength({min:5}),
    check('telefono','Sólo numéros').isNumeric().isLength({min:10, max:10}),

    check('total','Sólo numéros').isNumeric(),
],async(req,res)=>{
 //Crear objeto en base a model y llenarlo con información

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    var todayDate = new Date().toISOString().slice(0, 10);

    var nuevoDetalle= {
        "nombreProd": req.body.nombreProd,
        "costoIndividual": req.body.costoIndividual,
        "cantidadVendida": req.body.cantidadVendida,
        "total": req.body.totalDetalle};

    ticket = new Ticket({
        "cliente.nombreCli": req.body.nombreCli,
        "cliente.apellidoPatCli": req.body.apellidoPatCli,
        "cliente.telefono": req.body.telefono,
        "descuento.total": req.body.descuento,        
        "descuento.descripcion": req.body.descuentoDesc,
        "metodoPago": req.body.metodoPago,
        "tipoTicket": "Envio",
        "detalles": nuevoDetalle,

        "detallesEnvio.calle": req.body.calle,
        "detallesEnvio.colonia": req.body.colonia,
        "detallesEnvio.fechaFin": "Sin finalizar",
        "detallesEnvio.ultimaActualizacion": todayDate,
        "detallesEnvio.estadoEnvio": "Sin revisar",
        
        "costoTotal": req.body.total,
        "fechaTicket": todayDate
    });

    await ticket.save();

    //Respuesta exitosa y mostrar información
    res.status(201).send({ticket});

});// fin post de inserción

/* Modificar información con put */
router.put('/envio',[
    /*
    check('nombreCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('apellidoPatCli','Solo letras y mayor a 3 caracteres').isLength({min:3}),
    check('metodoPago','De 6 a 18 caracteres').isLength({min:6, max: 18}),
    check('tipoTicket','De 5 a 8 caracteres').isLength({min:5, max: 8}),

    check('calle','Mayor a 5 caracteres').isLength({min:5}),
    check('colonia','Mayor a 5 caracteres').isLength({min:5}),
    check('telefono','Sólo numéros').isNumeric().isLength({min:10, max:10}),
    check('ultimaActualizacion','Tiene que ser fecha').isDate(),
    check('estadoEnvio','Mayor a 5 caracteres').isLength({min:5}),

    check('total','Sólo numéros').isNumeric()
    */
],async(req,res)=>{

    /*const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }*/

    if(req.body.codigoTick !=""){
        ticket =  await Ticket.findById(req.body.codigoTick /* BUSCAR SOLO CIERTOS CAMPOS, 'nombreEmp'*/);
    }else{
        return res.status(422).send("No hay información que mostrar");
    }

    if(!ticket){
        return res.status(422).send("No se encontró información");
    }

    ticket_mod = await Ticket.findOneAndUpdate(
        //Parametros del metodo FindOneAndUpdate
        
            //Parametro por el que se va a buscar
        { _id: req.body.codigoTick },
        
            //Cosas que se van a cambiar
        {  
            "cliente.nombreCli": req.body.nombreCli,
            "cliente.apellidoPatCli": req.body.apellidoPatCli,
            "descuento.total": req.body.descuento,        
            "descuento.descripcion": req.body.descuentoDesc,
            "metodoPago": req.body.metodoPago,
            "detallesEnvio.calle": req.body.calle,
            "detallesEnvio.colonia": req.body.colonia,
            "detallesEnvio.telefono": req.body.telefono,
            "detallesEnvio.fechaFin": req.body.fechaFin,
            "detallesEnvio.ultimaActualizacion": req.body.ultimaActualizacion,
            "detallesEnvio.estadoEnvio": req.body.estadoEnvio,
            "costoTotal": req.body.total,
            "fechaTicket": req.body.fechaTicket
        },
        
            //Respuesta del metodo
        {
            new:true
        }
    );

    ticket= await Ticket.findById({_id: req.body.codigoTick});

    res.send(ticket);

});//fin put de modificación

/* Eliminar información con POST */
router.post('/envio/borrar',async(req,res)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(422).send({error : errores.array()});
    }

    ticket = await Ticket.findOne({_id: req.body.codigoTick});

    if(!ticket){
        return res.status(422).send("No se ha podido eliminar");
    }

    ticket_eli = await Ticket.findOneAndDelete({_id: req.body.codigoTick});

    res.send({ticket_eli})
});// fin delete de eliminación


module.exports = router;