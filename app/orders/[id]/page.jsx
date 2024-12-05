"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetails() {
  const router = useRouter();
  const { id, order: orderQuery } = router.query;
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
        <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
        <p className="text-gray-700">Total Amount: ${order.totalAmount}</p>
        <p className="text-gray-700">Date: {new Date(order.date).toLocaleDateString()}</p>
        <h3 className="text-lg font-semibold mt-4">Items:</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.id} className="text-gray-700">
              {item.name} - ${item.price} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}