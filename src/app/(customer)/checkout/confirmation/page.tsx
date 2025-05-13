"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  restaurantId: string;
};

type CheckoutData = {
  address: string;
  phone: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
};

interface RestaurantOrder {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

interface RestaurantOrdersMap {
  [restaurantId: string]: RestaurantOrder;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { addOrder } = useOrder();
  const { user } = useAuth();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Retrieve checkout data from session storage
    const data = sessionStorage.getItem('checkoutData');
    if (!data) {
      router.push('/checkout');
      return;
    }

    setCheckoutData(JSON.parse(data));
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!checkoutData || !user) return;
    
    setIsSubmitting(true);
    try {
      // Create a new order in the OrderContext
      addOrder({
        items: checkoutData.items.map(item => ({
          ...item,
          description: `${item.name} from restaurant ${item.restaurantId}`
        })),
        total: checkoutData.total,
        deliveryDetails: {
          name: user.name || 'Customer',
          email: user.email || '',
          phone: checkoutData.phone,
          address: checkoutData.address,
          city: 'Your City',
          postalCode: '12345',
          instructions: '',
        }
      });
      
      // Save the order to the database
      // Group items by restaurant and create orders
      const restaurantOrdersMap: RestaurantOrdersMap = {};
      
      checkoutData.items.forEach(item => {
        if (!restaurantOrdersMap[item.restaurantId]) {
          restaurantOrdersMap[item.restaurantId] = {
            restaurantId: item.restaurantId,
            items: [],
            total: 0
          };
        }
        
        const restaurantOrder = restaurantOrdersMap[item.restaurantId];
        restaurantOrder.items.push({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        });
        restaurantOrder.total += item.price * item.quantity;
      });
      
      // Create orders for each restaurant
      const restaurantOrders = Object.values(restaurantOrdersMap);
      for (const orderData of restaurantOrders) {
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              restaurantId: orderData.restaurantId,
              items: orderData.items,
              total: orderData.total
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to create order in database:', await response.text());
          }
        } catch (error) {
          console.error('Error creating order in database:', error);
        }
      }
      
      // Clear cart and session data
      clearCart();
      sessionStorage.removeItem('checkoutData');
      
      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!checkoutData) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
              <span className="text-sm mt-2 text-blue-600 font-medium">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                2
              </div>
              <span className="text-sm mt-2 text-blue-600 font-medium">Checkout</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                3
              </div>
              <span className="text-sm mt-2 text-blue-600 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
        
        <p className="text-gray-600 mb-6">
          Please review your order details before confirming your purchase.
        </p>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {checkoutData.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold mb-4">Delivery Details</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Delivery Address:</span>
                <span className="font-medium">{checkoutData.address}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Phone Number:</span>
                <span className="font-medium">{checkoutData.phone}</span>
              </p>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold mb-4">Payment Method</h3>
            <p className="font-medium">
              {checkoutData.paymentMethod === 'credit_card' ? 'Credit Card' : 'Cash on Delivery'}
            </p>
          </div>

          <div className="p-6">
            <div className="flex justify-between py-2 text-lg">
              <span className="font-semibold">Order Total:</span>
              <span className="font-bold">${checkoutData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 justify-between">
          <Link 
            href="/checkout" 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Checkout
          </Link>
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
} 