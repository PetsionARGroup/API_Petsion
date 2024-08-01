const Users= require('../models/User')
const {httpError, unauthorizedError}=require('../helpers/handleError')
const {encrypt , compare} = require ('../helpers/handlePassword')
const {tokenSign} = require ('../helpers/handleJwt')
const {enviarCorreoConfirmacion}= require ('../helpers/handleMail')
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require ('jsonwebtoken')

const user = {
    list: async(req,res)=>{
        try{
            const listAll = await Users.find({})
            res.send({data : listAll})
        }
        catch(e){
            httpError(res,e)
        }
    },
    get: async(req,res)=>{
        try {
            const { id } = req.params;
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).send({ message: "Usuario no encontrado" });
            }
            res.status(200).send(user);
        } catch (e) {
            httpError(res, e);
        }
    },
   
    register: async (req, res) => {
        try {
            const { username, password, name, lastname, email, dni, fechaDeNacimiento, telefono, codigoPostal } = req.body;
        
            // Verifica si el username ya está registrado
            const existingUsername = await Users.findOne({ username });
            if (existingUsername) {
                return res.status(400).send({ message: "El nombre de usuario ya está registrado" });
            }
        
            // Verifica si el email ya está registrado
            const existingEmail = await Users.findOne({ email });
            if (existingEmail) {
                return res.status(400).send({ message: "El correo electrónico ya está registrado" });
            }
        
            // Verifica si el dni ya está registrado
            const existingDNI = await Users.findOne({ dni });
            if (existingDNI) {
                return res.status(400).send({ message: "El DNI ya está registrado" });
            }
        
            // Comprobación de que el nombre no contiene caracteres especiales (excepto la ñ y Ñ) y permite espacios entre nombres
            if (!/^[a-zA-ZñÑ\s]+$/.test(name)) {
                return res.status(400).send({ message: "El nombre no puede contener caracteres especiales, excepto la ñ, y debe permitir espacios entre nombres" });
            }
        
            // Comprobación de que el nombre no contiene números
            if (/\d/.test(name)) {
                return res.status(400).send({ message: "El nombre no puede contener números" });
            }
        
            // Comprobación de que no todos los caracteres del nombre son iguales
            if (/^([^\s])\1+$/.test(name)) {
                return res.status(400).send({ message: "El nombre no puede contener todos los caracteres iguales" });
            }
        
            // Comprobación de que el apellido no contiene caracteres especiales (excepto la ñ y Ñ) y permite espacios entre apellidos
            if (!/^[a-zA-ZñÑ\s]+$/.test(lastname)) {
                return res.status(400).send({ message: "El apellido no puede contener caracteres especiales, excepto la ñ, y debe permitir espacios entre apellidos" });
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
            
            const passwordHash = await encrypt(password);
    
            let newUser;
            try {
                newUser = await Users.create({
                    username, password: passwordHash, name, lastname, email, dni, fechaDeNacimiento, telefono, codigoPostal
                });
            } catch (creationError) {
                // Si se produce un error al crear el usuario, lógica para borrarlo
                if (newUser) {
                    await Users.findByIdAndDelete(newUser._id);
                }
                throw creationError; // Lanza el error para que sea manejado en el bloque catch exterior
            }
            
            newUser.set("password", undefined, { strict: false });
            const data = {
                token: await tokenSign(newUser),
                user: newUser
            };
            const confirmationToken = data.token;
            await enviarCorreoConfirmacion(newUser.email, confirmationToken);
    
            res.status(201).send({ data });
        } catch (e) {
            httpError(res, e);
        }
    },

    login : async (req,res) => {
        try{
            const {username ,password} = req.body
            const user = await Users.findOne({username}).select('password name role email')
            if(!user){
                httpError(res, "Usuario no existe", 404);
                return
            }
            const hashPassword = user.password
            const check = await compare (password,hashPassword)
            if(!check){
                res.status(401).send({error: 'Password invalido'});
                return
            }
            user.set ('password',undefined,{strict : false})
            const data = {
                token:await tokenSign(user),
                user
            }

            res.send({data})
        }catch(e){

            httpError(res, e);
        }
    },
    
    
    update: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
    
            // Verifica si el username ya está registrado
            if (req.body.username && req.body.username !== user.username) {
                const existingUsername = await Users.findOne({ username: req.body.username });
                if (existingUsername) {
                    return res.status(400).send({ message: "El nombre de usuario ya está registrado" });
                }
            }
    
            // Verifica si el email ya está registrado
            if (req.body.email && req.body.email !== user.email) {
                const existingEmail = await Users.findOne({ email: req.body.email });
                if (existingEmail) {
                    return res.status(400).send({ message: "El correo electrónico ya está registrado" });
                }
            }
    
            // Verifica si el dni ya está registrado
            if (req.body.dni && req.body.dni !== user.dni) {
                const existingDNI = await Users.findOne({ dni: req.body.dni });
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
            Object.assign(user, req.body);
    
            // Guarda el usuario actualizado en la base de datos
            await user.save();
    
            res.sendStatus(204);
        } catch (e) {
            httpError(res, e);
        }
    },
    
    modify: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
    
            // Verifica si el username ya está registrado
            if (req.body.username && req.body.username !== user.username) {
                const existingUsername = await Users.findOne({ username: req.body.username });
                if (existingUsername) {
                    return res.status(400).send({ message: "El nombre de usuario ya está registrado" });
                }
            }
    
            // Verifica si el email ya está registrado
            if (req.body.email && req.body.email !== user.email) {
                const existingEmail = await Users.findOne({ email: req.body.email });
                if (existingEmail) {
                    return res.status(400).send({ message: "El correo electrónico ya está registrado" });
                }
            }
    
            // Verifica si el dni ya está registrado
            if (req.body.dni && req.body.dni !== user.dni) {
                const existingDNI = await Users.findOne({ dni: req.body.dni });
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
            Object.assign(user, req.body);
            
            if (req.body.password) {
                const passwordHash = await encrypt(req.body.password);
                user.password = passwordHash;
            }
    
            // Guarda el usuario actualizado en la base de datos
            await user.save();
    
            res.sendStatus(204);
        } catch (e) {
            httpError(res, e);
        }
    },  
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
            // Elimina el usuario de la base de datos
            await Users.deleteOne({ _id: id });
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al eliminar usuario");
        }
    },
    // En el controlador de usuario (user.controller.js)
    confirmarCuenta: async (req, res) => {
    try {
        const token = req.params.token;
        // Verificar si el token es válido (puedes utilizar jwt.verify)
        const decoded = jwt.verify(token, JWT_SECRET);
        // Extraer el ID de usuario del token decodificado
        const userId = decoded._id;
        // Actualizar el usuario en la base de datos para establecer validate a true
        await Users.findByIdAndUpdate(userId, { validarCorreo: true });
        res.redirect('https://petsion.com.ar/');
    } catch (error) {
        console.error('Error al confirmar cuenta:', error);
        res.status(400).send('Error al confirmar cuenta. El token podría ser inválido o expirado.');
    }
}

    
      
}

module.exports= user