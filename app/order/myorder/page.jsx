"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sampleDataOrder } from "@/lib/sampleDataOrder";

export default function MyOrderPage() {
  const [orders] = useState(sampleDataOrder); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const userId = 1; 

  // Fetch orders by user ID
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/v1/order/user/${userId}`);
        const data = await response.json();
        // setOrders(data); 
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 font-bold";
      case "processing..":
        return "text-yellow-600 font-bold";
      case "cancelled":
        return "text-red-600 font-bold";
      default:
        return "text-gray-600";
    }
  };

  // Fetch order details by ID
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/v1/order/${orderId}`);
      const data = await response.json();
      setSelectedOrder(data); 
      setIsModalOpen(true); 
    } catch (error) {
      console.error("Failed to fetch order details", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold p-2">My Orders</h1>
      <div>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="rounded-md flex flex-col border-2 p-5 mb-4">
              <CardContent className="flex justify-around w-full border-b-2 border-l-2 p-2">
                <div className="flex gap-3">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-20 h-20 object-cover rounded-md mb-4"
                  />
                  <h3 className="text font-bold">{order.product.name}</h3>
                </div>
                <p>${order.product.price.toFixed(2)}</p>
                <p className={getStatusColor(order.status)}>{order.status}</p>
                <div className="flex gap-2">
                  <Button onClick={() => fetchOrderDetails(order.id)}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Modal for Order Details */}
      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} 
        >
          <div
            className="bg-white rounded-lg p-5 w-96"
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p><strong>Product Name:</strong> {selectedOrder.product.name}</p>
            <p><strong>Price:</strong> ${selectedOrder.product.price.toFixed(2)}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
