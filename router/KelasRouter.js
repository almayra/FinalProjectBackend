const express=require('express')
const {productController}=require('../controller')
const router=express.Router()

router.post('/tambahkelas', productController.postKelas)
router.get('/getkelas', productController.getKelas)
router.delete('/deletekelas/:selectedId', productController.deleteKelas)

module.exports=router