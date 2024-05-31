const Mascota = require('../models/Mascota');
const User = require ('../models/User')

const mascotaController = {
    create : async (req,res) => {
        try{
            //Se extraen los campos del cuerpo de la solicitud
            const { user , tipoMascota , nombre , edad , peso}= req.body;

            //Se verifica que el usuario se encuentre en la base de datos 
            const usuarioEncontrado = await User.findById(user);

            if (!usuarioEncontrado) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const existingname = await Mascota.findOne({ user , nombre });
            if (existingname) {
                return res.status(400).send({ message: "El nombre de la mascota ya está registrado" });
            }
            
            const mascota = new Mascota ({
                user : usuarioEncontrado,
                tipoMascota,
                nombre,
                edad,
                peso

            })
            // Guardar la mascota en la base de datos
            await mascota.save();
            // Devolver la respuesta con el objeto de mascota creado y el estado 201 (Created)
            res.status(201).json(mascota);
        } catch (error) {
            // Manejar cualquier error y devolver un mensaje de error con el estado 500 (Internal Server Error)
            res.status(500).json({ message: error.message });
        }
    },
    listarMascotas : async (req,res) => {
        try {
            const {user} = req.body;
            const mascotas = await Mascota.find({user : user})

            if(!mascotas.length){
                return res.status(404).json({message : 'No se encontro mascotas asignadas al usuario'})
            }
            res.status(200).json(mascotas);
        } catch (error) {
            res.status(500).json({message : error.message});
        }
    },
    delete: async (req, res) => {
        const { id } = req.body;
        try {
            const mascota = await Mascota.findById(id);
            if (!mascota) {
                return res.status(404).send("Mascota no encontrada");
            }
            // Elimina el usuario de la base de datos
            await Mascota.deleteOne({ _id: id });
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al eliminar la mascota");
        }
    }
};


module.exports = mascotaController;