"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosConfig';

export default function Orders({ userId="12345" }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/orders/user/${userId}`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });
        console.log('Orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        setError(error.response?.data || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleOrderClick = (order) => {
    router.push({
      pathname: `/orders/${order.id}`,
      query: { order: JSON.stringify(order) },
    });
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-4">Your Orders</h1>
      {error ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-700">No orders yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
              onClick={() => handleOrderClick(order)}
            >
              <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
              <p className="text-gray-700">Total Amount: ${order.totalAmount}</p>
              <p className="text-gray-700">Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}