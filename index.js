const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const API_KEY = process.env.PARAXYPAY_API_KEY;

// Create Payment Endpoint
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, user_id } = req.body;
        if (!amount || !user_id) return res.status(400).json({ error: 'Missing parameters' });

        const response = await fetch('https://payment.paraxypay.com/api/payment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({ amount, user_id })
        });

        const data = await response.json();
        if (data.payment_url) return res.json({ payment_url: data.payment_url });
        else return res.status(500).json({ error: 'Payment link not generated' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Verify Payment Endpoint
app.post('/verify-payment', async (req, res) => {
    try {
        const { transaction_id } = req.body;
        if (!transaction_id) return res.status(400).json({ error: 'Missing transaction_id' });

        const response = await fetch('https://payment.paraxypay.com/api/payment/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({ transaction_id })
        });

        const data = await response.json();
        return res.json(data);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Middleman server running on port ${PORT}`));
