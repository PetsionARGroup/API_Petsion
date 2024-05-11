const express = require('express')
const {validateJwt}= require('../middleware/session')
const findAndAssingUser = require ('../middleware/usuarioasignado')

const isAuthenticated = express.Router().use(validateJwt , findAndAssingUser)

module.exports= {isAuthenticated}