const express=require('express')
const {productController}=require('../controller')
const router=express.Router()

router.post('/tambahkelas', productController.postKelas)
router.get('/getkelas', productController.getKelas)
router.get('/getkategori', productController.getKategori)
router.delete('/deletekelas/:selectedId', productController.deleteKelas)
router.put('/editkelas/:selectedIdEdit', productController.editKelas)
router.get('/getdetailkelas/:selectedId', productController.getDetailKelas)
router.get('/getkelaspage/:page', productController.getPageKelas)
router.get('/getbranding', productController.getBranding)
router.get('/getmarketing', productController.getMarketing)
router.get('/getkelasbaru', productController.getKelasBaru)

module.exports=router