const Anfitrions =require('../models/Anfitrion')
const {httpError} = require('../helpers/handleError')
const { register } = require('./user.controller')
const {encrypt , compare} = require ('../helpers/handlePassword')
const { tokenSign } = require('../helpers/handleJwt')
const anfitrion = {
    list: async(req,res,next)=>{
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
    searchAdmitePerro: async (req, res) => {
        try {
            const { admitePerro } = req.body;
            const query = { admitePerro: admitePerro !== undefined ? admitePerro : true };
            const anfitriones = await Anfitrions.find(query);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones que admiten perros' });
        }
    },
    register: async (req, res) => {
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
                distintoDueño, 
                cantidadDeAnimales,
                admitePerro, 
                admiteGato, 
                admitAlltypesMascotas,
                disponibilidadHoraria, 
                disponibilidadPaseo,
                disponibilidadVisita,
                disponibilidadAlojamiento, 
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

            const passwordHash = await encrypt(password)

            let newAnfitrion;
            try{
            newAnfitrion = await Anfitrions.create({
                username, 
                password : passwordHash, 
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
                distintoDueño, 
                cantidadDeAnimales,
                admitePerro, 
                admiteGato, 
                admitAlltypesMascotas,
                disponibilidadHoraria, 
                disponibilidadPaseo,
                disponibilidadVisita,
                disponibilidadAlojamiento, 
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
            }catch(creationError){
                if(newAnfitrion){
                    await Anfitrions.findByIdAndDelete(newAnfitrion._id);
                }
                throw creationError;
            }
            newAnfitrion.set("password", undefined,{stritc:false})
            const data = {
                token : await tokenSign(newAnfitrion),
                anfitrion : newAnfitrion
            }
            res.status(201).send({ data});
        } catch (e) {
            httpError(res, e);
        }
    },
    
    login : async (req,res) => {
        try{
            const {username ,password} = req.body
            const anfitrion = await Anfitrions.findOne({username}).select('password name role email')
            if(!anfitrion){
                httpError(res, "Usuario no existe", 404);
                return
            }
            const hashPassword = anfitrion.password
            const check = await compare (password,hashPassword)
            if(!check){
                res.status(401).send({error: 'Password invalido'});
                return
            }
            anfitrion.set ('password',undefined,{strict : false})
            const data = {
                token: await tokenSign(anfitrion),
                anfitrion
            }

            res.send({data})
        }catch(e){

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
    },
    /*searchAnfitrionByCriteria: async (req, res) => {
        try {
            const {
                admitePerro,
                admiteGato,
                admiteAlltypesMascotas,
                disponibilidadAlojamiento,
                disponibilidadPaseo,
                disponibilidadVisita,
                disponibilidadlunes,
                disponibilidadmartes,
                disponibilidadmiercoles,
                disponibilidadjueves,
                disponibilidadviernes,
                disponibilidadsabado,
                disponibilidaddomingo,
                disponibilidadHoraria
            } = req.body;
    
            // Construir el query inicial con filtros básicos
            let query = {};
    
            // Validar que solo un servicio sea seleccionado
            if (disponibilidadAlojamiento) {
                query.disponibilidadAlojamiento = disponibilidadAlojamiento;
            } else if (disponibilidadPaseo) {
                query.disponibilidadPaseo = disponibilidadPaseo;
            } else if (disponibilidadVisita) {
                query.disponibilidadVisita = disponibilidadVisita;
            } else {
                return res.status(400).json({ error: 'Debe seleccionar al menos un servicio (alojamiento, paseo, visita)' });
            }
    
            // Validar que solo un tipo de mascota sea seleccionado, considerando el caso de todas las mascotas
            if (admiteAlltypesMascotas) {
                query.$or = [
                    { admitePerro: true },
                    { admiteGato: true },
                    { admiteAlltypesMascotas: true }
                ];
            } else if (admitePerro) {
                query.admitePerro = admitePerro;
            } else if (admiteGato) {
                query.admiteGato = admiteGato;
            } else {
                return res.status(400).json({ error: 'Debe seleccionar al menos un tipo de mascota (perro, gato, todas las mascotas)' });
            }
    
            // Filtros de disponibilidad por día
            if (disponibilidadlunes !== undefined) {
                query.disponibilidadlunes = disponibilidadlunes;
            }
            if (disponibilidadmartes !== undefined) {
                query.disponibilidadmartes = disponibilidadmartes;
            }
            if (disponibilidadmiercoles !== undefined) {
                query.disponibilidadmiercoles = disponibilidadmiercoles;
            }
            if (disponibilidadjueves !== undefined) {
                query.disponibilidadjueves = disponibilidadjueves;
            }
            if (disponibilidadviernes !== undefined) {
                query.disponibilidadviernes = disponibilidadviernes;
            }
            if (disponibilidadsabado !== undefined) {
                query.disponibilidadsabado = disponibilidadsabado;
            }
            if (disponibilidaddomingo !== undefined) {
                query.disponibilidaddomingo = disponibilidaddomingo;
            }
    
            // Filtro de disponibilidad horaria
            if (disponibilidadHoraria) {
                query.disponibilidadHoraria = disponibilidadHoraria;
            }
    
            // Log the query to see what is being sent to the database
            console.log("Query:", query);
    
            // Buscar anfitriones en la base de datos con los filtros aplicados
            const anfitriones = await Anfitrions.find(query);
            console.log("Anfitriones encontrados:", anfitriones);
            res.status(200).json(anfitriones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar anfitriones con los criterios especificados' });
        }
    },*/
    
    searchAnfitrionByCriteria: async (req, res) => {
    try {
        const {
            admitePerro,
            admiteGato,
            admiteAlltypesMascotas,
            disponibilidadAlojamiento,
            disponibilidadPaseo,
            disponibilidadVisita,
            disponibilidadlunes,
            disponibilidadmartes,
            disponibilidadmiercoles,
            disponibilidadjueves,
            disponibilidadviernes,
            disponibilidadsabado,
            disponibilidaddomingo,
            disponibilidadHoraria
        } = req.body;

        // Construir el query inicial con filtros básicos
        let query = {};

        // Validar que solo un servicio sea seleccionado
        if (disponibilidadAlojamiento) {
            query.disponibilidadAlojamiento = disponibilidadAlojamiento;
        } else if (disponibilidadPaseo) {
            query.disponibilidadPaseo = disponibilidadPaseo;
        } else if (disponibilidadVisita) {
            query.disponibilidadVisita = disponibilidadVisita;
        } else {
            return res.status(400).json({ error: 'Debe seleccionar al menos un servicio (alojamiento, paseo, visita)' });
        }

        // Validar que solo un tipo de mascota sea seleccionado, considerando el caso de todas las mascotas
        if (admiteAlltypesMascotas) {
            query.$or = [
                { admitePerro: true },
                { admiteGato: true },
                { admiteAlltypesMascotas: true }
            ];
        } else if (admitePerro) {
            query.admitePerro = admitePerro;
        } else if (admiteGato) {
            query.admiteGato = admiteGato;
        } else {
            return res.status(400).json({ error: 'Debe seleccionar al menos un tipo de mascota (perro, gato, todas las mascotas)' });
        }

        // Filtros de disponibilidad por día
        if (disponibilidadlunes) {
            query.disponibilidadlunes = true;
        } else if (disponibilidadmartes) {
            query.disponibilidadmartes = true;
        } else if (disponibilidadmiercoles) {
            query.disponibilidadmiercoles = true;
        } else if (disponibilidadjueves) {
            query.disponibilidadjueves = true;
        } else if (disponibilidadviernes) {
            query.disponibilidadviernes = true;
        } else if (disponibilidadsabado) {
            query.disponibilidadsabado = true;
        } else if (disponibilidaddomingo) {
            query.disponibilidaddomingo = true;
        }

        // Filtro de disponibilidad horaria
        if (disponibilidadHoraria && disponibilidadHoraria !== 'Variable') {
            // Si la disponibilidadHoraria no es 'Variable', se busca exactamente esa disponibilidad
            query.disponibilidadHoraria = disponibilidadHoraria;
        } else if (disponibilidadHoraria === 'Fulltime') {
            // Si la disponibilidadHoraria es 'Fulltime', se buscan todos los anfitriones sin importar la disponibilidad horaria
            // No es necesario agregar nada al query en este caso
        } else {
            // Si la disponibilidadHoraria es 'Variable', se buscan aquellos anfitriones que tengan cualquier disponibilidad horaria
            query.disponibilidadHoraria = { $in: ['Mañana', 'Tarde', 'Noche'] };
        }

        // Log the query to see what is being sent to the database
        console.log("Query:", query);

        // Buscar anfitriones en la base de datos con los filtros aplicados
        const anfitriones = await Anfitrions.find(query);
        console.log("Anfitriones encontrados:", anfitriones);
        res.status(200).json(anfitriones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar anfitriones con los criterios especificados' });
    }
}

    
    
    

}

module.exports = anfitrion