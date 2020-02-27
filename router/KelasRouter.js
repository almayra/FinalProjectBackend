const express=require('express')
const {productController}=require('../controller')
const router=express.Router()

router.post('/tambahkelas', productController.postKelas)

module.exports=router