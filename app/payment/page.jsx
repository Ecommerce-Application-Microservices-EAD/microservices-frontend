"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import PropTypes from "prop-types";


const token = ""



const CheckoutForm = dynamic(() => import("../payment/CheckoutForm"), {
  ssr: false,
});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const totalAmount = parseFloat(searchParams.get("amount"));
  const userId = searchParams.get("userId");

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
      setError("Stripe public key is not defined");
      setLoading(false);
      return;
    }

    if (totalAmount > 0) {
      const fetchClientSecret = async () => {
        try {
          // const response = await axios.post(
          //   "http://127.0.0.1:8085/api/payments/create",
          //   {
          //     amount: totalAmount * 100,
          //     currency: "usd",
          //     userId,
          //   }
          // );

          const response = await axiosInstance.post(
            "/payments/create",
            {
              amount: totalAmount * 100,
              currency: "usd",
              userId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          setClientSecret(response.data.clientSecret);
          setPaymentId(response.data.paymentId);
        } catch (error) {
          console.error("Error fetching client secret:", error);
          setError("Failed to load payment details. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchClientSecret();
    } else {
      setLoading(false);
    }
  }, [totalAmount, userId]);

  const stripeOptions = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A202C] to-[#2D3748]">
      <div className="w-full max-w-md bg-black shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
          Secure Payment Page
        </h1>
        {loading ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-lg mb-4">Loading payment details...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          clientSecret && paymentId && (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm
                totalAmount={totalAmount}
                paymentId={paymentId}
                userId={userId}
              />
            </Elements>
          )
        )}
      </div>
    </div>
  );
};

CheckoutForm.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  paymentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default PaymentPage;
