'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function PaymentSuccess({ searchParams }) {
  const { amount, paymentId, userId } = searchParams;
  const [error, setError] = useState(null);

  useEffect(() => {
    const clearCart = async (userId) => {
      try {
        const response = await axios.delete(`http://localhost:8085/api/v1/cart/clear`, {
          params: { userId },
        });
        console.log(response.data); // Success message
      } catch (error) {
        console.error('Error clearing cart:', error.response.data); // Error message
      }
    };

    if (paymentId) {
      clearCart(userId);
    } else {
      setError('Payment ID not found in URL');
    }
  }, [paymentId, userId]);


  

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully paid</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          Payment ID: {paymentId}
        </div>

        {error && (
          <div className="bg-white p-2 rounded-md text-red-500 mt-5 text-4xl font-bold">
            {error}
          </div>
        )}

      </div>
    </main>
  );
}
