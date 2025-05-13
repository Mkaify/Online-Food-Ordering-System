"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantCard from "@/components/restaurants/RestaurantCard";

// Define the Restaurant type locally
type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
};

// Function to get appropriate image for restaurant
const getRestaurantImage = (restaurantId: string) => {
  // Use static images from Unsplash with specific search terms
  const imageMap: Record<string, string> = {
    'italian-delight': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&auto=format&fit=crop',
    'spicy-indian': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&auto=format&fit=crop',
    'dragon-wok': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&auto=format&fit=crop',
    'test-restaurant-1': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&auto=format&fit=crop',
    'mexican-fiesta': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop'
  };

  return imageMap[restaurantId] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&auto=format&fit=crop';
};

// Function to determine cuisine based on restaurant details
const getCuisine = (restaurant: Restaurant) => {
  // Check by ID first
  if (restaurant.id === 'italian-delight') return 'Italian';
  if (restaurant.id === 'spicy-indian') return 'Indian';
  if (restaurant.id === 'dragon-wok') return 'Chinese';
  
  // If no direct match, try to infer from name or description
  const nameLower = restaurant.name.toLowerCase();
  const descLower = restaurant.description?.toLowerCase() || '';
  
  if (nameLower.includes('italian') || descLower.includes('italian')) return 'Italian';
  if (nameLower.includes('indian') || descLower.includes('indian')) return 'Indian';
  if (nameLower.includes('chinese') || descLower.includes('chinese')) return 'Chinese';
  if (nameLower.includes('mexican') || descLower.includes('mexican')) return 'Mexican';
  
  // Default
  return 'Various';
};

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        
        const queryParams = new URLSearchParams();
        if (category) queryParams.append("category", category);
        if (search) queryParams.append("search", search);

        const response = await fetch(`/api/restaurants?${queryParams}`);
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurants</h1>
      
      {restaurants.length === 0 ? (
        <div className="text-center text-gray-600">
          No restaurants found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description || ""}
              image={getRestaurantImage(restaurant.id)}
              rating={4.5} // TODO: Calculate from reviews
              reviewCount={0} // TODO: Get from reviews
              deliveryTime="30-45 min" // TODO: Add to restaurant model
              cuisine={getCuisine(restaurant)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 