const Reserva = require('../models/Reserva');
const User = require('../models/User');
const Anfitrion = require('../models/Anfitrion');
const user = require('./user.controller');
const Mascota = require ('../models/Mascota');
const { enviarCorreoReserva } = require('../helpers/handleEmailReserva');
const {enviarCorreoReservaConfirm} = require ('../helpers/handlEmailReservasConfirm')

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
            const usuario = await User.findById(reserva.user);

            if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener el email del usuario

            const emailUsuario = usuario.email;
    
            // Modificar el atributo confirmado solo si es diferente al actual
            if (reserva.confirmado !== confirmado) {
                reserva.confirmado = confirmado;
                if(confirmado){
                    reserva.reservaActiva =true
                }
                // Guardar los cambios en la base de datos
                await reserva.save();
            }
            await enviarCorreoReservaConfirm(emailUsuario)
            // Responder con la reserva actualizada
            res.status(200).json(reserva);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    listarReservas: async (req, res) => {
        try {
            const { anfitrion } = req.body;
    
            const reservas = await Reserva.find({ anfitrion: anfitrion , confirmado : false, rechazada: false} )
                .populate({
                    path: 'user',
                    select:' -role -validarCorreo -username -password -email -dni -fechaDeNacimiento -telefono -codigoPostal -__v -email'
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
            const now = new Date();
    
            const reservas = await Reserva.find({
                anfitrion: anfitrion,
                confirmado: true,
                $or: [
                    { fechaDeSalida: { $gt: now } },
                    {
                        fechaDeSalida: now,
                        horarioDeSalida: { $gt: now }
                    }
                ]
            })
            .populate({
                path: 'user',
                select: '-role -validarCorreo -_id -username -password -dni -fechaDeNacimiento -codigoPostal -__v'
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

    ReservAnfitrionFinalizada: async (req, res) => {
        try {
            const { anfitrion } = req.body;
            const now = new Date();
    
            const reservas = await Reserva.find({
                anfitrion: anfitrion,
                confirmado: true,
                $and: [
                    { fechaDeSalida: { $lt: now } },
                    { horarioDeSalida: { $lt: now } }
                ]
            })
            .populate({
                path: 'user',
                select: '-role -validarCorreo -_id -username -password -dni -fechaDeNacimiento -codigoPostal -__v'
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
    
            const reservas = await Reserva.find({ user: user , confirmado : false, rechazada : false})
            .select('user') // Llenar el campo 'user' con el objeto completo
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
            const now = new Date();
    
            const reservas = await Reserva.find({
                user: user,
                confirmado: true,
                $or: [
                    { fechaDeSalida: { $gt: now } },
                    {
                        fechaDeSalida: now,
                        horarioDeSalida: { $gt: now }
                    }
                ]
            })
            .select('-user') // Llenar el campo 'user' con el objeto completo
            .populate({
                path: 'anfitrion',
                select: '-validarCorreo -password -username -_id -dni -fechaDeNacimiento -numeroDireccion -codigoPostal -conPatio -distintoDueño -cantidadDeAnimales -admitePerro -admiteGato -admitAlltypesMascotas -disponibilidadHoraria -disponibilidadPaseo -disponibilidadVisita -disponibilidadAlojamiento -disponibilidadlunes -disponibilidadmartes -disponibilidadmiercoles -disponibilidadjueves -disponibilidadviernes -disponibilidadsabado -disponibilidaddomingo -tarifabase -cancelaciones -role -__v' // Excluir el campo 'password' del objeto 'anfitrion'
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
    
    rechazar : async(req,res) =>{
        try{
            const {id} = req.body;

            const reserva = await Reserva.findById(id);

            if(!reserva){
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }
            const usuario = await User.findById(reserva.user);

            if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener el email del usuario

            const emailUsuario = usuario.email;

            if (reserva.rechazar = true) {
        
                reserva.rechazada =true
                await reserva.save();
            }
            await enviarCorreoReserva(emailUsuario)

            res.status(200).json(reserva);
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    calificar: async (req, res) => {
        const { reservaId, rating } = req.body; 
    
        try {
            const reserva = await Reserva.findById(reservaId).populate('anfitrion');
            if (!reserva) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }
    
            // Verificar si la reserva está confirmada y la fecha de salida se ha cumplido
            if (!reserva.confirmado) {
                return res.status(400).json({ error: 'La reserva aún no está confirmada' });
            }
    
            const fechaActual = new Date();
            if (reserva.fechaDeSalida > fechaActual) {
                return res.status(400).json({ error: 'Aún no ha llegado la fecha de salida de la reserva' });
            }
    
            // Verificar si la reserva ya tiene una calificación distinta de cero
            if (reserva.rating !== 0) {
                return res.status(400).json({ error: 'La reserva ya ha sido calificada anteriormente' });
            }
    
            // Actualizar la reserva con la calificación
            reserva.rating = rating;
            await reserva.save();
    
            // Actualizar la puntuación del anfitrión
            const anfitrion = reserva.anfitrion;
            anfitrion.rating = ((anfitrion.rating * anfitrion.numberOfRatings) + rating) / (anfitrion.numberOfRatings + 1);
            anfitrion.numberOfRatings += 1;
            await anfitrion.save();
    
            res.json({ message: 'Calificación guardada con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al guardar la calificación' });
        }
    },
    listarReservasCalificar: async (req, res) => {
        try {
            const { user } = req.body;
            const now = new Date();
    
            const reservas = await Reserva.find({
                user: user,
                confirmado: true,
                $and: [
                    { fechaDeSalida: { $lt: now } },
                    { horarioDeSalida: { $lt: now } }
                ]
            })
            .select('-user') // Llenar el campo 'user' con el objeto completo
            .populate({
                path: 'anfitrion',
                select: '-validarCorreo -password -username -_id -dni -fechaDeNacimiento -numeroDireccion -codigoPostal -conPatio -distintoDueño -cantidadDeAnimales -admitePerro -admiteGato -admitAlltypesMascotas -disponibilidadHoraria -disponibilidadPaseo -disponibilidadVisita -disponibilidadAlojamiento -disponibilidadlunes -disponibilidadmartes -disponibilidadmiercoles -disponibilidadjueves -disponibilidadviernes -disponibilidadsabado -disponibilidaddomingo -tarifabase -cancelaciones -role -__v' // Excluir el campo 'password' del objeto 'anfitrion'
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
    delete: async (req, res) => {
        try {
            // Extraer el ID de la reserva de los parámetros de la solicitud
            const { id } = req.params;
    
            // Verificar si la reserva con el ID proporcionado existe
            const reserva = await Reserva.findById(id);
    
            // Si la reserva no existe, devolver un error 404
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }
    
            // Eliminar la reserva de la base de datos
            await Reserva.findByIdAndDelete(id);
    
            // Devolver una respuesta exitosa con un mensaje de confirmación
            res.status(200).json({ message: 'Reserva eliminada exitosamente' });
        } catch (error) {
            // Manejar cualquier error y devolver un mensaje de error con el estado 500 (Internal Server Error)
            res.status(500).json({ message: error.message });
        }
    }
    
    
};


module.exports = reservaController;
