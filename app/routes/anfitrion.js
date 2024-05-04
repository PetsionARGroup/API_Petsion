const express = require ('express')
const router = express.Router()
const anfitrion = require('../controllers/anfitrion.controller')

router.get('/', anfitrion.list)
router.get('/:id', anfitrion.get)
router.post('/', anfitrion.create)
router.put('/:id', anfitrion.update)
router.patch('/:id', anfitrion.modify)
router.delete('/:id', anfitrion.delete)

module.exports = router