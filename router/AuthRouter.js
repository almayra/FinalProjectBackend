const express=require('express')
const {authController}=require('./../controller')
const router=express.Router()

router.get('/hashpassword', authController.crypto) 
router.post('/register', authController.register)
router.put('/verifikasiemail', authController.emailverifikasi)

module.exports=router

//put ngedit
//post nambah (bisa ngeget juga)
//get ngambil