const crypto=require('crypto')

module.exports=(password)=>{
    return crypto.createHmac('sha256','rerekece').update(password).digest('hex')
}