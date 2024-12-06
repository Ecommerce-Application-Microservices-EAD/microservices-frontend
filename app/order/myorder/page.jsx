"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sampleDataOrder } from "@/lib/sampleDataOrder";

export default function MyOrderPage() {
  const [orders, setOrders] = useState(sampleDataOrder);
  const [selectedOrder, setSelectedOrder] = useState({
    product: { name: "N/A", price: 0, skuCode: "N/A" },
    quantity: 0,
    status: "Unknown",
  }); 

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Retrieve the logged-in userId here (Username)
  const userId = 1;

  // Fetch orders by userId
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/order/user/${userId}`);
        const data = await response.json();
        setOrders(data);
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

  // Fetch order details by orderId 
  const fetchOrderDetails = async (orderId, event) => {
    try {
      
      const rect = event.target.getBoundingClientRect();
      setPopoverPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height });

      
      setIsPopoverOpen(true);

      const response = await fetch(`http://localhost:8081/api/v1/order/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
      } else {
        console.error("Order not found. Using default data.");
      }
    } catch (error) {
      console.error("Failed to fetch order details. Using default data.", error);
    }
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
    setSelectedOrder({
      product: { name: "N/A", price: 0, skuCode: "N/A" },
      quantity: 0,
      status: "Unknown",
    }); 
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
                    alt={order.product.skuCode}
                    className="w-20 h-20 object-cover rounded-md mb-4"
                  />
                  <h3 className="text font-bold">{order.product.skuCode}</h3>
                </div>
                <p>${order.product.price.toFixed(2)}</p>
                <p className={getStatusColor(order.status)}>{order.status}</p>
                <div className="flex gap-2">
                  <Button onClick={(e) => fetchOrderDetails(order.id, e)}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Popover for Order Details */}
      {isPopoverOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={closePopover}
        >
          <div
            className="absolute bg-white shadow-lg rounded-lg p-5 w-80"
            style={{
              top: popoverPosition.y + 10,
              left: popoverPosition.x - 160,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Product Name:</strong> {selectedOrder.product.name}
            </p>
            <p>
              <strong>Price:</strong> ${selectedOrder.product.price.toFixed(2)}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedOrder.quantity}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <div className="flex justify-end mt-4">
              <Button onClick={closePopover}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
