const express=require('express')
const {authController}=require('./../controller')
const router=express.Router()

router.get('/hashpassword', authController.crypto) 
router.post('/register', authController.register)
router.put('/verifikasiemail', authController.emailverifikasi)
router.get('/login', authController.login)
router.get('/login/:id', authController.login)
router.get('/datauser', authController.getUser)

module.exports=router

//put ngedit
//post nambah (bisa ngeget juga)
//get ngambil