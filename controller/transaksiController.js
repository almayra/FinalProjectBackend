const {mysql}=require('../connection')
const fs=require('fs')
const {uploader}=require('../helper/uploader')
const paginate = require('jw-paginate')
const moment=require('moment')

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
        const sqlCount=`SELECT COUNT(*) AS count FROM transaksi`
        let dataCount

        mysql.query(sqlCount, (err,results)=>{
            if(err) res.status(500).send(err)
            dataCount=results[0].count 

            const page= parseInt(req.params.page)|| 1
            const pageSize=3
            const pager=paginate(dataCount, page, pageSize)

            let offset;
            if (page === 1) {
                offset = 0
            } else {
                offset = pageSize * (page - 1)
            }
            sql=`select u.username, u.id as iduser , t.status, t.idtransaksi, t.tglmulai, t.tglberakhir, t.bukti, pb.namapaket from users u join transaksi t on u.id=t.iduser join paketbelajar pb on t.idpaket=pb.idpak LIMIT ? OFFSET ?`
            mysql.query(sql, [pageSize, offset], (err, results2)=>{
                if(err) res.status(500).send(err)
                const pageOfData=results2
                return res.status(200).send({pageOfData, pager})
            })
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
        var {idtransaksi}=req.params
        var {status}= req.body
        console.log('line 82', idtransaksi, status)

        if(status){
            console.log(status, idtransaksi, 'line 85')
            var data2={
                status:'approved',
                tglmulai: moment().format('LL'),
                tglberakhir: moment().add('1', 'M').format('LL')
            }
            console.log('line 91', idtransaksi, status)

            var sql=`update transaksi set ? where idtransaksi=${idtransaksi} and status='waiting confirmation'`
            mysql.query(sql, data2, (err2, results2)=>{
                if(err2) res.status(500).send(err2)
            })
            
        }else{
            console.log(status, 'line 109')
            var data2={
                status:'declined'
            }
            var sql = `update transaksi set ? where idtransaksi=${idtransaksi} and status='waiting confirmation'`
            mysql.query(sql, data2, (err2, results2)=>{
                if(err2) res.status(500).send(err2)
            })
        }

        const sqlCount=`SELECT COUNT(*) AS count FROM transaksi`
        let dataCount

        mysql.query(sqlCount, (err,results)=>{
            if(err) res.status(500).send(err)
            dataCount=results[0].count 

            const page= parseInt(req.params.page)|| 1
            const pageSize=3
            const pager=paginate(dataCount, page, pageSize)

            let offset;
            if (page === 1) {
                offset = 0
            } else {
                offset = pageSize * (page - 1)
            }
            sql=`select u.username, u.id as iduser , t.status, t.idtransaksi, t.tglmulai, t.tglberakhir, t.bukti, pb.namapaket from users u join transaksi t on u.id=t.iduser join paketbelajar pb on t.idpaket=pb.idpak where status='waiting confirmation' LIMIT ? OFFSET ?`
            mysql.query(sql, [pageSize, offset], (err, results2)=>{
                if(err) res.status(500).send(err)
                const pageOfData=results2
                return res.status(200).send({pageOfData, pager})
            })
        })
    }
}