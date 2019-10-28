var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');

var app = express(); // inicializa variables .... 
app.use(fileUpload());

//var Medico = require ('../model/medico');
var Usuario = require ('../model/usuario');
//var Hospital = require ('../model/hospitales');


app.put('/:tipo/:id', (req, res, next)=>{

    var tipo = req.params.tipo; // tipo al que pertenece la imagen medico usuario hospital
    var id = req.params.id; // id del usuario 
    console.log(tipo);
    // tipos validos 
    var tiposValidos = ['categorias','productos','usuarios']
  
    console.log (tiposValidos.indexOf(tipo) < 1);
    if (tiposValidos.indexOf(tipo) < 1){
        return res.status(400).json({
            ok:false,
            mensaje: 'No se encuentra dentro de los tipos validos',
            error: {message: 'No se encuentra dentro de los tipos validos, los tipos permitidos son: ' + tiposValidos.join() }
        });
    }

    if (!req.files){
        return res.status(400).json({
            ok:false,
            mensaje: 'no selecciono una imagen',
            error: {message: 'Debe cargar una imagen' }
        });
    }

    // nombre img 
    var archivo = req.files.imagen;
    var nombreCOrtado = archivo.name.split('.');
    var extensionArchivo = nombreCOrtado[nombreCOrtado.length - 1];

    var extensionesValidas = ['png','jpg','gif','jpeg']
    
    if (extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok:false,
            mensaje: 'Archivo No permitido',
            error: {message: 'Archivo No permitido, extenciones permitidas: ' + extensionesValidas.join() }
        });
    }

    // Nombre arch personalizado 
    var nombreArchivo = `${id} - ${ new Date().getMilliseconds()}.${extensionArchivo}`
    
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    // mover el archivo del temporal a un path 
    archivo.mv(path, err => {
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje: 'error al mover Archivo',
                error: {message: 'error al mover Archivo: ' + err }
            });
        }

        updateTipo (tipo, id, nombreArchivo, res);

    });

});

function updateTipo (tipo, id, path, res){
    switch (tipo){

        case 'usuarios':
            updateUsuarios(id,path,res);
            break;
        case 'categorias':
            //updateCategorias(id,path,res);
            break;
        case 'productos':
            //updateProductos(id,path,res);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Solo se busca en las colecciones de medicos, hospitales o usuarios',
                error : {messaje: 'tipo de tabla desconocido'}
            });
    }
}
/*
function updateCategorias(id,nombreArchivo,res){
    Hospital.findById(id, (err, categoria)=>{

        if (err) {
            return res.status(500).json ({
                ok: false,
                messaje: 'Error buscar el hospital',
                errors: err
            });
        }

        if (!categoria){
            return res.status(400).json ({
                ok: false,
                messaje: 'el hospital con id '+id+' no EXISTE!!!',
                errors: {messaje: 'No EXISTE el hospital'}
            });
        }

        var pathViejo = '.uploads/categorias/' + hospital.img
        
        //si existe elimina img anterior 
        if (fileSystem.existsSync(pathViejo)){
            fileSystem.unlinkSync(pathViejo);
        }

        hospital.img = nombreArchivo;

        hospital.save((err, hospitalActualizado)=>{

            if (err){
                return res.status(500).json({
                    ok:true,
                    mensaje: 'Ocurrio un error al actualizar la img',
                    error: err 
                });
            }
            hospitalActualizado.password = ':)';
            return res.status(200).json({
                ok:true,
                mensaje: 'Img de Actualizada',
                usuario: hospitalActualizado 
            });
        });   
    });
}
*/
function updateUsuarios(id, nombreArchivo, res) {
   
    Usuario.findById(id, (err, usuario)=>{

        if (err) {
            return res.status(500).json ({
                ok: false,
                messaje: 'Error buscar usuario',
                errors: err
            });
        }

        if (!usuario){
            return res.status(400).json ({
                ok: false,
                messaje: 'el usuario con id '+id+' no EXISTE!!!',
                errors: {messaje: 'No EXISTE el usuario'}
            });
        }

        var pathViejo = '.uploads/usuarios/' + usuario.img
        
        //si existe elimina img anterior 
        if (fileSystem.existsSync(pathViejo)){
            fileSystem.unlinkSync(pathViejo);
        }

        usuario.img = nombreArchivo;

        usuario.save((err, usuarioActualizado)=>{

            if (err){
                return res.status(500).json({
                    ok:true,
                    mensaje: 'Ocurrio un error al actualizar la img',
                    error: err 
                });
            }

            return res.status(200).json({
                ok:true,
                mensaje: 'Img de Usuario Actualizado',
                usuario: usuarioActualizado 
            });
        });   
    });
}
/*
function updateProductos(id,nombreArchivo,res) {       
    
        Medico.findById(id , (err, medico) => {
    
            if (err) {
                return res.status(500).json ({
                    ok: false,
                    messaje: 'Error buscando',
                    errors: err
                });
            }
    
            if (!medico){
                return res.status(400).json ({
                    ok: false,
                    messaje: 'el producto con id '+id+' no EXISTE!!!',
                    errors: {messaje: 'No EXISTE     el medico'}
                });
            }
    
            var pathViejo = '.uploads/medicos/' + medico.img
        
            //si existe elimina img anterior 
            if (fileSystem.existsSync(pathViejo)){
                fileSystem.unlinkSync(pathViejo);
            }
    
            medico.img = nombreArchivo;
    
            medico.save((err, medicoActualizado)=>{
    
                if (err){
                    return res.status(500).json({
                        ok:true,
                        mensaje: 'Ocurrio un error al actualizar la img',
                        error: err 
                    });
                }
    
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Img de Usuario Actualizado',
                    usuario: medicoActualizado 
                });
            }); 
        });   
}
*/
module.exports = app