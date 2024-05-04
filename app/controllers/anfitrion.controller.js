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
    create : async(req,res)=>{
        try{
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
            // Crea el nuevo usuario
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