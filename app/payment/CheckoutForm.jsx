'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ totalAmount, paymentId, userId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js or elements is not loaded');
      return;
    }

    console.log('amount:', totalAmount);
    console.log('paymentId:', paymentId);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/payment/success?amount=${totalAmount}&paymentId=${paymentId}&userId=${userId}`, // Redirect after successful payment
      },
    });

    if (error) {
      console.error('Payment error:', error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='gap-4'>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
