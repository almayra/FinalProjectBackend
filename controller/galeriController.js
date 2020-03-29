const {mysql}=require('../connection')
const fs=require('fs')
const {uploader}=require('../helper/uploader')

module.exports={
    postGaleri:(req, res)=>{
        try {
            const path='/gallery/images'
            const upload=uploader(path, 'GALERI').fields([{
                name:'image'
            }])

            upload(req, res, err=>{
                if(err){
                    return res.status(500).json({message:'Upload Galeri Gagal', error: err.message})
                }
                const {image}=req.files
                const imagePath=image ? path + '/' + image[0].filename:null
                const data = JSON.parse(req.body.data)
                data.foto=imagePath

                var sql=`INSERT INTO galeri SET ?`
                mysql.query(sql, data, (err, result)=>{
                    if(err){
                        return res.status(500).json({
                            message:'Ada error pada server',
                            error:err.message
                        })
                    }

                    sql=`SELECT * FROM galeri`
                    mysql.query(sql, (err1, result1)=>{
                        if(err1) res.status(500).send(err1)
                        return res.status(200).send(result1)
                    })
                })
            })
        } catch (error) {
            res.send(error)
        }
    }, getGaleri:(req, res)=>{
        var sql=`SELECT * FROM galeri`
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    }, deteleGaleri:(req, res)=>{
        var selectedId=req.params.selectedId
        var sql=`SELECT * FROM galeri WHERE ID=${selectedId}`
       mysql.query(sql, (err, result1)=>{
           if(err){
               console.log('problem',err)
               return res.status(500).send(err)
           }
           console.log(result1[0])
           console.log('alamat', result1[0].foto)
           var imagePath=result1[0].foto
           sql=`DELETE FROM galeri WHERE ID=${selectedId}`
           mysql.query(sql, (err, results)=>{
               if(err){
                   console.log(err.message)
                   return res.status.json({message:`there's an error on the server`, err:err.message})
               }if(imagePath){
                   fs.unlinkSync(`./public`+imagePath)
               }
               console.log(results)
               sql=`SELECT * FROM galeri`
               mysql.query(sql, (err, result2)=>{
                   if(err) res.status(500).send(err)
                   res.status(200).send({dataFoto:result2})
               })
           })
       })
    }
}