const express = require ('express')
const router = express.Router()
const contacto = require ('../controllers/contacto.controller')

router.post('/create', contacto.create)
router.get('/', contacto.list)


module.exports = router