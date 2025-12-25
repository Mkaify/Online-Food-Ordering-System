"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useParams, redirect, useRouter } from "next/navigation";
import { MenuItemSkeleton } from "@/components/common/Skeletons";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  image?: string;
  menuItems: MenuItem[];
}

// Mapping from numeric IDs to string IDs for backwards compatibility
const ID_MAP: Record<string, string> = {
  "1": "italian-delight",
  "2": "spicy-indian",
  "3": "dragon-wok",
  "4": "mexican-fiesta",
  "5": "test-restaurant-1"
};

// Function to get appropriate image for restaurant
const getRestaurantImage = (restaurantId: string) => {
  // Use static images from Unsplash with specific search terms
  const imageMap: Record<string, string> = {
    'italian-delight': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&auto=format&fit=crop',
    'spicy-indian': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&auto=format&fit=crop',
    'dragon-wok': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&auto=format&fit=crop',
    'delicious-bites': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&auto=format&fit=crop',
    'mexican-fiesta': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&auto=format&fit=crop'
  };

  return imageMap[restaurantId] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&auto=format&fit=crop';
};

// Function to get menu item image based on category and name
const getMenuItemImage = (category: string, name: string) => {
  // Basic image mapping based on food category
  const categoryImages: Record<string, string> = {
    'pizza': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    'pasta': 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
    'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    'rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    'noodles': 'https://images.unsplash.com/photo-1552611052-33e04de081de',
    'taco': 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'burrito': 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615',
    'dessert': 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
    'drink': 'https://images.unsplash.com/photo-1544145945-f90425340c7e'
  };
  
  // Try to match the category directly
  if (categoryImages[category.toLowerCase()]) {
    return categoryImages[category.toLowerCase()];
  }
  
  // If no direct match, try to infer from name
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('pizza')) return categoryImages['pizza'];
  if (nameLower.includes('pasta')) return categoryImages['pasta'];
  if (nameLower.includes('curry')) return categoryImages['curry'];
  if (nameLower.includes('rice')) return categoryImages['rice'];
  if (nameLower.includes('noodle')) return categoryImages['noodles'];
  if (nameLower.includes('taco')) return categoryImages['taco'];
  if (nameLower.includes('burrito')) return categoryImages['burrito'];
  if (nameLower.includes('cake') || nameLower.includes('ice cream')) return categoryImages['dessert'];
  if (nameLower.includes('soda') || nameLower.includes('drink') || nameLower.includes('water')) return categoryImages['drink'];
  
  // Default food image
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
};

function RestaurantDetailContent() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;
  const router = useRouter();
  const { data: session } = useSession();
  
  // Redirect numeric IDs to named IDs
  if (id && !isNaN(Number(id)) && ID_MAP[id]) {
    redirect(`/restaurants/${ID_MAP[id]}`);
  }
  
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, item: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (!mounted) return;
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Page: Fetching restaurant with ID:", id);
        
        if (!id) {
          throw new Error("Restaurant ID is missing");
        }
        
        const response = await fetch(`/api/restaurants/${id}`);
        setResponseStatus(response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          throw new Error(errorData.error || `Failed to load restaurant (status: ${response.status})`);
        }
        
        const data = await response.json().catch(() => {
          throw new Error('Failed to parse restaurant data');
        });
        
        if (!data || !data.id) {
          throw new Error('Invalid restaurant data received');
        }
        
        console.log("Restaurant data received:", data);
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError(err instanceof Error ? err.message : 'Failed to load restaurant');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    } else {
      setError("Invalid restaurant ID");
      setIsLoading(false);
    }
  }, [id, mounted]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Restaurant</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {responseStatus && (
            <p className="text-gray-500 mb-4">Response status: {responseStatus}</p>
          )}
          <p className="text-gray-500 mb-4">Restaurant ID: {id || 'Not provided'}</p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!mounted || isLoading || !restaurant) {
    return (
      <div className="space-y-8">
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const menuItems = restaurant.menuItems.map(item => ({
    ...item,
    image: item.image || getMenuItemImage(item.category, item.name)
  }));

  const categories = ["all", ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredMenu = selectedCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    if (!session?.user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
    });

    // Show notification
    setNotification({
      message: "Added to cart",
      item: item.name
    });
  };

  return (
    <div className="space-y-8 relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          <p><span className="font-semibold">{notification.item}</span> {notification.message}</p>
        </div>
      )}

      {/* Restaurant Header */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image
          src={restaurant.image || getRestaurantImage(restaurant.id)}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
          unoptimized={process.env.NODE_ENV === 'development'}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg">{restaurant.description}</p>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
          <p className="text-gray-600">{restaurant.address}</p>
          <p className="text-gray-600">{restaurant.phone}</p>
          <p className="text-gray-600">{restaurant.email}</p>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized={process.env.NODE_ENV === 'development'}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                  {session?.user ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                    >
                      Sign in to Order
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No items available in this category
          </div>
        )}
      </div>
    </div>
  );
}

export default function RestaurantDetail() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))}
        </div>
      </div>
    }>
      <RestaurantDetailContent />
    </Suspense>
  );
}