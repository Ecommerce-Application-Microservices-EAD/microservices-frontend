// App/payment/cart.jsx


import React, { useEffect, useState } from 'react';
import './styles.css'; 
import axios from 'axios'; 

const Cart = ({  userId ,  onTotalAmountChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // const userId = 12345; 

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
  const roundedTotalAmount = Math.round(totalAmount * 100)/100;

  useEffect(() => {
    fetchCartItems();
    const intervalId = setInterval(fetchCartItems, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array to run only once on mount


  useEffect(() => {
    onTotalAmountChange(roundedTotalAmount);
  }, [roundedTotalAmount, onTotalAmountChange]);

  return (
    <div className="cart">
      <h2 className="section-title">Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length > 0 ? (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.productId} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price} x {item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="total-amount">Total: ${roundedTotalAmount}</p>
        </>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
