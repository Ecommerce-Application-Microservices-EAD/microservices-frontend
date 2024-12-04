import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import axiosInstance from '@/lib/axiosConfig';


const token = ""


// Custom hook for fetching cart items
const useCartItems = (userId) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      //const response = await axios.get(`http://127.0.0.1:8085/api/v1/cart/${userId}`);

      const response = await axiosInstance.get(`/cart/${userId}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      setCartItems(response.data.items || []);
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]); // Set to empty in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    const intervalId = setInterval(fetchCartItems, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [userId]);

  return { cartItems, loading, fetchCartItems };
};

const CartItem = ({ item, onRemove }) => (
  <li className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
    <span className="text-white">{item.name}</span>
    <span className="text-white">${item.price} x {item.quantity} = ${item.price * item.quantity}</span>
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => onRemove(item.productId)}
    >
      Remove
    </button>
  </li>
);

CartItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

const Cart = ({ userId, onTotalAmountChange }) => {
  const { cartItems, loading, fetchCartItems } = useCartItems(userId);

  const removeItemFromCart = async (productId) => {
    try {
      // await axios.delete(`http://127.0.0.1:8085/api/v1/cart/remove/${productId}`, {
      //   params: { userId }
      // });

      await axiosInstance.delete(`/cart/${userId}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      fetchCartItems(); // Refresh cart items after removal
    } catch (error) {
      console.error('Error removing item from cart:', error.response.data);
    }
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const roundedTotalAmount = useMemo(() => {
    return Math.round(totalAmount * 100) / 100;
  }, [totalAmount]);

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
              <CartItem key={item.productId} item={item} onRemove={removeItemFromCart} />
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

Cart.propTypes = {
  userId: PropTypes.string.isRequired,
  onTotalAmountChange: PropTypes.func.isRequired,
};

export default Cart;
