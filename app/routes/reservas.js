const express = require('express');
const reservaController = require('../controllers/reserva.controller');
const router = express.Router();

router.post('/crear', reservaController.create);
router.post('/confirmar', reservaController.confirmar);
router.post('/anfitrion', reservaController.listarReservas);
router.post('/user', reservaController.listarReservasUser);
router.post('/userconfirm', reservaController.listarReservasUserConfirmado);
router.post('/anfitrionconfirm', reservaController.listarReservasConfirmado);
router.post('/rechazar', reservaController.rechazar);
router.post('/calificar', reservaController.calificar);
router.post('/finalizadas/user', reservaController.listarReservasCalificar);
router.post('/finalizadas/anfitrion', reservaController.ReservAnfitrionFinalizada);
router.delete('/:id', reservaController.delete)


module.exports = router;
