const Anfitrions =require('../models/Anfitrion')
const {httpError} = require('../helpers/handleError')
const { modify } = require('./user.controller')
const anfitrion = {
    list: async(req,res)=>{
        try{
            const listAll = await Anfitrions.find({})
            res.send({data : listAll})
        }
        catch(e){
            httpError(res,e)
        }
    },
    get :async(req,res)=>{
        try {
            const { id } = req.params;
            const anfitrion = await Anfitrions.findById(id);
            if (!anfitrion) {
                return res.status(404).send({ message: "Anfitrion no encontrado" });
            }
            res.status(200).send(anfitrion);
        } catch (e) {
            httpError(res, e);
        }
    },
    searchPerrosL: async (req, res) => {
        try {
            const { admitePerrosL } = req.body;
            const query = { admitePerrosL: admitePerrosL !== undefined ? admitePerrosL : true };
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que aceptan perros grandes' });
        }
    },
    searchPerrosM: async (req, res) => {
        try {
            // Extrae el valor de 'admitePerrosM' del cuerpo de la solicitud
            const { admitePerrosM } = req.body;
            // Define una consulta para buscar anfitriones que acepten perros medianos
            // Si 'admitePerrosM' está definido en la solicitud y no es 'undefined', utiliza su valor
            // Si no está definido, establece 'admitePerrosM' en 'true' para buscar todos los anfitriones que acepten perros medianos
            const query = { admitePerrosM: admitePerrosM !== undefined ? admitePerrosM : true };
            // Ejecuta la consulta utilizando el modelo 'Anfitrions' y la consulta definida
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que aceptan perros medianos' });
        }
    },
    
    searchPerrosS: async (req, res) => {
        try {
            const { admitePerrosS } = req.body;
            const query = { admitePerrosS: admitePerrosS !== undefined ? admitePerrosS : true };
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que aceptan perros pequeños' });
        }
    },
    
    searchGatos: async (req, res) => {
        try {
            const { admiteGato } = req.body;
            const query = { admiteGato: admiteGato !== undefined ? admiteGato : true };
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que aceptan gatos' });
        }
    },
    searchAdmitAlltypesMascotas: async (req, res) => {
        try {
            const { admitAlltypesMascotas } = req.body;
            const query = { admitAlltypesMascotas: admitAlltypesMascotas !== undefined ? admitAlltypesMascotas : true };
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que admiten todo tipo de mascotas' });
        }
    },
    
    searchAdmitePerrosXL: async (req, res) => {
        try {
            const { admitePerrosXL } = req.body;
            const query = { admitePerrosXL: admitePerrosXL !== undefined ? admitePerrosXL : true };
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que admiten perros grandes' });
        }
    },
    

    create: async (req, res) => {
        try {
            const { 
                username, 
                password, 
                name, 
                lastname, 
                email, 
                dni, 
                fechaDeNacimiento, 
                telefono, 
                direccion,
                numeroDireccion,
                codigoPostal, 
                tipoDeVivienda, 
                conPatio, 
                admitePerrosXL,
                admitePerrosL,
                admitePerrosM,
                admitePerrosS,
                distintoDueño, 
                cantidadDeAnimales, 
                admiteGato, 
                admitAlltypesMascotas,
                disponibilidadHoraria, 
                disponibilidadPaseo, 
                disponibilidadlunes,
                disponibilidadmartes,
                disponibilidadmiercoles,
                disponibilidadjueves,
                disponibilidadviernes,
                disponibilidadsabado,
                disponibilidaddomingo,
                tarifaBase, 
                cancelaciones 
            } = req.body;
                        
            // Verifica si el username ya está registrado
            const existingUsername = await Anfitrions.findOne({ username });
            if (existingUsername) {
                return res.status(400).send({ message: "El nombre de usuario ya está registrado" });
            }
    
            // Verifica si el email ya está registrado
            const existingEmail = await Anfitrions.findOne({ email });
            if (existingEmail) {
                return res.status(400).send({ message: "El correo electrónico ya está registrado" });
            }
    
            // Verifica si el dni ya está registrado
            const existingDNI = await Anfitrions.findOne({ dni });
            if (existingDNI) {
                return res.status(400).send({ message: "El DNI ya está registrado" });
            }
    
            // Comprobación de que el nombre no contiene caracteres especiales
            if (!/^[a-zA-Z\s]+$/.test(name)) {
                return res.status(400).send({ message: "El nombre no puede contener caracteres especiales" });
            }
    
            // Comprobación de que el nombre no contiene números
            if (/\d/.test(name)) {
                return res.status(400).send({ message: "El nombre no puede contener números" });
            }
    
            // Comprobación de que no todos los caracteres del nombre son iguales
            if (/^([^\s])\1+$/.test(name)) {
                return res.status(400).send({ message: "El nombre no puede contener todos los caracteres iguales" });
            }
    
            // Comprobación de que el apellido no contiene caracteres especiales
            if (!/^[a-zA-Z\s]+$/.test(lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener caracteres especiales" });
            }
    
            // Comprobación de que el apellido no contiene números
            if (/\d/.test(lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener números" });
            }
    
            // Comprobación de que no todos los caracteres del apellido son iguales
            if (/^([^\s])\1+$/.test(lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener todos los caracteres iguales" });
            }
    
            // Verifica si el dni solo contiene números y no tiene espacios ni caracteres especiales
            if (!/^\d+$/.test(dni)) {
                return res.status(400).send({ message: "El DNI solo puede contener números sin espacios ni caracteres especiales" });
            }
    
            // Crea el nuevo anfitrión
            const newAnfitrion = await Anfitrions.create({
                username, 
                password, 
                name, 
                lastname, 
                email, 
                dni, 
                fechaDeNacimiento, 
                telefono, 
                direccion,
                numeroDireccion,
                codigoPostal, 
                tipoDeVivienda, 
                conPatio, 
                admitePerrosXL,
                admitePerrosL,
                admitePerrosM,
                admitePerrosS,
                distintoDueño, 
                cantidadDeAnimales, 
                admiteGato, 
                admitAlltypesMascotas,
                disponibilidadHoraria, 
                disponibilidadPaseo, 
                disponibilidadlunes,
                disponibilidadmartes,
                disponibilidadmiercoles,
                disponibilidadjueves,
                disponibilidadviernes,
                disponibilidadsabado,
                disponibilidaddomingo,
                tarifaBase, 
                cancelaciones  
            });
    
            res.status(201).send({ data: newAnfitrion });
        } catch (e) {
            httpError(res, e);
        }
    },
    
    
    update: async (req, res) => {
        const { id } = req.params;
        try {
            // Buscar el anfitrión por su ID
            const anfitrion = await Anfitrions.findById(id);
            if (!anfitrion) {
                return res.status(404).send("Anfitrion no encontrado");
            }
    
            // Verifica si el username ya está registrado
            if (req.body.username && req.body.username !== anfitrion.username) {
                const existingUsername = await Anfitrions.findOne({ username: req.body.username });
                if (existingUsername) {
                    return res.status(400).send({ message: "El nombre de usuario ya está registrado" });
                }
            }
    
            // Verifica si el email ya está registrado
            if (req.body.email && req.body.email !== anfitrion.email) {
                const existingEmail = await Anfitrions.findOne({ email: req.body.email });
                if (existingEmail) {
                    return res.status(400).send({ message: "El correo electrónico ya está registrado" });
                }
            }
    
            // Verifica si el dni ya está registrado
            if (req.body.dni && req.body.dni !== anfitrion.dni) {
                const existingDNI = await Anfitrions.findOne({ dni: req.body.dni });
                if (existingDNI) {
                    return res.status(400).send({ message: "El DNI ya está registrado" });
                }
            }
    
            // Comprobación de que el nombre no contiene caracteres especiales
            if (req.body.name && !/^[a-zA-Z\s]+$/.test(req.body.name)) {
                return res.status(400).send({ message: "El nombre no puede contener caracteres especiales" });
            }
    
            // Comprobación de que el nombre no contiene números
            if (req.body.name && /\d/.test(req.body.name)) {
                return res.status(400).send({ message: "El nombre no puede contener números" });
            }
    
            // Comprobación de que no todos los caracteres del nombre son iguales
            if (req.body.name && /^([^\s])\1+$/.test(req.body.name)) {
                return res.status(400).send({ message: "El nombre no puede contener todos los caracteres iguales" });
            }
    
            // Comprobación de que el apellido no contiene caracteres especiales
            if (req.body.lastname && !/^[a-zA-Z\s]+$/.test(req.body.lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener caracteres especiales" });
            }
    
            // Comprobación de que el apellido no contiene números
            if (req.body.lastname && /\d/.test(req.body.lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener números" });
            }
    
            // Comprobación de que no todos los caracteres del apellido son iguales
            if (req.body.lastname && /^([^\s])\1+$/.test(req.body.lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener todos los caracteres iguales" });
            }
    
            // Verifica si el dni solo contiene números y no tiene espacios ni caracteres especiales
            if (req.body.dni && !/^\d+$/.test(req.body.dni)) {
                return res.status(400).send({ message: "El DNI solo puede contener números sin espacios ni caracteres especiales" });
            }
    
            // Actualiza las propiedades del anfitrión con req.body
            Object.assign(anfitrion, req.body);
    
            // Guarda el anfitrión actualizado en la base de datos
            await anfitrion.save();
    
            res.sendStatus(204);
        } catch (e) {
            httpError(res, e);
        }
    }, 

    modify: async (req, res) => {
    const { id } = req.params;
    try {
        const anfitrion = await Anfitrions.findById(id);
        if (!anfitrion) {
            return res.status(404).send("Anfitrion no encontrado");
        }

        // Verifica si el username ya está registrado
        if (req.body.username && req.body.username !== anfitrion.username) {
            const existingUsername = await Anfitrions.findOne({ username: req.body.username });
            if (existingUsername) {
                return res.status(400).send({ message: "El nombre de usuario ya está registrado" });
            }
        }

        // Verifica si el email ya está registrado
        if (req.body.email && req.body.email !== anfitrion.email) {
            const existingEmail = await Anfitrions.findOne({ email: req.body.email });
            if (existingEmail) {
                return res.status(400).send({ message: "El correo electrónico ya está registrado" });
            }
        }

        // Verifica si el dni ya está registrado
        if (req.body.dni && req.body.dni !== anfitrion.dni) {
            const existingDNI = await Anfitrions.findOne({ dni: req.body.dni });
            if (existingDNI) {
                return res.status(400).send({ message: "El DNI ya está registrado" });
            }
        }

        // Comprobación de que el nombre no contiene caracteres especiales
        if (req.body.name && !/^[a-zA-Z\s]+$/.test(req.body.name)) {
            return res.status(400).send({ message: "El nombre no puede contener caracteres especiales" });
        }

        // Comprobación de que el nombre no contiene números
        if (req.body.name && /\d/.test(req.body.name)) {
            return res.status(400).send({ message: "El nombre no puede contener números" });
        }

        // Comprobación de que no todos los caracteres del nombre son iguales
        if (req.body.name && /^([^\s])\1+$/.test(req.body.name)) {
            return res.status(400).send({ message: "El nombre no puede contener todos los caracteres iguales" });
        }

        // Comprobación de que el apellido no contiene caracteres especiales
        if (req.body.lastname && !/^[a-zA-Z\s]+$/.test(req.body.lastname)) {
            return res.status(400).send({ message: "El apellido no puede contener caracteres especiales" });
        }

        // Comprobación de que el apellido no contiene números
        if (req.body.lastname && /\d/.test(req.body.lastname)) {
            return res.status(400).send({ message: "El apellido no puede contener números" });
        }

        // Comprobación de que no todos los caracteres del apellido son iguales
        if (req.body.lastname && /^([^\s])\1+$/.test(req.body.lastname)) {
            return res.status(400).send({ message: "El apellido no puede contener todos los caracteres iguales" });
        }

        // Verifica si el dni solo contiene números y no tiene espacios ni caracteres especiales
        if (req.body.dni && !/^\d+$/.test(req.body.dni)) {
            return res.status(400).send({ message: "El DNI solo puede contener números sin espacios ni caracteres especiales" });
        }

        // Actualiza las propiedades del usuario con req.body
        Object.assign(anfitrion, req.body);

        // Guarda el usuario actualizado en la base de datos
        await anfitrion.save();

        res.sendStatus(204);
    } catch (e) {
        httpError(res, e);
    }
},

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const anfitrion = await Anfitrions.findById(id);
            if (!anfitrion) {
                return res.status(404).send("Usuario no encontrado");
            }
            // Elimina el usuario de la base de datos
            await Anfitrions.deleteOne({ _id: id });
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al eliminar usuario");
        }
    }

}

module.exports = anfitrion