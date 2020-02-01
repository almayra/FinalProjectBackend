const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'almayra123@gmail.com',
        pass:'mdugkfrxtxvdprpx'
    },
    tls:{
        rejectedUnauthorized:false
    }
})

module.exports=transporter