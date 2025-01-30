import React from "react";

const RazorpayPayment = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay script.");
      return;
    }

    // Fetch order ID from backend
    const response = await fetch("http://localhost:5000/create-order", {
      method: "POST",
    });
    const data = await response.json();

    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay API Key
      amount: data.amount, // Amount in paisa (from backend)
      currency: data.currency,
      order_id: data.id, // Order ID from backend
      name: "Your Company",
      description: "Test Payment",
      handler: function (response) {
        console.log(response);
        alert("Payment successful!");
        // Optionally, send this response to the backend for verification
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.reason);
    });
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      Pay Now
    </button>
  );
};

export default RazorpayPayment;
// Replace YOUR_RAZORPAY_KEY with your Razorpay API Key. You can find your API Key in the Razorpay Dashboard.