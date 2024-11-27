'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';

const CheckoutForm = ({ totalAmount, paymentId, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js or elements is not loaded');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `http://localhost:3000/payment/success?amount=${totalAmount}&paymentId=${paymentId}&userId=${userId}`, // Redirect after successful payment
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setErrorMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='gap-4'>
      <PaymentElement />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || loading} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

CheckoutForm.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  paymentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default CheckoutForm;
