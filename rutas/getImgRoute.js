var express = require('express');
const path = require('path'); // ayuda a resolver la direccion donde se encuentra instalado el servidor de nodeJs
const fileSystem = require('fs');
var appRoute = express();

// rutas principal
appRoute.get('/:tipo/:img', (req,response, next) =>{

    var tipo = req.params.tipo;
    var img = req.params.img;
    console.log(tipo);
    console.log (img);

    var pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    // verificamos si la img existe 
    if (fileSystem.existsSync(pathImg)){
        response.sendFile(pathImg);
    }else {
        var imgNoEncontrada = path.resolve(__dirname, '../assets/imgBuscando.jpg');
        response.sendFile(imgNoEncontrada);
    }
})


module.exports = appRoute;