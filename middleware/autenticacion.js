var jwt = require ('jsonwebtoken'); // genera tokens para login
var SEMILLA = require('../config/constantes').SEMILLA; // usado para validar tokens 


// middelware VALIDACION DEL TOKEN 
// esta linea de codigo hace que siempre antes de ir a los demas metodos pase por aqui .... antes de cualquier accion entra por aca
// y valida el token creado .... 

exports.verificarToken = function(req, res, next){

    var token = req.query.token; 

    jwt.verify(token, SEMILLA, (err, decoded) => {

        if (err){
            // no autorizado
            return res.status(401).json({
                ok:false,
                messaje: 'Token Incorrecto',
                errors: err
            });
        }

        // en el decoded siempre encontrara informacion de quien hace la peticion del servicio .... en este caso sera el usuario 
        // al hacer esto y enviarlo asi la informacion estara disponible para hacer la peticion 
        req.usuario = decoded.usuario;


        /*res.status(200).json({
            ok:false,
            decoded: decoded
        });*/

        // el next permite continuar con las demas funciones del .... sin esto no continua .... 
        next();

    });
}


/*
app.use('/', (req, res, next) => {

    var token = req.query.token; 

    jwt.verify(token, SEMILLA, (err, decoded) => {

        if (err){
            // no autorizado
            return res.status(401).json({
                ok:false,
                messaje: 'Token Incorrecto',
                errors: err
            });
        }

        // el next permite continuar con las demas funciones del .... sin esto no continua .... 
        next();

    });

});
*/