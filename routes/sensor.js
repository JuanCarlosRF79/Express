
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Sensor = mongoose.model('ArduinoSensor');
const Readline = require('@serialport/parser-readline');

const SerialPort = require('serialport');

var arduinoPort = "COM4";
/*
const ReadLine = SerialPort.parsers.Readline;

var arduinoserialPort = new SerialPort(
    arduinoPort,
    {
        baudRate:115200,
    },
    function(err){
        if(err){
            return console.log('Error: ', err.message);
        }
    }
);

const parser = arduinoserialPort.pipe(new Readline({
    delimiter: '\r\n'
}));

let valorDistancia="";

router.get('/', async (req,res)=>{
    arduinoserialPort.resume();
    parser.on('data', function(data,err){
        if(err){
            return console.log(err);
        }

        console.log("valor: "+ data);
        valorDistancia = data.toString('utf8');
    })
    res.send({valorDistancia});
});

router.get('/detener', async(req,res)=>{
    arduinoserialPort.pause();
    console.log("Detenida la lectura");
    let lectura_fin="cerrar";
    res.send({lectura_fin});
});

router.post('/', async(req,res)=>{

    sensor = new Sensor({
        lectura: req.body.lectura,
        fecha: req.body.fecha,
        hora: req.body.hora
    });

    await sensor.save();

    res.status(201).send({sensor});
});

parser.on('open',function(err){
    if(err){
        return console.log(err);
    }
    console.log();
});

arduinoserialPort.on('error', function(err){
    if(err){
        return console.log(err);
    }
});
*/
module.exports = router;