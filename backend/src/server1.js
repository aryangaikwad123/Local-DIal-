require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure PayPal
paypal.configure({
  mode: "sandbox", // or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

app.post("/pay", (req, res) => {
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        amount: {
          total: req.body.amount,
          currency: "USD",
        },
        description: "Payment for your order",
      },
    ],
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      res.json({ approvalUrl });
    }
  });
});

app.get("/success", (req, res) => {
  const { paymentId, PayerID } = req.query;

  paypal.payment.execute(
    paymentId,
    { payer_id: PayerID },
    (error, payment) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json({ message: "Payment successful", payment });
      }
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));
