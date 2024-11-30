// App/payment/cart.jsx
import React, { useEffect, useState } from 'react';
import './styles.css'; // Import the CSS file

const Cart = ({ onTotalAmountChange}) => {
  const [cartItems] = useState([
    { id: 1, name: 'Product 1', price: 20 },
    { id: 2, name: 'Product 2', price: 15 },
  ]);

  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    console.log('Total amount in Cart:', totalAmount); // Debugging line
    onTotalAmountChange(totalAmount);
  }, [totalAmount, onTotalAmountChange]);
  

  return (
    <div className="cart">
      <h2 className="section-title">Your Cart</h2>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
      <p className="total-amount">Total: ${totalAmount}</p>
    </div>
  );
};

export default Cart;
