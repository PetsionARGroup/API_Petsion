const Contacto  = require ('../models/Contacto')


const contactoController = {
    create : async (req , res) =>{
        try {
            const { email , mensaje , fechaCreacion} = req.body;
            
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
                fechaCreacion: fechaCreacion || new Date(),
                respondido: false // Valor por defecto
            });

            // Guardar el contacto en la base de datos
            await nuevoContacto.save();

            // Devolver la respuesta con el objeto de contacto creado y el estado 201 (Created)
            res.status(201).json(nuevoContacto);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = contactoController;
