const express=require('express')
const {transaksiController}=require('../controller')
const router=express.Router()

router.post('/postbukti', transaksiController.postTransaksi),
router.get('/gettransaksi/:page', transaksiController.getTransaksi)
router.get('/paket', transaksiController.getPaket)
router.put('/approvepay/:idtransaksi', transaksiController.approveTransaksi)

module.exports=router