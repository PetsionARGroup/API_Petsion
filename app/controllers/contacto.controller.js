const Contacto  = require ('../models/Contacto')
const {enviarCorreoContacto} = require('../helpers/handleMailContacto')


const contactoController = {
    create : async (req , res) =>{
        try {
            const { email , mensaje } = req.body;
            
            const validateEmail = (email) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(String(email).toLowerCase());
            };
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Email no válido' });
            }
            const nuevoContacto = new Contacto({
                email,
                mensaje,
                respondido: false // Valor por defecto
            });
            await enviarCorreoContacto (nuevoContacto.email,nuevoContacto.mensaje)

            // Guardar el contacto en la base de datos
            await nuevoContacto.save();

            // Devolver la respuesta con el objeto de contacto creado y el estado 201 (Created)
            res.status(201).json(nuevoContacto);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    list: async(req,res,next)=>{
        try{
            const listAll = await Contacto.find({})
            res.send({data : listAll})
        }
        catch(e){
            httpError(res,e)
        }
    },
}

module.exports = contactoController;
