var express = require('express');
var appRoute = express();

// rutas principal
appRoute.get('/', (request,response, next) =>{

    response.status(200).json({
        ok: true,
        mensaje:' hola a todos .... '
    })

})

// forma de exportar cualquier clase o componente que se requiera 

module.exports = appRoute;