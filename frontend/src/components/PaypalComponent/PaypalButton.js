import React from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';

const PayPalIntegration = () => {
  const createOrder = async (data, actions) => {
    try {
      const response = await axios.post('http://localhost:5000/create-payment', {
        amount: '25.00' // Set your amount here
      });
      return response.data.approvalUrl.split('token=')[1];
    } catch (error) {
      console.error(error);
    }
  };

  const onSuccess = async (details, data) => {
    try {
      const response = await axios.get(`http://localhost:5000/execute-payment?paymentId=${data.paymentID}&PayerID=${details.payerID}`);
      console.log('Payment successful:', response.data);
      // Handle successful payment here
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <PayPalButton
      createOrder={createOrder}
      onSuccess={onSuccess}
      options={{
        clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID
      }}
    />
  );
};

export default PayPalIntegration;