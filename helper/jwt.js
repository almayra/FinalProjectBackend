const jwt = require('jsonwebtoken')

module.exports={
    createJWTToken(payload){
        return jwt.sign(payload, 'rerekece', {expiresIn:'12h'})
    }
}