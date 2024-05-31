const mongoose = require ( 'mongoose')

const ContactoSchema = new mongoose.Schema  ({
    email : {type : String , required : true},
    mensaje : {type : String , required : true},
    fechaCreacion: { type: Date, default: Date.now },
    respondido : {type : Boolean, default : false}
})

module.exports = mongoose.model('Contacto', ContactoSchema)