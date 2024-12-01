"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type OrderContextType = {
  orders: OrderItem[];
  addOrder: (order: Omit<OrderItem, "quantity">) => void;
  updateOrderQuantity: (orderId: number, quantity: number) => void;
  removeOrder: (orderId: number) => void;
  clearOrders: () => void;
  getOrderTotal: () => number;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Load orders from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, []);

  // Save orders to local storage whenever orders change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Add a new order
  const addOrder = (order: Omit<OrderItem, "quantity">) => {
    setOrders((prevOrders) => {
      const existingOrder = prevOrders.find((item) => item.id === order.id);
      if (existingOrder) {
        return prevOrders.map((item) =>
          item.id === order.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevOrders, { ...order, quantity: 1 }];
    });
  };

  // Update the quantity of an existing order
  const updateOrderQuantity = (orderId: number, quantity: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((item) =>
        item.id === orderId ? { ...item, quantity } : item
      )
    );
  };

  // Remove an order
  const removeOrder = (orderId: number) => {
    setOrders((prevOrders) => prevOrders.filter((item) => item.id !== orderId));
  };

  // Clear all orders
  const clearOrders = () => {
    setOrders([]);
  };

  // Calculate the total cost of orders
  const getOrderTotal = () => {
    return orders.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderQuantity,
        removeOrder,
        clearOrders,
        getOrderTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
