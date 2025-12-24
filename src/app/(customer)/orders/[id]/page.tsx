"use client";

import { useOrder } from "@/contexts/OrderContext";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { OrderStatus as ContextOrderStatus, OrderItem as ContextOrderItem } from "@/contexts/OrderContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState, Suspense } from "react";

const statusSteps = [
  { id: "pending", label: "Order Placed" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready for Pickup" },
  { id: "delivering", label: "On the Way" },
  { id: "delivered", label: "Delivered" },
] as const;

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

// Type for the order from OrderContext
type ContextOrder = {
  id: string;
  status: ContextOrderStatus;
  total: number;
  createdAt: Date;
  items: ContextOrderItem[];
  deliveryDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    instructions: string;
  };
  estimatedDeliveryTime: Date;
};

// Type for order items from the database
type DatabaseOrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    image?: string;
  };
};

// Type for orders from the database
type DatabaseOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: DatabaseOrderItem[];
  restaurant?: {
    name: string;
  };
};

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const { getOrder, removeOrder } = useOrder();
  const contextOrder = getOrder(orderId) as ContextOrder | undefined;
  const [dbOrder, setDbOrder] = useState<DatabaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchOrderFromDb = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setDbOrder(data);
        } else {
          setDbOrder(null);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (!contextOrder) {
      fetchOrderFromDb();
    } else {
      setLoading(false);
    }
  }, [orderId, contextOrder]);

  // Add auto-refresh to update order status
  useEffect(() => {
    if (!contextOrder && dbOrder) {
      // Auto-refresh the order status every 30 seconds
      const interval = setInterval(() => {
        fetch(`/api/orders/${orderId}`)
          .then(response => {
            if (response.ok) return response.json();
            throw new Error('Failed to refresh order');
          })
          .then(data => {
            setDbOrder(data);
          })
          .catch(err => {
            console.error('Error refreshing order:', err);
          });
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [orderId, contextOrder, dbOrder]);

  const handleDeleteOrder = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      // If it's a context order, just remove it from context
      if (contextOrder) {
        removeOrder(orderId);
        router.push('/orders');
        return;
      }
      
      // If it's a database order, call the API
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/orders');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete order');
        setIsDeleting(false);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order. Please try again.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Use context order if available, otherwise use database order
  const order = contextOrder || dbOrder;

  if (!order) {
    return notFound();
  }

  // Function to check if an order is from the context
  const isContextOrder = (order: ContextOrder | DatabaseOrder): order is ContextOrder => {
    return (order as ContextOrder).deliveryDetails !== undefined;
  };

  // Map database order status to our step index
  let currentStepIndex = 0;
  if (isContextOrder(order)) {
    currentStepIndex = statusSteps.findIndex((step) => step.id === order.status);
  } else {
    // Map database status to steps
    const statusMap: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 1,
      READY_FOR_DELIVERY: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4,
      CANCELLED: 0
    };
    currentStepIndex = statusMap[order.status] || 0;
  }

  // Format the items based on which type of order we have
  const renderItems = () => {
    if (isContextOrder(order)) {
      // Context order items have a specific format
      return order.items.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {item.quantity} x ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      ));
    } else {
      // Database order items have a different format
      return (dbOrder?.items || []).map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-md">
            {item.menuItem.image ? (
              <Image
                src={item.menuItem.image}
                alt={item.menuItem.name}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">{item.menuItem.name}</h3>
          </div>
          <div className="text-right">
            <p className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {item.quantity} x ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      ));
    }
  };

  // Render delivery details based on order type
  const renderDeliveryDetails = () => {
    if (isContextOrder(order)) {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{order.deliveryDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{order.deliveryDetails.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">
              {order.deliveryDetails.address}
              <br />
              {order.deliveryDetails.city}, {order.deliveryDetails.postalCode}
            </p>
          </div>
          {order.deliveryDetails.instructions && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Delivery Instructions</p>
              <p className="font-medium">{order.deliveryDetails.instructions}</p>
            </div>
          )}
        </div>
      );
    } else {
      // Simplified delivery details for database orders
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-gray-600">
            Delivery details are available in your confirmation email
          </p>
        </div>
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <Link
              href="/orders"
              className="text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              ← Back to Orders
            </Link>
            
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Order
            </button>
          </div>
          
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Delete Order</h3>
                <p className="mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteOrder}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
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

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Order #{order.id.substring(0, 8)}</h1>
                  <p className="text-gray-600">
                    Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
                  </p>
                  {!isContextOrder(order) && order.restaurant && (
                    <p className="text-gray-600 mt-1">
                      From: {order.restaurant.name}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status.toString().charAt(0).toUpperCase() + 
                   order.status.toString().slice(1).toLowerCase().replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Order Progress */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
              <div className="relative">
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= currentStepIndex
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`mt-2 text-sm ${
                          index <= currentStepIndex
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {renderItems()}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              {renderDeliveryDetails()}
            </div>

            {/* Order Summary */}
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(order.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(order.total + 2.99 + order.total * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
} 