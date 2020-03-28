const {mysql}=require('../connection')
const fs=require('fs')
const {uploader}=require('../helper/uploader')

module.exports={
    postTransaksi:(req, res)=>{
        try {
            const path='/transaksi/images'
            const upload=uploader(path, 'BUKTI').fields([{
                name:'image'
            }])

            upload(req, res, err =>{
                if(err){
                    return res.status(500).json({message:'upload gagal', error:err.message})
                }
                const {image}=req.files
                const imagePath= image ? path+'/'+image[0].filename : null
                const data = JSON.parse(req.body.data)
                data.bukti=imagePath

                var sql=`INSERT INTO transaksi SET ?`
                mysql.query(sql, data, (err, results)=>{
                    if(err){
                        return res.status(500).json({
                            message:'Ada error pada server',
                            error:err.message
                        })
                    }
                    sql=`select t.*, u.id, u.username,pb.namapaket from users u join transaksi t on t.iduser=u.id join paketbelajar pb on t.idpaket=pb.idpak`
                    mysql.query(sql, (err1, results1)=>{
                        if(err1) res.status(500).send(err1)
                        return res.status(200).send(results1)
                    })
                })
            })
        } catch (error) {
            res.send(bukti)
        }
    },
    getTransaksi:(req, res)=>{
        var sql=`select u.username, u.id as iduser , t.status, t.idtransaksi, t.tglmulai, t.tglberakhir, t.bukti, pb.namapaket from users u join transaksi t on u.id=t.iduser join paketbelajar pb on t.idpaket=pb.idpak ;`
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    },
    getPaket:(req, res)=>{
        var sql='SELECT * FROM paketbelajar'
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    },
    approveTransaksi:(req, res)=>{
        var {id}=req.params
        var {iduser, status}= req.body

        if(status){
            console.log(status, id)

            var data2={
                status:'approved'
            }

            var sql=`update transaksi set ? where id=${id} and status='waiting confirmation'`
            mysql.query(sql, data2, (err2, results2)=>{
                if(err2) res.status(500).send(err2)
            })
        }else{
            console.log(status)
            var data2={
                status:'declined'
            }
            var sql = `update transaksi set ? where id=${id} and status='waiting confirmation'`
            mysql.query(sql, data2, (err2, results2)=>{
                if(err) res.status(500).send(err2)
            })

            var data={
                status:'subscribe'
            }
            sql=`update transaksi set ? where idtransaksi=${id} and status='waiting confirmation'`
            mysql.query(sql, data, (err1, results1)=>{
                if(err1) res.status(500).send(err1)
            })
        }
    }
}