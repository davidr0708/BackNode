var express = require('express');
var bcrypt = require('bcryptjs'); // encriptar datos usuario 
var mdAutenticacion = require('../middleware/autenticacion');


var usuariosRoute = express(); // inicializa variables .... 


// importando esquemas de usuarios 

var Usuarios = require ('../model/usuario');

// obtener todos los usuarios 
usuariosRoute.get('/', (request,response, next) =>{

      //paginacion 
    // los objetos que esten en el query hacen relacion a objetos en la ruta ... 
    var paginacion = request.query.desde || 0;
    paginacion = Number(paginacion);


    Usuarios.find({}, 'nombre email img role google' )
            .skip(paginacion)
            .limit(5).exec( (err, usuarios) => {
                if (err) {
                    return response.status(500).json ({
                        ok: false,
                        messaje: 'Error base de datos',
                        errors: err
                    });
                }
        
        Usuarios.countDocuments({},(err, count) => {

            response.status(200).json({
                ok: true,
                Usuarios: usuarios,
                totalUsuarios: count
            });  
        });
     });
})


// crear usuario 

// llamamos a la funcion mdAutenticacion.verificarToken para hacer la validacion del token esto se debe llamar por cada funcion 
// que necesite una validacion de token ... 

usuariosRoute.post( '/', (req, res) => {
    
    var body = req.body;
   // console.log(body);
   // console.log(req);
    var usuario = new Usuarios ({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioResponse) => {
       
        if (err) {
            console.log(err)
            return res.status(400).json ({
                ok: false,
                messaje: 'Error crear usuario',
                errors: err
            });

            
        }

        res.status(201).json({
            ok: true,
            body: usuarioResponse
        });

    });

    
    
});


// Actualizar usuario 

usuariosRoute.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    
    var id = req.params.id;
    var body = req.body;

    Usuarios.findById(id , (err, usuario) => {

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
                errors: {messaje: 'No EXISTE     el usuario'}
            });
        }

        usuario.nombre = body.nombre === undefined || body.nombre === null ? usuario.nombre : body.nombre;
        usuario.role =  body.role === undefined || body.role === null ? usuario.role : body.role;
        usuario.email =  body.email === undefined || body.email === null ? usuario.email : body.email;

        usuario.save ((err, usuarioUpdate) => {

            if (err){
                return res.status(400).json ({
                    ok: false,
                    messaje: 'Error al actualizar Usuario',
                    errors: err
                });
            }

            usuarioUpdate.password = ':)';

            res.status(201).json({
                ok: true,
                usuario: usuarioUpdate
            });

        });
    });   
});



// Borrar usuario 

usuariosRoute.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id;

    Usuarios.findByIdAndRemove (id , (err, usuarioDelete) => {
        
        if (!usuarioDelete){
            return res.status(500).json({
                ok: true,
                messaje: 'No existe un usuario con ese id',
                error: { messaje: 'No existe un usuario con ese Id '}
            })
        }

        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error al borrar usuario de DB',
                error: err
            })
        }

        res.status(200).json({
            ok: true,
            messaje: usuarioDelete
        });

    });

});

// forma de exportar cualquier clase o componente que se requiera 

module.exports = usuariosRoute;