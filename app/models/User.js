const mongoose = require ('mongoose')

const UsersSchema = new mongoose.Schema({
    username : {type:String , required : true , minLength: 5},
    password: {type:String , required : true , minLength: 10},
    name : { type:String , required : true , minLength: 3},
    lastname : {type:String , required : true , minLength: 3},
    email : { type:String , required : true },
    dni : {type:String , required : true , minLength: 7},
    fechaDeNacimiento:{type:String , required : true },
    telefono : {type:String , required : true },
    codigoPostal:{type:String , required : true },
    role:{type:String, default : 'user'},
    validarCorreo : {type : Boolean, default: false}
})

module.exports= mongoose.model('User', UsersSchema)