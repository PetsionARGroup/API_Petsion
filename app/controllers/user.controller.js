const Users= require('../models/User')
const {httpError}=require('../helpers/handleError')
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
   
    create : async (req,res)=>{
        try{
            const {username , password , name , lastname, email , dni , fechaDeNacimiento , telefono , codigoPostal}= req.body
            const restDetail = await Users.reate({
                username , password , name , lastname, email , dni , fechaDeNacimiento , telefono , codigoPostal
            })
            res.send({data : restDetail})
        }
        catch(e){
            httpError(res,e)
        }
    },
    update: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
            // Actualiza las propiedades del usuario con req.body
            Object.assign(user, req.body);
            // Guarda el usuario actualizado en la base de datos
            await user.save();
            res.sendStatus(204);
        } catch (e) {
            httpError(res,e)
        }
    },
    modify: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
    
            // Actualiza solo las propiedades proporcionadas en req.body
            Object.keys(req.body).forEach(key => {
                user[key] = req.body[key];
            });
    
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
    }
    
      
}

module.exports= user