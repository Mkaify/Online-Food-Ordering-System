"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { RestaurantCardSkeleton } from "@/components/common/Skeletons";

type FeaturedRestaurant = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
};

const categories = [
  {
    id: "1",
    name: "Italian",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  },
  {
    id: "2",
    name: "Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
  },
  {
    id: "3",
    name: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
  },
  {
    id: "4",
    name: "Mexican",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
  },
];

function HomeContent() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<FeaturedRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // In a real app, this would be an API call
        // Use a fixed date to prevent hydration mismatches
        const baseDate = new Date('2024-01-01T00:00:00Z');
        setFeaturedRestaurants([
          {
            id: "1",
            name: "Italian Delight",
            description: "Authentic Italian cuisine",
            address: "123 Main St",
            phone: "123-456-7890",
            email: "italian@example.com",
            ownerId: "1",
            createdAt: baseDate,
            updatedAt: baseDate,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
          },
          {
            id: "2",
            name: "Spicy Indian",
            description: "Best Indian food in town",
            address: "456 Curry Ave",
            phone: "987-654-3210",
            email: "indian@example.com",
            ownerId: "2",
            createdAt: baseDate,
            updatedAt: baseDate,
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
          },
          {
            id: "3",
            name: "Dragon Wok",
            description: "Authentic Chinese cuisine",
            address: "789 Dragon St",
            phone: "555-555-5555",
            email: "chinese@example.com",
            ownerId: "3",
            createdAt: baseDate,
            updatedAt: baseDate,
            image: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [mounted]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Hero background"
            fill
            className="object-cover brightness-50"
            priority
            unoptimized={process.env.NODE_ENV === 'development'}
          />
        </div>
        <div className="relative z-10 text-white max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Delicious Food Delivered To Your Doorstep
          </h1>
          <p className="text-xl mb-8">
            Order from your favorite restaurants and enjoy a great meal at home
          </p>
          <Link
            href="/restaurants"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/restaurants?category=${category.name}`}
              className="group"
            >
              <div className="relative h-40 w-full rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  unoptimized={process.env.NODE_ENV === 'development'}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!mounted || isLoading ? (
            // Show skeletons while loading or before mount
            Array.from({ length: 3 }).map((_, index) => (
              <RestaurantCardSkeleton key={index} />
            ))
          ) : (
            featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-2">{restaurant.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="space-y-12">
        <div className="relative h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Loading...</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
