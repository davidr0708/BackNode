var mongoose = require('mongoose');
var uniqueValidate = require('mongoose-unique-validator');

var Schema = mongoose.Schema

var rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE}, no es un rol permitido'
};

var usuarioSchema = new Schema ({
    nombre: {type: String, required: [true, 'El nombre es requrido'] },
    email: {type: String, unique:true, required: [true, 'El email es requrido'] },
    password: {type: String, required: [true, 'El contraseña es requrido'] },
    img: {type: String, required: false },
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }

});
usuarioSchema.plugin(uniqueValidate, {message:'El {PATH} debe se ùnico'})
// Usar el usuario fuera de esta clase ... 
module.exports = mongoose.model('Usuario',usuarioSchema)