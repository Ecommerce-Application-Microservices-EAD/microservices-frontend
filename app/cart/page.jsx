"use client";

import React, { useState } from "react";
import ProductsGrid from "./Products";
import Cart from "./Cart";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const userId = 'user123'; // Replace with actual userId
  const router = useRouter();

  const handleTotalAmount = (amount) => {
    setTotalAmount(amount);
  };

  const handleCartItemsChange = (items) => {
    setCartItems(items);
  };

  const handleCheckoutClick = () => {
    if (totalAmount > 0) {
      const cartItemsString = encodeURIComponent(JSON.stringify(cartItems));
      router.push(`/payment?amount=${totalAmount}&userId=${userId}&items=${cartItemsString}`);
    } else {
      alert("Please add products to your cart first!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A202C] to-[#2D3748] py-8">
      <div className="w-full max-w-4xl bg-black shadow-xl rounded-lg p-8 md:p-10">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">
          Shopping Cart
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            onClick={() => setShowProducts(!showProducts)}
          >
            {showProducts ? "Hide Products" : "Add more Items"}
          </button>
        </div>

        {showProducts ? (
          <ProductsGrid userId={userId} />
        ) : (
          <>
            <div className="flex justify-center">
              <Cart onTotalAmountChange={handleTotalAmount} onCartItemsChange={handleCartItemsChange} userId={userId} />
            </div>
            <div className="flex justify-center mt-6">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
                onClick={handleCheckoutClick}
              >
                Check Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
