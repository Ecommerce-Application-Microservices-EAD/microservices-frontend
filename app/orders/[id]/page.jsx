"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderQuery = searchParams.get('order');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderQuery) {
      setOrder(JSON.parse(orderQuery));
    }
  }, [orderQuery]);

  if (!order) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Order Details</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-gray-800">
          <thead>
            <tr>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total Amount</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Created</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Updated</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{order.orderId}</td>
              <td className="py-4 px-6 border-b border-gray-700 text-gray-300">${order.totalAmount}</td>
              <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{new Date(order.createdDate).toLocaleString()}</td>
              <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{new Date(order.lastModifiedDate).toLocaleString()}</td>
              <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{order.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="text-lg font-semibold mt-4 text-white">Items:</h3>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-gray-800">
          <thead>
            <tr>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product ID</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
              <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{item.productId}</td>
                <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{item.name}</td>
                <td className="py-4 px-6 border-b border-gray-700 text-gray-300">${item.price}</td>
                <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}