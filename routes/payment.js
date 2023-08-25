const express = require('express')
const router = express.Router()
const {isLoggedIn, customRole} = require ('../middlewares/user')
const {sendStripeKey,sendRazorpayKey,captureStripePayment,captureRazorpayPayment} = require('../controllers/paymentController')

router.route('/stripeKey').get(isLoggedIn, sendStripeKey)
router.route('/razorpaykey').get(isLoggedIn, sendRazorpayKey)


router.route('/capturestripepayment').post(isLoggedIn,captureStripePayment )
router.route('/capturerazorpaypayment').post(isLoggedIn,captureRazorpayPayment )



module.exports = router 