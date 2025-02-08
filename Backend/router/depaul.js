const express = require('express')
const router = express.Router()
const auth = require('../middlerware/auth')
const depaul = require('../controller/depaul')


router.get('/depaul/recommend',auth,depaul.getRecommendation)
router.post('/add-to-cart',auth,depaul.addToCart)
router.post('/remove-from-cart', auth, depaul.removeFromCart)
router.get('/get-cart', auth, depaul.getCart)
router.get('/get-profile', auth, depaul.getProfile)
router.post('/update-profile', auth, depaul.updateProfile)
router.get('/get-company', auth,  depaul.getCompany)
router.get('/get-flavour', auth, depaul.getFlavour)
router.post('/apply-coupon', auth,  depaul.applyCoupon)
router.post('/place-order', auth, depaul.placeOrder)
router.get('/get-order', auth, depaul.getOrder)
router.get('/invoice/:filepath', depaul.getInvoice)

module.exports = router