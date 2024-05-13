const express = require ('express')
const router = express.Router()
const anfitrion = require('../controllers/anfitrion.controller')
const Anfitrion= require ('../models/Anfitrion')
const {validateJwt} = require ('../middleware/session')

router.get('/', anfitrion.list)
router.get('/:id', anfitrion.get)
router.post('/', anfitrion.register)
router.post('/login', anfitrion.login)
router.put('/:id', anfitrion.update)
router.patch('/:id', anfitrion.modify)
router.delete('/:id', anfitrion.delete)
router.post('/perros', anfitrion.searchAdmitePerro);
router.post('/gatos', anfitrion.searchGatos);
router.post('/todoslostipos', anfitrion.searchAdmitAlltypesMascotas);

module.exports = router