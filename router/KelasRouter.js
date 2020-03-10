const express=require('express')
const {productController}=require('../controller')
const router=express.Router()

router.post('/tambahkelas', productController.postKelas)
router.get('/getkelas', productController.getKelas)
router.get('/getkategori', productController.getKategori)
router.delete('/deletekelas/:selectedId', productController.deleteKelas)
router.put('/editkelas/:selectedIdEdit', productController.editKelas)
router.post('/tambahgaleri', productController.postGaleri)
router.get('/getgaleri', productController.postGaleri)
router.delete('/deletegaleri/:selectedId', productController.deleteGaleri)
router.get('/getdetailkelas/:id', productController.getDetailKelas)

module.exports=router