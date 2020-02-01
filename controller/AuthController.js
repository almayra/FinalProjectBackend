const {mysql}=require('./../connection')
const fs=require('fs') //file system
const cryptogenerate=require('./../helper/encrypt')
const transporter=require('./../helper/mailer')

module.exports={
    crypto: (req,res)=>{
        console.log(req.query)
        const hashpassword = cryptogenerate(req.query.password)
        res.send({encryptan: hashpassword, panjangencypt: hashpassword.length})
    },
    register: (req,res)=>{
        var {username, password, email}=req.body

        var sql=`SELECT * FROM users WHERE username='${username}'`
        mysql.query(sql, (err, result)=>{
            console.log('ini')
            if(err) return res.status(500).send({err})
            if(result.length>0) return res.status(200).send({status:'error', message: 'Akun sudah terdaftar'})
            else{
                var hashpassword=cryptogenerate(password)
                var datauser={
                    username,
                    email,
                    password:hashpassword,
                    status:'unverified',
                    roleid:'2'
                }
                sql=`INSERT INTO users SET ?`
                mysql.query(sql, datauser, (err1, res1)=>{
                    if(err1) return res.status(500).send({err1})
                    var LinkVerifikasi=`http://localhost:3000/verified?username=${username}&password=${hashpassword}`
                    var mailoptions={
                        from:'PKC <almayra123@gmail.com>',
                        to:email,
                        subject:'Verifikasi Email',
                        html:`Klik Link untuk verifikasi : 
                        <a href=${LinkVerifikasi} > Join to PKC </a>`
                    }
                    transporter.sendMail(mailoptions, (err2, res2)=>{
                        if(err2) return res.status(500).send({err2})
                        return res.status(200).send({username, email, status:'unverified'})
                    })
                })
            }
        })
    },
    emailverifikasi: (req,res)=>{
        var {username, password}=req.body
        var sql=`SELECT * FROM users WHERE username='${username}'`
        mysql.query(sql, (err, results)=>{
            if(err) return res.status(500).send({status:'error',err})
            if(results.length===0){
                return res.status(500).send({status:'error', err1:'User tidak ditemukan'})
            }
            sql=`UPDATE users SET status='verified' WHERE username='${username}' and password='${password}'`
            mysql.query(sql, (err, results2)=>{
                if(err){
                    return res.status(500).send({status:'error', err})
                }else{
                    return res.status(200).send({username:results[0].username, status:'verified'})
                }
            })
        })
    }
}