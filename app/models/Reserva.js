const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
    user: { type: String, required: true },
    anfitrion: { type: String, required: true },
    mensaje: { type: String, required: true },
    confirmado: { type: Boolean, default: false },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reserva', ReservaSchema);

