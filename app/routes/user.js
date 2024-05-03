const express = require('express')
const router = express.Router()
const user = require('../controllers/user.controller')

router.get('/', user.list)
router.get('/:id', user.get)
router.post('/', user.create)
router.put('/:id', user.update)
router.patch('/:id', user.modify)
router.delete('/:id', user.delete)

module.exports=router