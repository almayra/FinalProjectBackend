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
                    sql=`select t.*, pb.namapaket from transaksi t join paketbelajar pb on t.idpaket=pb.namapaket;`
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
        var sql=`select t.*, pb.namapaket from transaksi t join paketbelajar pb on t.idpaket=pb.namapaket;`
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
    }
}