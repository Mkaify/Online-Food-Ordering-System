"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Define the correct restaurant IDs based on our seed data
const RESTAURANT_IDS = {
  ITALIAN: 'italian-delight',
  INDIAN: 'spicy-indian',
  CHINESE: 'dragon-wok',
  MEXICAN: 'mexican-fiesta',
  DELICIOUS_BITES: 'test-restaurant-1'
};

// Create a more visible message about using named IDs for debugging
function RestaurantIdHelper() {
  return (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Development Note</h3>
      <p className="text-sm text-yellow-700 mb-2">
        Restaurant pages should be accessed using string IDs, not numbers:
      </p>
      <ul className="text-sm text-yellow-700 list-disc list-inside">
        <li>Italian Delight: <code className="bg-yellow-100 px-1">{RESTAURANT_IDS.ITALIAN}</code></li>
        <li>Spicy Indian: <code className="bg-yellow-100 px-1">{RESTAURANT_IDS.INDIAN}</code></li>
        <li>Dragon Wok: <code className="bg-yellow-100 px-1">{RESTAURANT_IDS.CHINESE}</code></li>
        <li>Mexican Fiesta: <code className="bg-yellow-100 px-1">{RESTAURANT_IDS.MEXICAN}</code></li>
      </ul>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Delicious Food Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Order from your favorite restaurants with just a few clicks
            </p>
            <Link
              href="/restaurants"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard
            name="Italian"
            image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants?category=Italian`}
          />
          <CategoryCard
            name="Indian"
            image="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants?category=Indian`}
          />
          <CategoryCard
            name="Chinese"
            image="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants?category=Chinese`}
          />
          <CategoryCard
            name="Mexican"
            image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants?category=Mexican`}
          />
        </div>
      </section>

      {/* Featured Restaurants */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Restaurants</h2>
          <Link
            href="/restaurants"
            className="text-blue-600 flex items-center hover:text-blue-800 transition-colors"
          >
            <span className="mr-1">View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeaturedRestaurantCard
            name="Italian Delight"
            description="Authentic Italian cuisine"
            image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants/${RESTAURANT_IDS.ITALIAN}`}
          />
          <FeaturedRestaurantCard
            name="Spicy Indian"
            description="Best Indian food in town"
            image="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants/${RESTAURANT_IDS.INDIAN}`}
          />
          <FeaturedRestaurantCard
            name="Dragon Wok"
            description="Authentic Chinese cuisine"
            image="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&auto=format&fit=crop"
            href={`/restaurants/${RESTAURANT_IDS.CHINESE}`}
          />
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            number={1}
            title="Choose Your Restaurant"
            description="Browse through our wide selection of restaurants"
          />
          <StepCard
            number={2}
            title="Select Your Meal"
            description="Pick your favorite dishes from the menu"
          />
          <StepCard
            number={3}
            title="Enjoy Your Food"
            description="We'll deliver your order right to your door"
          />
        </div>
      </section>

      {/* Add the helper at the bottom of the page for developers */}
      {process.env.NODE_ENV === 'development' && <RestaurantIdHelper />}
    </div>
  );
}

function CategoryCard({ name, image, href }: { name: string; image: string; href: string }) {
  return (
    <Link href={href} className="relative h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-2xl font-bold text-white">{name}</h3>
      </div>
    </Link>
  );
}

function FeaturedRestaurantCard({
  name,
  description,
  image,
  href,
}: {
  name: string;
  description: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 