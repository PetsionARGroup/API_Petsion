const express = require ('express')
const router = express.Router()
const mascota = require ( '../controllers/mascota.controller')


router.post('/register', mascota.create)
router.post('/listar', mascota.listarMascotas)
router.post('/eliminar', mascota.delete)


module.exports = router