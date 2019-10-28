/*var express = require('express');
var bcrypt = require('bcryptjs'); // encriptar datos usuario 
var mdAutenticacion = require('../middleware/autenticacion');


var app = express(); // inicializa variables .... 


// importando esquemas de usuarios 

var Medicos = require ('../model/medico');
//var Hospital = require ('../model/hospitales');
// var Usuario = require ('../model/usuario');


// obtener busquedas especificas 

app.get('/colecciones/:tabla/:busqueda', (req, res) => {

    
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i')
    // console.log(tabla)
    var promesa;

    switch (tabla){

        case 'usuarios':
            
            promesa = busquedaUsuarios(regex);
            
            break;
        case 'hospitales':
            promesa = busquedaHospitales(regex);
            break;
        case 'medicos':
            promesa = busquedaMedicos(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Solo se busca en las colecciones de medicos, hospitales o usuarios',
                error : {messaje: 'tipo de tabla desconocido'}
            });
    }

    promesa.then(data => {
        // console.log('datos '+ data)
        res.status(200).json({
            ok: true,
            tabla: data
        });
    });

});

// obtener busqueda por todos las entidades 
app.get('/todo/:busqueda', (request,response, next) =>{

    // recogemos lo que venga en el query...

    var busqueda = request.query.busqueda;
    var regex = new RegExp(busqueda, 'i'); //

    // paginacion 
    // los objetos que esten en el query hacen relacion a objetos en la ruta ... 
    // var paginacion = request.query.desde || 0;
    // paginacion = Number(paginacion);

    Promise.all([
            busquedaHospitales(regex),
            busquedaMedicos(regex),
            busquedaUsuarios(regex)])
        .then(respuesta => {
            response.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2]
            });
        });
});


// forma de exportar cualquier clase o componente que se requiera 

function busquedaHospitales ( regex ){
  
    return new Promise ((resolve, reject)=> {
        Hospital.find( {nombre: regex } )
        .populate('usuario', 'nombre email')
        .exec( (err, hospital) => {
          
            if (err) {
                reject ('Error al cargar hospitales', err)
            } else {
                resolve (hospital);
            }
        });
    });
}

function busquedaMedicos ( regex ){
  
    return new Promise ((resolve, reject)=> {
        Medicos.find( {nombre: regex } )
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err, medicos) => {
          
            if (err) {
                reject ('Error al cargar medicos', err)
            } else {
                resolve (medicos);
            }
        });
    });
}

function busquedaUsuarios ( regex ){
  
    return new Promise ((resolve, reject)=> {
        Usuario
        .find({}, 'nombre email role google')
        .or([{'nombre': regex }, {'email': regex }])
        .exec( (err, usuarios) => {
          
            if (err) {
                reject ('Error al cargar usuarios', err)
            } else {
                // console.log(usuarios)
                resolve (usuarios);
            }
        });
    });
}

module.exports = app
*/