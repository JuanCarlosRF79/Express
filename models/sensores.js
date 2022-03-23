const mongoose = require('mongoose');

const arduinosensorSchema = new mongoose.Schema({

    lectura: String,
    fecha: Date,
    hora: String
    
});

mongoose.model('ArduinoSensor', arduinosensorSchema);