import { Order } from '@/app/types/Order';
import { getAllOrders } from '@/services/OrderService';
import { useEffect, useState } from "react";


export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<any>(null);



useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching Orders:", err);
        setError(err);
      }
    };
    fetchOrders();
  }, []);

  return {
    orders,
    error
  };
}