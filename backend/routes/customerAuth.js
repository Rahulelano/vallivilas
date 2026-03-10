const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @route   POST api/customer/send-otp
// @desc    Send OTP to email
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            // Create a guest/placeholder user if doesn't exist
            user = new User({
                email,
                name: email.split('@')[0],
                password: 'temporary_password_otp_flow' // Placeholder since we use OTP
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Valli Vilas Login OTP',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #8B4513; text-align: center;">Valli Vilas</h2>
          <p>Fragrance of God,</p>
          <p>Your OTP for logging into your account is:</p>
          <h1 style="text-align: center; color: #8B4513; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: 'OTP sent successfully' });
    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/customer/verify-otp
// @desc    Verify OTP and return JWT
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
