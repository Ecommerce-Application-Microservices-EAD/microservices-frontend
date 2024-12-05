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
      <h1 className="text-2xl font-semibold text-center mb-4">Order Details</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-black text-xl font-semibold mb-2">Order #{order.orderId}</h2>
        <p className="text-gray-700">Total Amount: ${order.totalAmount}</p>
        <p className="text-gray-700">Created : {new Date(order.createdDate).toLocaleString()}</p>
        <p className="text-gray-700">Updated : {order.lastModifiedDate}</p>
        <p className="text-gray-700">Status : {order.status}</p>
        <h3 className="text-lg font-semibold mt-4">Items:</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.productId} className="text-gray-700">
             {item.productId} - {item.name} - ${item.price} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}