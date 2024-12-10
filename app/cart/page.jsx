"use client";

import React, { useState, useEffect } from "react";
import Cart from "./Cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

const CartPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  
  const { user } = useAuth();
  const userId = user?.sub;
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/auth/login");
    }
  }, [userId, router]);

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

  const handleAddMoreItemsClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-[#1A202C] dark:via-[#2D3748] dark:to-[#4A5568] py-8">
      <div className="w-full max-w-4xl bg-white dark:bg-black shadow-xl rounded-lg p-8 md:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Your Cart
        </h1>

        {showProducts ? (
          <ProductsGrid userId={userId} />
        ) : (
          <>
            <div className="flex justify-center">
              <Cart
                onTotalAmountChange={handleTotalAmount}
                onCartItemsChange={handleCartItemsChange}
                userId={userId}
              />
            </div>
            <div className="flex justify-end mt-6 gap-4 px-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                onClick={handleAddMoreItemsClick}
              >
                Add More Items
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
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
