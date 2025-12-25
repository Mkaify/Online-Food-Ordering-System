"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Calendar, Package } from "lucide-react";

// Define types locally instead of importing from Prisma
type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

type OrderWithDetails = Order & {
  restaurant: { name: string };
  items: Array<{ menuItem: { name: string }; quantity: number; price: number }>;
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/profile");
    }

    // Fetch user orders
    const fetchOrders = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/orders/user");
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [status, mounted]);

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Personal Info
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                Edit
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{session?.user.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{session?.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">{session?.user.role || "Customer"}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order History */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Package className="w-5 h-5 mr-2 text-indigo-600" />
              <h2 className="text-xl font-semibold">Order History</h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-2">You haven&apos;t placed any orders yet.</p>
                <Link href="/restaurants" className="text-indigo-600 hover:text-indigo-800">
                  Browse restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </h3>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                        order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{order.restaurant.name}</p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total.toFixed(2)}</p>
                        <button 
                          onClick={() => handleViewDetails(order.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 