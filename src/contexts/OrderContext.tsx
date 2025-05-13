"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "delivered";

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    instructions: string;
  };
  createdAt: Date;
  estimatedDeliveryTime: Date;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, "id" | "status" | "createdAt" | "estimatedDeliveryTime">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
  removeOrder: (orderId: string) => void;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt" | "estimatedDeliveryTime">) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      createdAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const removeOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrder,
        removeOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
} 