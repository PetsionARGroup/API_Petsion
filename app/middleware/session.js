const { expressjwt } = require("express-jwt")

const JWT_SECRET = process.env.JWT_SECRET

const validateJwt = expressjwt({secret : JWT_SECRET, algorithms:['HS256']})

module.exports= {validateJwt};