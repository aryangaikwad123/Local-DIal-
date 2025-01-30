const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'YOUR_RAZORPAY_KEY_ID',
    key_secret: 'YOUR_RAZORPAY_KEY_SECRET'
});

// Endpoint to create an order
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount, // Amount in paise
        currency: 'INR',
        receipt: 'order_rcptid_11'
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({ order_id: order.id });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to verify payment
app.post('/verify-payment', (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
        .createHmac('sha256', 'YOUR_RAZORPAY_KEY_SECRET')
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});