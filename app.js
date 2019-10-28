// Requeridos 
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser');

// inicializar variables 
var app = express();

// CORS 

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
  });



// Importando componentes de otras clase 
var appRoutsGeneral = require('./rutas/appRoute'); // trabajando con rutas .... 
var appRoutsUsuario = require('./rutas/usuariosRoute'); // trabajando con rutas .... 
var appRoutsLogin = require('./rutas/loginRoute'); // trabajando con rutas .... 

/*var appRoutsHospital = require('./rutas/hospitalRoute'); // trabajando con rutas .... 
var appRoutsMedicos = require('./rutas/medicosRoute'); // trabajando con rutas .... 
var appSearchAll = require('./rutas/busquedaRout'); // trabajando con rutas .... 
*/
var appUploadArchive = require('./rutas/cargarArchivosRoute'); // trabajando con rutas .... 
var appGetArchive = require('./rutas/getImgRoute'); // trabajando con rutas .... 


// usando body parser middelware 
//  este tipo de funciones con use siempre se ejecutan 
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


//conexion DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDb', { useNewUrlParser: true, useUnifiedTopology: true } , (err, response) => {
    if (err) { 
        console.log('ERROR EN CONECCION DB ...... '+ err);
        throw err;       
    }
    console.log('DB corriendo exitosamente puerto 27017')

})

mongoose.set('useCreateIndex', true);



app.listen(3000, () => {console.log('Express server corriendo en puerto 3000')})



// Rutas 
app.use('/login', appRoutsLogin)
app.use('/img', appGetArchive)
app.use('/uploads', appUploadArchive)
// app.use('/busqueda', appSearchAll)
app.use('/usuario', appRoutsUsuario)
app.use('/', appRoutsGeneral)

