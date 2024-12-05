import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { removeItemFromCart } from "@/services/cartService";
import useCartItems from "@/hooks/useCartItems";

const CartItem = ({ item, onRemove }) => (
  <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{item.name}</td>
    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">${item.price}</td>
    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{item.quantity}</td>
    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
      ${Math.round(item.price * item.quantity * 100) / 100}
    </td>
    <td className="px-6 py-4">
      <button
        className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 font-medium px-4 py-2 rounded-lg shadow-md"
        onClick={() => onRemove(item.productId)}
      >
        Remove
      </button>
    </td>
  </tr>
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
      console.error("Error removing item from cart:", error);
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
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-900 mt-6 p-6">
    

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : cartItems.length > 0 ? (
        <>
          <table className="min-w-full table-auto text-sm text-gray-600 dark:text-gray-300">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Subtotal</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} onRemove={removeItem} />
              ))}
            </tbody>
          </table>
          <p className="mt-6 text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Total: ${roundedTotalAmount}
          </p>
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg font-medium py-8 max-w-xl mx-auto">
  Your cart is empty. Browse products and add them to your cart!
</p>

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
