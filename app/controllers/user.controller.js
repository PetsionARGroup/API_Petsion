const Users= require('./../models/User')
const user = {
    list: async(req,res)=>{
        const users= await Users.find()
        res.status(200).send(users)
    },
    get: async(req,res)=>{
        const {id} = req.params
        const user = await Users.find({_id:id})
        res.status(200).send(user)
        },
   
    create : async (req,res)=>{
        console.log(req.body)
        const user = new Users(req.body)
        const SavedUser= await user.save()
        res.status(201).send(SavedUser._id)
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
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al actualizar usuario");
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