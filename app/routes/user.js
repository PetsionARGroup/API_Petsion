const express = require('express')
const router = express.Router()
const user = require('../controllers/user.controller')
const {validateJwt} = require ('../middleware/session')

router.get('/', user.list)
router.get('/:id', user.get)
router.get('/confirmar/:token', user.confirmarCuenta)
router.post('/register',user.register)
router.post('/login', user.login)
router.put('/:id',validateJwt, user.update)
router.patch('/:id',validateJwt, user.modify)
router.delete('/:id',user.delete)


module.exports=router