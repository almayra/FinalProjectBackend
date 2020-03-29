const {mysql}=require('../connection')
const fs=require('fs')
const {uploader}=require('../helper/uploader')
const paginate = require('jw-paginate')

module.exports={
    postKelas:(req,res)=>{
        try {
            const path='/product/images'
            const upload=uploader(path, 'KELAS').fields([{
                name:'image'
            }])

            upload(req, res, err=>{

                if(err){
                    return res
                    .status(500)
                    .json({message: 'Upload Gagal', error:err.message})
                }

                const {image}=req.files
                const imagePath=image ? path+'/'+image[0].filename : null
                const data = JSON.parse(req.body.data)
                data.cover=imagePath

                var sql=`INSERT INTO product set ?`
                mysql.query(sql,data,(err, results)=>{
                    if(err){
                        return res.status(500).json({
                            message:'Ada error pada server',
                            error:err.message
                        })
                    }

                    sql=`SELECT * FROM product p JOIN category c ON p.idkategori=c.id JOIN catproduct cp ON cp.idcategory=c.id`
                    mysql.query(sql, (err1, results1)=>{
                        if(err1) res.status(500).send(err1)
                        
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
        var selectedId=req.params.selectedId
        var sql=`SELECT * FROM product WHERE id=${selectedId}`
        mysql.query(sql, (err,results1)=>{
            if(err){
                return res.status(500).send(err)
            }
            var imagePath=results1[0].cover
            sql=`DELETE FROM product WHERE id=${selectedId}`
            mysql.query(sql, (err, results)=>{
                if(err){
                    return res.status.json({message:`there's an error on the server`, err:err.message})
                }if(imagePath){
                    fs.unlinkSync(`./public`+imagePath)
                }
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
        var id=req.params.selectedId
        var sql=`SELECT p.id, p.judul, p.idkategori, p.deskripsi, p.bab, p.materi FROM product p join category c on p.idkategori=c.idkat where p.id=${id}`
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    },
    getPageKelas:(req, res)=>{
        const sqlCount=`SELECT COUNT(*) AS count FROM product` //total produk
        let dataCount
        mysql.query(sqlCount, (err, result)=>{
            if(err) res.status(500).send(err)
            dataCount=result[0].count 

            const page=parseInt(req.params.page)||1 //mindah2
            const pageSize=9
            const pager=paginate(dataCount, page, pageSize)

            let offset //limit in product
            if(page === 1){
                offset=0
            }else{
                offset=pageSize * (page - 1)
            }

            sql=`SELECT * FROM product p join category c on p.idkategori=c.idkat LIMIT ? OFFSET ?`
            mysql.query(sql, [pageSize, offset], (err1, result2)=>{
                if(err) res.status(500).send(err1)
                const pageOfData=result2
                return res.status(200).send({pageOfData, pager})
            })
        })
    },
    getBranding:(req, res)=>{
        var sql='SELECT * FROM product p join category c on p.idkategori=c.idkat where p.idkategori=1'
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    },
    getMarketing:(req, res)=>{
        var sql='SELECT * FROM product p join category c on p.idkategori=c.idkat where p.idkategori=2'
        mysql.query(sql, (err, res1)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send(res1)
        })
    }
}