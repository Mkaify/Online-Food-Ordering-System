"use client";

import { useOrder } from "@/contexts/OrderContext";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Order as ContextOrder, OrderItem as ContextOrderItem } from "@/contexts/OrderContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";

// Define type for database orders and their items
type DbOrderItem = {
  quantity: number;
  name?: string;
  image?: string;
  menuItem?: {
    name: string;
  };
};

type DbOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  restaurant: {
    name: string;
  };
  items: DbOrderItem[];
};

// Type guard to check if an order is from context
const isContextOrder = (order: ContextOrder | DbOrder): order is ContextOrder => {
  return (order as ContextOrder).estimatedDeliveryTime instanceof Date;
};

// Type guard for item types
const isContextItem = (item: DbOrderItem | ContextOrderItem): item is ContextOrderItem => {
  return !('menuItem' in item);
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-purple-100 text-purple-800",
  delivering: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-blue-100 text-blue-800",
  READY_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { orders: contextOrders, clearOrders } = useOrder();
  const router = useRouter();
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from the database
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/user");
      if (response.ok) {
        const data = await response.json();
        setDbOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Use both context orders and database orders
  const allOrders = [...contextOrders, ...dbOrders];

  const handleClearHistory = async () => {
    if (isClearing) return;
    
    try {
      setIsClearing(true);
      
      // Clear context orders
      clearOrders();
      
      // Clear database orders
      const response = await fetch('/api/orders/user', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to clear order history');
      }
      
      // Refresh the page after clearing
      setDbOrders([]);
      setShowClearConfirm(false);
    } catch (err: unknown) {
      console.error('Error clearing order history:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear order history');
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          
          {allOrders.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Order History
            </button>
          )}
        </div>
        
        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Clear Order History</h3>
              <p className="mb-6">Are you sure you want to delete all your orders? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={isClearing}
                >
                  {isClearing ? 'Clearing...' : 'Clear All'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {allOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              When you place an order, it will appear here for tracking
            </p>
            <Link
              href="/restaurants"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {allOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        Order #{order.id.substring(0, 8)}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {format(new Date(order.createdAt), "PPP 'at' p")}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.status as string]
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="relative w-10 h-10 border-2 border-white rounded-full overflow-hidden"
                        >
                          <Image
                            src={isContextItem(item) ? item.image : (item.image || "/vercel.svg")}
                            alt={isContextItem(item) ? item.name : (item.name || item.menuItem?.name || "Food item")}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative w-10 h-10 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm truncate">
                        {order.items
                          .map(
                            (item) =>
                              `${item.name}${item.quantity > 1 ? ` (${item.quantity})` : ""}`
                          )
                          .slice(0, 2)
                          .join(", ")}
                        {order.items.length > 2 &&
                          ` and ${order.items.length - 2} more items`}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                      Estimated delivery:{" "}
                      <span className="font-medium">
                        {isContextOrder(order) 
                          ? format(order.estimatedDeliveryTime, "p")
                          : "Not available"}
                      </span>
                    </p>
                    <p className="font-bold">
                      ${(order.total + 2.99 + order.total * 0.1).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 