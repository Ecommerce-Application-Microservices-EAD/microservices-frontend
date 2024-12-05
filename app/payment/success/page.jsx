'use client';

import axiosInstance from '@/lib/axiosConfig';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const token = "";

export default function PaymentSuccess({ searchParams }) {
  const { amount, paymentId, userId, items } = searchParams;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearCart = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/cart/${userId}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      console.log(response.data); // Success message
    } catch (error) {
      setError(error.response?.data || 'Error clearing cart');
      console.error('Error clearing cart:', error.response?.data || error.message); // Error message
    }
  };

  const updatePaymentStatus = async (paymentId) => {
    try {
      const response = await axiosInstance.post(`/payments/${paymentId}/confirm`, {}, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      console.log(response.data); // Success message
    } catch (error) {
      setError(error.response?.data || 'Error updating payment status');
      console.error('Error updating payment status:', error.response?.data || error.message); // Error message
    }
  };

  const placeOrder = async (orderDetails) => {
    try {
      console.log('Order details:', orderDetails);
      const response = await axiosInstance.post('/orders', orderDetails, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // Uncomment if authorization is needed
        },
      });

      console.log(response.data); // Success message
      // Handle success (e.g., navigate to order confirmation page, clear cart, etc.)
    } catch (error) {
      setError(error.message + ' : Error placing order');
      console.error('Error placing order:', error.response?.data || error.message); // Error message
    }
  };

  useEffect(() => {
    if (paymentId) {
      setLoading(true);
      clearCart(userId).finally(() => setLoading(false));
    } else {
      setError('Payment ID not found in URL');
    }
  }, [paymentId, userId]);

  useEffect(() => {
    if (paymentId) {
      setLoading(true);
      updatePaymentStatus(paymentId).finally(() => setLoading(false));
    }
  }, [paymentId, userId]);

  useEffect(() => {
    if (paymentId) {
      setLoading(true);
      const orderDetails = {
        // paymentId,
        items: JSON.parse(decodeURIComponent(items)),
        totalAmount: Number(amount),
        userId,
        status: 'placed',
        shippingAddress: '123 Main St, Anytown, USA',
      };
      console.log('Order details being sent:', orderDetails);
      placeOrder(orderDetails).finally(() => setLoading(false));
    }
  }, [paymentId, amount, userId, items]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 to-gray-900 p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Thank you!</h1>
        <h2 className="text-2xl text-gray-300 mb-6">You successfully paid</h2>

        <div className="bg-gray-700 p-4 rounded-md text-white text-3xl font-bold mb-4">
          ${amount}
        </div>

        <div className="bg-gray-700 p-4 rounded-md text-white text-3xl font-bold mb-4">
          Payment ID: {paymentId}
        </div>

        {loading && (
          <div className="bg-blue-700 p-4 rounded-md text-white text-2xl font-bold mb-4">
            Processing...
          </div>
        )}

        {error && (
          <div className="bg-red-700 p-4 rounded-md text-white text-2xl font-bold mb-4" aria-live="assertive">
            {error}
          </div>
        )}

        <button className="bg-purple-700 text-white p-4 rounded-md text-2xl font-bold mt-6 hover:bg-purple-800 transition duration-300">
          <a href="/" aria-label="Go back to the home page">Go back to the home page</a>
        </button>
      </div>
    </main>
  );
}

PaymentSuccess.propTypes = {
  searchParams: PropTypes.shape({
    amount: PropTypes.string.isRequired,
    paymentId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    items: PropTypes.string.isRequired,
  }).isRequired,
};
