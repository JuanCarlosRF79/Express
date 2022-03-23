var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var app = express();

const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://Juan:josue2314@ejemplo5a.fhxsg.mongodb.net/ejemplo5A?retryWrites=true&w=majority');

app.use(cors({
  origin: "*",
  methods: "GET,POTS,PUT,DELETE",
  optionsSuccessStatus: 204,
  preflightContinue: false
}))

//Schema mongoose
require('./models/clientes');
require('./models/empleados');
require('./models/productos');
require('./models/tickets');
require('./models/usuarios');
require('./models/sensores');

//Rutas
var indexRouter = require('./routes/index');
var usuarioRouter = require('./routes/usuario');
var empleadoRouter = require('./routes/empleado');
var clienteRouter = require('./routes/cliente');
var productoRouter = require('./routes/producto');
var ticketRouter = require('./routes/ticket');
var sensorRouter = require('./routes/sensor');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/foto',express.static(__dirname+'/almacen/img'));

//USAR Rutas
app.use('/', indexRouter);
app.use('/usuario', usuarioRouter);
app.use('/empleado', empleadoRouter);
app.use('/cliente', clienteRouter);
app.use('/producto', productoRouter);
app.use('/ticket', ticketRouter);
app.use('/sensor', sensorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;