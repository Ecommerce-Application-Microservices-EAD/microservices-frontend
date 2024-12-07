import { Order } from '@/app/types/Order';
import { getAllOrders } from '@/services/OrderService';
import { useEffect, useState } from "react";


export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);


useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching Orders:", err);
      }
    };
    fetchOrders();
  }, []);

  return {
    orders
  };
}