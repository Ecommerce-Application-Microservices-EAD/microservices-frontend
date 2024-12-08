"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthProvider';
import dayjs from 'dayjs';

const token = localStorage.getItem('jwtToken');

export default function AdminOrderTable({ userId = useAuth().user?.sub }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
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
    router.push(`/admin/orders/${order.orderId}?order=${encodeURIComponent(JSON.stringify(order))}`);
  };

  const filterOrders = (filter) => {
    const now = dayjs();
    let filtered = orders;

    if (filter === 'today') {
      filtered = orders.filter(order => dayjs(order.createdDate).isSame(now, 'day'));
    } else if (filter === 'thisWeek') {
      filtered = orders.filter(order => dayjs(order.createdDate).isSame(now, 'week'));
    } else if (filter === 'thisMonth') {
      filtered = orders.filter(order => dayjs(order.createdDate).isSame(now, 'month'));
    }

    setFilteredOrders(filtered);
  };

  const handleUserChange = (event) => {
    const userId = event.target.value;
    setSelectedUserId(userId);
    if (userId) {
      setFilteredOrders(orders.filter(order => order.userId === userId));
    } else {
      setFilteredOrders(orders);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Orders</h1>
      <div className="flex justify-center mb-4">
        <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => filterOrders('today')}>Today</button>
        <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => filterOrders('thisWeek')}>This Week</button>
        <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => filterOrders('thisMonth')}>This Month</button>
        <select className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" value={selectedUserId} onChange={handleUserChange}>
          <option value="">All Users</option>
          {[...new Set(orders.map(order => order.userId))].map(userId => (
            <option key={userId} value={userId}>{userId}</option>
          ))}
        </select>
      </div>
      {error ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-400">No orders yet</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User ID</th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total Amount</th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.orderId} className="cursor-pointer hover:bg-gray-700" onClick={() => handleOrderClick(order)}>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{order.orderId}</td>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{order.userId}</td>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">${order.totalAmount}</td>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{new Date(order.createdDate).toLocaleString()}</td>
                  <td className="py-4 px-6 border-b border-gray-700 text-gray-300">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}