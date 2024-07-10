const mongoose = require ('mongoose')

const AnfitrionSchema = new mongoose.Schema({
    username: { type: String, required: true, minLength: 5 },
    password: { type: String, required: true, minLength: 10 },
    name: { type: String, required: true, minLength: 3 },
    lastname: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true },
    dni: { type: String, required: true, minLength: 7 },
    fechaDeNacimiento: { type: Date, required: true },
    telefono: { type: String, required: true },
    direccion : {type:String, required : true},
    numeroDireccion:{type:String,required:true},
    codigoPostal: { type: String, required: true },
    tipoDeVivienda: { type: String, enum: ['casa', 'departamento'], required: true },
    conPatio: { type: Boolean, default: false, required: true },
    distintoDueño : {type: Boolean, required : true},
    cantidadDeAnimales : {type : Number, required : true},
    admitePerro :{type:Boolean,required : true},
    admiteGato: { type: Boolean, required: true },
    admitAlltypesMascotas : { type: Boolean, required: true },
    disponibilidadHoraria: { type: String, enum: ['Mañana', 'Tarde', 'Noche', 'Fulltime', 'Variable'], required: true },
    disponibilidadPaseo: { type: Boolean, required: true },
    disponibilidadVisita: {type: Boolean, required:true},
    disponibilidadAlojamiento: {type: Boolean, required:true},
    disponibilidadlunes : { type: Boolean, required: true },
    disponibilidadmartes : { type: Boolean, required: true },
    disponibilidadmiercoles: { type: Boolean, required: true },
    disponibilidadjueves: { type: Boolean, required: true },
    disponibilidadviernes: { type: Boolean, required: true },
    disponibilidadsabado: { type: Boolean, required: true },
    disponibilidaddomingo: { type: Boolean, required: true },
    tarifaBase: {type:Number, required:true},
    cancelaciones:{ type: Boolean, required: true },
    role : {type: String, default : 'anfitrion'},
    descripcion: { type: String, default :"Añade una descripcion sobre ti aqui :D" },
    validarCorreo : {type : Boolean, default: false},
    rating: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 }
});


module.exports= mongoose.model('Anfitrion', AnfitrionSchema)