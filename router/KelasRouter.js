const express=require('express')
const {productController}=require('../controller')
const router=express.Router()

router.post('/tambahkelas', productController.postKelas)
router.get('/getkelas', productController.getKelas)
router.get('/getkategori', productController.getKategori)
router.delete('/deletekelas/:selectedId', productController.deleteKelas)
router.put('/editkelas/:selectedIdEdit', productController.editKelas)

module.exports=router