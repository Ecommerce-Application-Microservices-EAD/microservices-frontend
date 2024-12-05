import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { removeItemFromCart } from '@/services/cartService';
import useCartItems from '@/hooks/useCartItems';

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

const Cart = ({ userId, onTotalAmountChange, onCartItemsChange }) => {
  const { cartItems, loading, fetchItems } = useCartItems(userId, onCartItemsChange);

  const removeItem = async (productId) => {
    try {
      await removeItemFromCart(userId, productId); 
      fetchItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
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
              <CartItem key={item.productId} item={item} onRemove={removeItem} />
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
  onCartItemsChange: PropTypes.func.isRequired,
};

export default Cart;
