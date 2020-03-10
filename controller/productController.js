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
    },
    getKelas:(req, res)=>{
        // var sql='SELECT p.id,p.judul,p.deskripsi,p.cover,p.bab,p.materi FROM product p join category c on p.idkategori=c.id;'
        var sql='SELECT * FROM product p join category c on p.idkategori=c.idkat '
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    },
    getKategori:(req, res)=>{
        var sql= `SELECT * FROM category`
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    },
    deleteKelas: (req, res)=>{
        console.log('delete')
        var selectedId=req.params.selectedId
        console.log('id deletenye',selectedId)
        var sql=`SELECT * FROM product WHERE id=${selectedId}`
        mysql.query(sql, (err,results1)=>{
            if(err){
                console.log('problem', err)
                return res.status(500).send(err)
            }
            console.log(results1)
            console.log('alamat', results1[0].cover)
            var imagePath=results1[0].cover
            sql=`DELETE FROM product WHERE id=${selectedId}`
            mysql.query(sql, (err, results)=>{
                if(err){
                    console.log(err.message)
                    return res.status.json({message:`there's an error on the server`, err:err.message})
                }if(imagePath){
                    fs.unlinkSync(`./public`+imagePath)
                }
                console.log(results)
                sql=`SELECT * FROM product p join category c on p.idkategori=c.idkat`
                mysql.query(sql, (err, result2)=>{
                    if(err) res.status(500).send(err)
                    res.status(200).send({dataProduct:result2})
                })
            })
        })
    },
    editKelas: (req, res)=>{
        var {selectedIdEdit} = req.params
        console.log('id', selectedIdEdit)
        var sql=`SELECT * FROM product WHERE id=${selectedIdEdit}`
        mysql.query(sql, (err, res1)=>{
            if(err) return res.status(500).send(err)
            if(res1.length){
                const path ='/product/images'
                const upload=uploader(path, 'KELAS').fields([{name:'image'}])

                upload(req, res, (err)=>{
                    if(err) return res.status(500).json({message:'server error'})
                    const {image}=req.files
                    const imagePath=image ? path + '/' + image[0].filename:null
                    console.log('ini reqbody', req.body.data)
                    const data = JSON.parse(req.body.data)

                   try {
                       if(imagePath){
                           data.cover=imagePath
                       }
                       sql=`UPDATE product SET ? WHERE id=${selectedIdEdit}`                       
                       mysql.query(sql, data, (err, res2)=>{
                           if(err){
                               if(imagePath){
                                   fs.unlinkSync(`./public${imagePath}`)
                                }
                                console.log('masuk sini');
                                return res.status(500).json({message:'server error'})
                            }
                            if(imagePath){
                               if(res1[0].cover){
                                   fs.unlinkSync(`./public${res1[0].cover}`)
                               }
                           }
                           sql=`SELECT * FROM product p join category c on p.idkategori=c.idkat`
                           mysql.query(sql, (err, res3)=>{
                               if(err) return res.status(500).send(err)
                               return res.status(200).send(res3)
                           })
                       })
                   } catch (error) {
                       console.log(error)
                   }
                })
            }
        })
    },
    getDetailKelas:(req, res)=>{
        var id=req.params.id
        console.log(id)
        var sql=`SELECT * FROM product p join category c on p.idkategori=c.idkat where p.id=${id}`
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log(res1)
            return res.status(200).send(res1)
        })
    },
    postGaleri:(req, res)=>{
        try {
            const path='/gallery/images'
            const upload=uploader(path, 'GALERI').fields([{
                name:'image'
            }])
            
            upload(req, res, err =>{
                if(err){
                    return res.status(500).json({message: 'Upload Galeri Gagal', error: err.message})
                }
                console.log(req.files)
                const {image}=req.files
                const imagePath=image ? path + '/' + image[0].filename : null
                const data = JSON.parse(req.bodt.data)
                data.foto=imagePath
                console.log(data)

                var sql = `INSERT INTO galeri set ?`
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
    },
    deleteGaleri:(req, res)=>{
        var selectedId=req.params.selectedId
        var sql=`SELECT * FROM galeri WHERE id=${selectedId}`
        mysql.query(sql, (err, result1)=>{
            if(err){
                return res.status(500).send(err)
            }
            var imagePath=result1[0].foto
            sql=`DELETE FROM galeri WHERE ID=${selectedId}`
            mysql.query(sql, (err,result)=>{
                if(err){
                    return res.status.json({message:`there's an error on the server`, err: err.message})
                }if(imagePath){
                    fs.unlinkSync(`./public`+imagePath)
                }
                sql=`SELECT * FROM galeri`
                mysql.query(sql, (err, result1)=>{
                    if(err) res.status(500).send(err)
                    res.status(200).send({dataGaleri:result1})
                })
            })
        })
    }
}