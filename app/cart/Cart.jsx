import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = ({ userId, onTotalAmountChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch cart items
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8085/api/v1/cart/${userId}`);
      setCartItems(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]); // Set to empty in case of error
      setLoading(false);
    }
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const roundedTotalAmount = Math.round(totalAmount * 100) / 100;

  useEffect(() => {
    fetchCartItems();
    const intervalId = setInterval(fetchCartItems, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    onTotalAmountChange(roundedTotalAmount);
  }, [roundedTotalAmount, onTotalAmountChange]);

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4 text-center">Your Cart</h2>

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : cartItems.length > 0 ? (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.productId} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <span className="text-white">{item.name}</span>
                <span className="text-white">${item.price} x {item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xl font-semibold text-white text-center">Total: ${roundedTotalAmount}</p>
        </>
      ) : (
        <div className="text-center text-white">Your cart is empty.</div>
      )}
    </div>
  );
};

export default Cart;
