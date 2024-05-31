const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservaSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    usuarioNombre: { type: String, required: true },
    anfitrion: { type: Schema.Types.ObjectId, ref: 'Anfitrion', required: true },
    tipoDeServicio: { type: String, enum: ['Paseo', 'Cuidado de día', 'Alojamiento'], required: true },
    fechaDeEntrada: { type: Date, required: true },
    fechaDeSalida: { type: Date, required: true },
    horarioDeEntrada: { type: String, required: true },
    horarioDeSalida: { type: String, required: true },
    mascotasCuidado: [{ type: Schema.Types.ObjectId, ref: 'Mascota' }],
    mensaje: { type: String, required: true },
    reservaActiva: { type: Boolean, default: false },
    confirmado: { type: Boolean, default: false },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reserva', ReservaSchema);
