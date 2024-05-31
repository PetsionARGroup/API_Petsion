const mongoose = require ( 'mongoose');
const User = require('./User');
const Schema = mongoose.Schema;


const MascotaSchema = new mongoose.Schema ({
    user : { type : Schema.Types.ObjectId , ref : "User" , required : true},
    tipoMascota : { type : String ,enum : ['Perro','Gato', 'Otros'],  required : true},
    nombre : { type : String , required :  true},
    edad :  { type : Number, required : true},
    peso : { type : Number, required : true}
})

module.exports = mongoose.model ('Mascota', MascotaSchema)