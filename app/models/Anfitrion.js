const mongoose = require ('mongoose')

const AnfitrionSchema = new mongoose.Schema({
    username: { type: String, required: true, minLength: 5 },
    password: { type: String, required: true, minLength: 10 },
    name: { type: String, required: true, minLength: 3 },
    lastname: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true },
    dni: { type: String, required: true, minLength: 8 },
    fechaDeNacimiento: { type: Date, required: true },
    telefono: { type: String, required: true },
    direccion : {type:String, required : true},
    numeroDireccion:{type:String,required:true},
    codigoPostal: { type: String, required: true },
    tipoDeVivienda: { type: String, enum: ['casa', 'departamento'], required: true },
    conPatio: { type: Boolean, default: false, required: true },
    admitePerrosXL: { type: Boolean, required: true },
    admitePerrosL: { type: Boolean, required: true },
    admitePerrosM: { type: Boolean, required: true },
    admitePerrosS: { type: Boolean, required: true },
    distintoDueño : {type: Boolean, required : true},
    cantidadDeAnimales : {type : Number, require : true},
    admiteGato: { type: Boolean, required: true },
    disponibilidadHoraria: { type: String, enum: ['Mañana', 'Tarde', 'Noche', 'Fulltime', 'Variable'], required: true },
    disponibilidadPaseo: { type: Boolean, required: true },
    disponibilidadlunes : { type: Boolean, required: true },
    disponibilidadmartes : { type: Boolean, required: true },
    disponibilidadmiercoles: { type: Boolean, required: true },
    disponibilidadjueves: { type: Boolean, required: true },
    disponibilidadviernes: { type: Boolean, required: true },
    disponibilidadsabado: { type: Boolean, required: true },
    disponibilidaddomingo: { type: Boolean, required: true },
    tarifaBase: {type:Number, required:true},
    cancelaciones:{ type: Boolean, required: true }


});


module.exports= mongoose.model('Anfitrion', AnfitrionSchema)