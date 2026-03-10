const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST api/payment/create-order
// @desc    Create a Razorpay order
router.post('/create-order', async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    try {
        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/payment/verify
// @desc    Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        res.json({ status: 'success', message: 'Payment verified' });
    } else {
        res.status(400).json({ status: 'failure', message: 'Signature verification failed' });
    }
});

module.exports = router;
