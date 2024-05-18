const express = require('express');
const reservaController = require('../controllers/reserva.controller');
const router = express.Router();

router.post('/crear', reservaController.create);
router.patch('/:id', reservaController.confirmar);
router.post('/anfitrion', reservaController.listarReservas);

module.exports = router;
