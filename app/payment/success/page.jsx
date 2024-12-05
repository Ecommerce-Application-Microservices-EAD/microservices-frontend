'use client';

import axiosInstance from '@/lib/axiosConfig';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function PaymentSuccess({ searchParams }) {
  const { amount, paymentId, userId, items } = searchParams;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearCart = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/cart/${userId}`);
      console.log(response.data); // Success message
    } catch (error) {
      handleError(error, 'Error clearing cart');
    }
  };

  const updatePaymentStatus = async (paymentId) => {
    try {
      const response = await axiosInstance.post(`/payments/${paymentId}/confirm`);
      console.log(response.data); // Success message
    } catch (error) {
      handleError(error, 'Error updating payment status');
    }
  };

  const reduceProductStock = async (productId, count) => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/reduce-quantity?count=${count}`);
      console.log(response.data); // Success message for reducing stock
    } catch (error) {
      handleError(error, 'Error reducing product stock');
    }
  };

  const placeOrder = async (orderDetails) => {
    try {
      console.log('Order details:', orderDetails);
      const response = await axiosInstance.post('/orders', orderDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data); // Success message

      // Reduce stock for each item in the order
      const reduceStockPromises = orderDetails.items.map(item => 
        reduceProductStock(item.productId, item.count)
      );
      await Promise.all(reduceStockPromises);
    } catch (error) {
      handleError(error, 'Error placing order');
    }
  };

  const handleError = (error, defaultMessage) => {
    setError(error.response?.data || defaultMessage);
    console.error(defaultMessage, error.response?.data || error.message); // Error message
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
  }, [paymentId]);

  useEffect(() => {
    if (paymentId) {
      setLoading(true);
      const orderDetails = {
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
