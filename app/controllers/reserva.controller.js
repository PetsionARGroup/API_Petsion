const Reserva = require('../models/Reserva');
const User = require('../models/User');
const Anfitrion = require('../models/Anfitrion');
const user = require('./user.controller');
const Mascota = require ('../models/Mascota')

const reservaController = {
    create: async (req, res) => {
        try {
            // Extraer los datos del cuerpo de la solicitud
            const { user, anfitrion, tipoDeServicio, fechaDeEntrada, fechaDeSalida, horarioDeEntrada, horarioDeSalida, mascotasCuidado, mensaje } = req.body;

            // Verificar si los IDs de usuario y anfitrión son válidos
            const usuarioEncontrado = await User.findById(user);
            const anfitrionEncontrado = await Anfitrion.findById(anfitrion);

            // Si alguno de los documentos no existe, devolver un error 404
            if (!usuarioEncontrado) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            if (!anfitrionEncontrado) {
                return res.status(404).json({ message: 'Anfitrión no encontrado' });
            }
            const mascotas = await Mascota.find({ _id: { $in: mascotasCuidado } });
            if (mascotas.length !== mascotasCuidado.length) {
                return res.status(404).json({ message: 'Una o más mascotas no fueron encontradas' });
            }

            // Crear una nueva instancia de Reserva con los datos proporcionados
            const reserva = new Reserva({
                user: usuarioEncontrado._id,
                anfitrion: anfitrionEncontrado._id,
                tipoDeServicio,
                fechaDeEntrada,
                fechaDeSalida,
                horarioDeEntrada,
                horarioDeSalida,
                mascotasCuidado: mascotas.map(mascota => mascota._id),
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
            const { confirmado } = req.body;  // Recibir el atributo confirmado del cuerpo de la solicitud
            const { id } = req.body;
    
            // Validar que el atributo confirmado esté presente y sea un booleano
            if (typeof confirmado !== 'boolean') {
                return res.status(400).json({ message: 'El atributo "confirmado" es requerido y debe ser un booleano' });
            }
    
            // Encontrar la reserva por su ID
            const reserva = await Reserva.findById(id);
    
            // Verificar si la reserva existe
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }
    
            // Modificar el atributo confirmado solo si es diferente al actual
            if (reserva.confirmado !== confirmado) {
                reserva.confirmado = confirmado;
                if(confirmado){
                    reserva.reservaActiva =true
                }
                // Guardar los cambios en la base de datos
                await reserva.save();
            }
    
            // Responder con la reserva actualizada
            res.status(200).json(reserva);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    listarReservas: async (req, res) => {
        try {
            const { anfitrion } = req.body;
    
            const reservas = await Reserva.find({ anfitrion: anfitrion , confirmado : false} )
                .populate({
                    path: 'user',
                    select:' -role -validarCorreo -_id -username -password -email -dni -fechaDeNacimiento -telefono -codigoPostal -__v -email'
                }) // Llenar el campo 'user' con el objeto completo
                .select('-anfitrion')
                .populate('mascotasCuidado'); // Llenar el campo 'mascotasCuidado' con los objetos completos
    
            if (!reservas.length) {
                return res.status(404).json({ message: 'No se encontraron reservas' });
            }
    
            res.status(200).json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listarReservasConfirmado: async (req, res) => {
        try {
            const { anfitrion } = req.body;
    
            const reservas = await Reserva.find({ anfitrion: anfitrion ,confirmado : true })
                .populate({
                    path: 'user',
                    select:' -role -validarCorreo -_id -username -password -dni -fechaDeNacimiento -codigoPostal -__v'
                }) // Llenar el campo 'user' con el objeto completo
                .select('-anfitrion')
                .populate('mascotasCuidado'); // Llenar el campo 'mascotasCuidado' con los objetos completos
    
            if (!reservas.length) {
                return res.status(404).json({ message: 'No se encontraron reservas' });
            }
    
            res.status(200).json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listarReservasUser: async (req, res) => {
        try {
            const { user } = req.body;
    
            const reservas = await Reserva.find({ user: user , confirmado : false})
            .select('-user') // Llenar el campo 'user' con el objeto completo
            .populate({
                path: 'anfitrion',
                select: '-validarCorreo -password -username -_id -dni -fechaDeNacimiento -telefono -numeroDireccion -codigoPostal -conPatio -distintoDueño -cantidadDeAnimales -admitePerro -admiteGato -admitAlltypesMascotas -disponibilidadHoraria -disponibilidadPaseo -disponibilidadVisita -disponibilidadAlojamiento -disponibilidadlunes -disponibilidadmartes -disponibilidadmiercoles -disponibilidadjueves -disponibilidadviernes -disponibilidadsabado -disponibilidaddomingo -tarifabase -cancelaciones -role -__v -email' // Excluir el campo 'password' del objeto 'anfitrion'

            })
            .populate('mascotasCuidado'); // Llenar el campo 'mascotasCuidado' con los objetos completos    
    
            if (!reservas.length) {
                return res.status(404).json({ message: 'No se encontraron reservas' });
            }
    
            res.status(200).json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listarReservasUserConfirmado: async (req, res) => {
        try {
            const { user } = req.body;
    
            const reservas = await Reserva.find({ user: user , confirmado : true})
            .select('-user') // Llenar el campo 'user' con el objeto completo
            .populate({
                path: 'anfitrion',
                select: '-validarCorreo -password -username -_id -dni -fechaDeNacimiento -numeroDireccion -codigoPostal -conPatio -distintoDueño -cantidadDeAnimales -admitePerro -admiteGato -admitAlltypesMascotas -disponibilidadHoraria -disponibilidadPaseo -disponibilidadVisita -disponibilidadAlojamiento -disponibilidadlunes -disponibilidadmartes -disponibilidadmiercoles -disponibilidadjueves -disponibilidadviernes -disponibilidadsabado -disponibilidaddomingo -tarifabase -cancelaciones -role -__v ' // Excluir el campo 'password' del objeto 'anfitrion'

            })
            .populate('mascotasCuidado'); // Llenar el campo 'mascotasCuidado' con los objetos completos    
    
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
