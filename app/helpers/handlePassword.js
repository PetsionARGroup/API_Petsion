const bcryptjs = require("bcryptjs")
//contraseña sin encriptar
const encrypt =async (password) => {
    const hash = await bcryptjs.hash(password, 10)
    return hash
}
//pasar contraseña sin encriptar y el password con hash
const compare = async (password , hashPassword) => {
    return await bcryptjs.compare(password , hashPassword)
}

module.exports={encrypt , compare}