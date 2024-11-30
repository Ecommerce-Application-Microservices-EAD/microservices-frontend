'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function PaymentSuccess({ searchParams }) {
  const { amount, paymentId } = searchParams;
  const [error, setError] = useState(null);

  useEffect(() => {
    const removeCartItems = async () => {
      try {
        const response = await axios.post("/api/remove-cart-items", {
          paymentId,
        });

        if (response.status !== 200) {
            setError("Failed to remove cart items");
            return;
        }

        console.log("Cart items removed successfully");
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    removeCartItems();
  }, [paymentId]);

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
