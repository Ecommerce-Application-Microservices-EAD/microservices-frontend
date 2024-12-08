"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosConfig";
import { useAuth } from "@/context/AuthProvider";

// Helper function to safely get the token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwtToken");
  }
  return null;
};

export default function Orders() {
  const { user } = useAuth();
  const userId = user?.sub;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken(); // Safely get the token
        if (!token) {
          setError("User authentication token not found.");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
        setError(error.response?.data || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleOrderClick = (order) => {
    router.push(
      `/orders/${order.orderId}?order=${encodeURIComponent(
        JSON.stringify(order)
      )}`
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "placed":
        return "text-yellow-500";
      case "Shipped":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-300";
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Your Orders
      </h1>
      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400">No orders yet</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="cursor-pointer hover:bg-gray-700"
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">
                    {order.orderId}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">
                    ${order.totalAmount}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">
                    {new Date(order.createdDate).toLocaleString()}
                  </td>
                  <td
                    className={`py-4 px-6 border-b border-gray-700 ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
