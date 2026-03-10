const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderConfirmation, sendAdminOrderNotification } = require('../utils/mailer');

// @route   POST api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
    try {
        const {
            user,
            items,
            totalAmount,
            shippingAddress,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        const newOrder = new Order({
            user,
            items,
            totalAmount,
            shippingAddress,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            paymentStatus: razorpayPaymentId ? 'paid' : 'pending'
        });

        const order = await newOrder.save();

        // Send Confirmation Emails
        try {
            let userDetails = await User.findById(user);

            // Fallback for guest checkout or if user details are not in DB
            if (!userDetails) {
                userDetails = {
                    name: order.shippingAddress.name || 'Guest Customer',
                    email: order.shippingAddress.email || ''
                };
            }

            if (userDetails.email) {
                await sendOrderConfirmation(userDetails.email, order);
            }

            // Always notify admin
            await sendAdminOrderNotification(order, userDetails);

        } catch (emailErr) {
            console.error('Failed to send confirmation email:', emailErr);
        }

        res.json(order);
    } catch (err) {
        console.error('Order creation error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/user/:userId
// @desc    Get all orders for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('Fetch orders error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error('Fetch order by ID error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
