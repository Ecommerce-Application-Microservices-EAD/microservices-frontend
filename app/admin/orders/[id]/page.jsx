"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosConfig';

const token = localStorage.getItem('jwtToken');

export default function OrderDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderQuery = searchParams.get('order');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderQuery) {
      setOrder(JSON.parse(orderQuery));
    }
  }, [orderQuery]);

  const handleChangeStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/orders/${order.orderId}/status?status=${newStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder({ ...order, status: newStatus });
      setError(null);
    } catch (error) {
      setError(error.response?.data || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Order Details</h1>
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {order && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-4">Order #{order.orderId}</h2>
          <div className="mb-4">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300 font-semibold">Total Amount:</td>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300">${order.totalAmount}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300 font-semibold">Created:</td>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300">{new Date(order.createdDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300 font-semibold">Updated:</td>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300">{new Date(order.lastModifiedDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300 font-semibold">Status:</td>
                  <td className="py-2 px-4 border-b border-gray-600 text-gray-300">{order.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Items:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product ID</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-600">
                    <td className="py-2 px-4 border-b border-gray-600 text-gray-300">{item.productId}</td>
                    <td className="py-2 px-4 border-b border-gray-600 text-gray-300">{item.name}</td>
                    <td className="py-2 px-4 border-b border-gray-600 text-gray-300">${item.price}</td>
                    <td className="py-2 px-4 border-b border-gray-600 text-gray-300">{item.quantity}</td>
                    <td className="py-2 px-4 border-b border-gray-600 text-gray-300">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.back()}
            >
              Go Back
            </button>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => handleChangeStatus('Shipped')}
                disabled={loading}
              >
                Mark as Shipped
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleChangeStatus('Delivered')}
                disabled={loading}
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}