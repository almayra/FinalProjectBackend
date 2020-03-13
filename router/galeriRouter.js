const express=require('express')
const {galeriController}=require('../controller')
const router=express.Router()

router.post('/tambahgaleri', galeriController.postGaleri)
router.get('/getgaleri', galeriController.getGaleri)
router.delete('/deletegaleri/:selectedId', galeriController.deteleGaleri)

module.exports=router