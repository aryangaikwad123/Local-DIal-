// components/pages/Payment.js
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { amount, businessName } = location.state || {};

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };

    loadRazorpay();

    return () => {
      const script = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
      if (script) document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      // Step 1: Create order on your backend
      const orderResponse = await fetch("http://localhost:3001/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to paise
      });

      const orderData = await orderResponse.json();

      // Step 2: Initialize Razorpay
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: orderData.amount,
        currency: "INR",
        name: businessName || "Business Directory",
        order_id: orderData.id,
        handler: async function (response) {
          // Step 3: Verify payment on your backend
          const verificationResponse = await fetch("http://localhost:3001/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(response),
          });

          const verificationData = await verificationResponse.json();
          
          if (verificationData.success) {
            alert("Payment Successful!");
            // Redirect to success page or update state
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || "",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Payment Gateway</h2>
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Proceed to Pay ₹{amount}
        </button>
      </div>
    </div>
  );
};

export default Payment;