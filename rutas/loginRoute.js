var express = require('express');
var bcrypt = require('bcryptjs'); // encriptar datos usuario 
var jwt = require ('jsonwebtoken'); // genera tokens para login
var SEMILLA = require('../config/constantes').SEMILLA; 

// google
var ClientId = require('../config/constantes').ClientId;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client (ClientId);

// inicializar el express 
var loginRoute = express();

// importando esquemas de usuarios 
var Usuario = require ('../model/usuario');


/*

// inicio de GOOGLE 
async function verify (token){

    const ticket = await client.verifyIdToken({

        idToken :token,
        audience: ClientId
    });

    const payload = ticket.getPayload();
    // const userId = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


loginRoute.post ('/google', async (req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token).catch( e => {
       
        return res.status(403).json({
            ok:false,
            messaje: 'Ingreso no valido '
        });
    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioLoguead) => {
        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error DB login Usuario',
                error: err
            });
        }

        if (usuarioLoguead){

            if (usuarioLoguead.google === false){
                return res.status(400).json({
                    ok: false,
                    messaje: 'El usuario debe usar su autenticacion normal',
                });
            } else {

                // crear token 
                // se genera a traves de sing se envia el usuario, una llave cualquiera string [firma con la que se valida el token],
                // y el tiempo donde debe expirar o terminar 144400 representa a 4 horas
                var token = jwt.sign({usuario: usuarioLoguead}, SEMILLA, {expiresIn: 14400})
                console.log(token);    
                res.status(201).json({
                    ok:true,
                    usuario: usuarioLoguead,
                    id: usuarioLoguead._id,
                    token: token
                });
            }           
        } else {
            
            // si el usuario no existe se crea en la DB
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDb)=> {

                // crear token 
                // se genera a traves de sing se envia el usuario, una llave cualquiera string [firma con la que se valida el token],
                // y el tiempo donde debe expirar o terminar 144400 representa a 4 horas
                var token = jwt.sign({usuario: usuarioDb}, SEMILLA, {expiresIn: 14400})
                console.log(token);    
                res.status(201).json({
                    ok:true,
                    usuario: usuarioDb,
                    // id: usuarioDb._id,
                    token: token
                });

            });

            
        }

        


    });

    return res.status(201).json({
        ok:true,
        usuario: usuarioLoguead,
        googleUser: googleUser
    });

});



*/

// validadndo servicio login 
// crea token para continuar con las demas funciones de la aplicacion ... 

loginRoute.post ('', (req, res) => {

    var body = req.body;
    console.log(body); 
    Usuario.findOne({ email: body.email }, (err, usuarioLoguead) => {
       
        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error DB login Usuario',
                error: err
            });
        }

        if (!usuarioLoguead){
            return res.status(400).json({
                ok: true,
                messaje: 'Error Credenciales Incorrectas - email',
            });
        }

        console.log(usuarioLoguead); 
        console.log(bcrypt.compareSync(body.password, usuarioLoguead.password));
        if (!bcrypt.compareSync(body.password, usuarioLoguead.password)){
            return res.status(400).json({
                ok: true,
                messaje: 'Error Credenciales Incorrectas - password',
            });
        }

        // para no enviar el pass al front no debe conocerlo .... 
        usuarioLoguead.password = ':)'
        console.log(usuarioLoguead);  
        // crear token 
        // se genera a traves de sing se envia el usuario, una llave cualquiera string [firma con la que se valida el token],
        // y el tiempo donde debe expirar o terminar 144400 representa a 4 horas
        var token = jwt.sign({usuario: usuarioLoguead}, SEMILLA, {expiresIn: 14400})
        console.log(token);    
        res.status(201).json({
            ok:true,
            usuario: usuarioLoguead,
            id: usuarioLoguead._id,
            token: token
        });

    });

});



// forma de exportar cualquier clase o componente que se requiera 

module.exports = loginRoute;