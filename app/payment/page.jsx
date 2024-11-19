"use client";

import React, { useState, useEffect } from "react";
import Cart from "./Cart";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./styles.css";
import axios from "axios";
import ProductsGrid from "./Products";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const [showProducts, setShowProducts] = useState(false);

  const [userId, setUserId] = useState(12345); // Hardcoded userId

  useEffect(() => {
    if (totalAmount > 0) {
      const fetchClientSecret = async () => {
        try {
          console.log("Fetching client secret...");
          const response = await axios.post(
            "http://127.0.0.1:8085/api/payments/create",
            {
              amount: totalAmount * 100,
              currency: "usd",
            }
          );

          console.log("Client secret fetched:", response.data.clientSecret);
          setClientSecret(response.data.clientSecret);
          setPaymentId(response.data.paymentId);
        } catch (error) {
          console.error("Error fetching client secret:", error);
        }
      };

      fetchClientSecret();
    }
  }, [totalAmount]);

  const handleTotalAmount = (amount) => {
    console.log("Total amount in PaymentPage:", amount);
    setTotalAmount(amount);
  };

  const handleCheckoutClick = () => {
    if (clientSecret) {
      setShowCheckout(true);
    }
  };

  const handleBackToCartClick = () => {
    setShowCheckout(false);
  };

  const handleSeeProductsClick = () => {
    setShowProducts(!showProducts);
  };

  return (
    <div className="payment-page">
      <h1 className="title">Secure Payment Page</h1>
      <div className="container">
        {!showCheckout ? (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSeeProductsClick}
            >
              {showProducts ? "Hide Products" : "Add more Products"}
            </button>
            {showProducts && <ProductsGrid userId={userId} />}

            {!showProducts && (
              <>
                <Cart onTotalAmountChange={handleTotalAmount} userId={userId} />
                <button
                  className="checkout-button"
                  onClick={handleCheckoutClick}
                  disabled={!clientSecret}
                >
                  Check Out
                </button>
              </>
            )}
          </>
        ) : (
          clientSecret &&
          paymentId && (
            <div className="checkout-section">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  totalAmount={totalAmount}
                  paymentId={paymentId}
                  userId={userId}
                />
              </Elements>
              <button
                className="back-to-cart-button"
                onClick={handleBackToCartClick}
              >
                Back to Cart
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
