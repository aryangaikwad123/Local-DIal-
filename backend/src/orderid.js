const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
 key_id: "rzp_test_1DP5mmOlF5G5ag",
  key_secret: "2s2XQ3g7L7c2v1d6z2v2Q8m2",
});

// API to create an order
app.post("/create-order", async (req, res) => {
  const amount = 50000; // Amount in paisa (₹500.00)
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt#1",
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order", details: error });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
