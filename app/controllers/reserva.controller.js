const Reserva = require('../models/Reserva');
const User = require('../models/User');
const Anfitrion = require('../models/Anfitrion');

const reservaController = {
    create: async (req, res) => {
        try {
            // Extraer userId, anfitrionId y mensaje del cuerpo de la solicitud
            const { user, anfitrion, mensaje } = req.body;
    
            // Verificar si los IDs de usuario y anfitrión son válidos
            const usuarioEncontrado = await User.findById(user); // Cambiado de usuario a user
            const anfit = await Anfitrion.findById(anfitrion);
    
            // Si alguno de los documentos no existe, devolver un error 404
            if (!usuarioEncontrado) { // Cambiado de user a usuarioEncontrado
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            if (!anfit) {
                return res.status(404).json({ message: 'Anfitrion no encontrado' });
            }
    
            // Crear una nueva instancia de Reserva con los datos proporcionados
            const reserva = new Reserva({
                user: usuarioEncontrado._id, // Cambiado de user a usuarioEncontrado
                anfitrion: anfit._id, // Cambiado de anfitrion a anfit
                mensaje
            });
    
            // Guardar la reserva en la base de datos
            await reserva.save();
    
            // Devolver la respuesta con el objeto de reserva creado y el estado 201 (Created)
            res.status(201).json(reserva);
        } catch (error) {
            // Manejar cualquier error y devolver un mensaje de error con el estado 500 (Internal Server Error)
            res.status(500).json({ message: error.message });
        }
    },
    
    

    confirmar: async (req, res) => {
        try {
            const { confirmado } = req.body;
            const { id } = req.params;
    
            // Encontrar la reserva por su ID
            const reserva = await Reserva.findById(id);
    
            // Verificar si la reserva existe
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva not found' });
            }
    
            // Establecer el atributo confirmado como true
            reserva.confirmado = true;
            
            // Guardar los cambios en la base de datos
            await reserva.save();
    
            // Responder con la reserva actualizada
            res.status(200).json(reserva);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    listarReservas: async (req, res) => {
        try {
            const { anfitrion } = req.body;
    
            const reservas = await Reserva.find({ anfitrion: anfitrion })
                
    
            if (!reservas.length) {
                return res.status(404).json({ message: 'No se encontraron reservas' });
            }
    
            res.status(200).json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
};

module.exports = reservaController;
