const express = require ('express')
const router = express.Router()
const anfitrion = require('../controllers/anfitrion.controller')
const Anfitrion= require ('../models/Anfitrion')
const {validateJwt} = require ('../middleware/session')

router.get('/',validateJwt, anfitrion.list)
router.get('/:id', anfitrion.get)
router.post('/', anfitrion.register)
router.put('/:id', anfitrion.update)
router.patch('/:id', anfitrion.modify)
router.delete('/:id', anfitrion.delete)
router.post('/perros',validateJwt, anfitrion.searchAdmitePerro);
router.post('/gatos',validateJwt, anfitrion.searchGatos);
router.post('/todoslostipos',validateJwt, anfitrion.searchAdmitAlltypesMascotas);

module.exports = router