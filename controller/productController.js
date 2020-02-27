const {mysql}=require('../connection')
const fs=require('fs')
const {uploader}=require('../helper/uploader')

module.exports={
    postKelas:(req,res)=>{
        try {
            console.log('1')
            const path='/product/images'
            const upload=uploader(path, 'KELAS').fields([{
                name:'image'
            }])
            console.log('2')

            upload(req, res, err=>{
            console.log('3')

                if(err){
                    return res
                    .status(500)
                    .json({message: 'Upload Gagal', error:err.message})
                }
            console.log(req.files)

                const {image}=req.files
                const imagePath=image ? path+'/'+image[0].filename : null
                const data = JSON.parse(req.body.data)
                data.cover=imagePath
                console.log(data)

                var sql=`INSERT INTO product set ?`
                mysql.query(sql,data,(err, results)=>{
                    if(err){
                        return res.status(500).json({
                            message:'Ada error pada server',
                            error:err.message
                        })
                    }
            console.log('5')

                    sql=`SELECT * FROM product p JOIN category c ON p.idkategori=c.id JOIN catproduct cp ON cp.idcategory=c.id`
                    mysql.query(sql, (err1, results1)=>{
                        if(err1) res.status(500).send(err1)
            console.log('iniiii')
                        
                        return res.status(200).send(results1)
                    })
                })
            })
        } catch (error) {
            res.send(error)
        }
    }
}