"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RestaurantInfo {
  id: string;
  name: string;
  _count: {
    menuItems: number;
  };
}

interface TestResult {
  status: number | string;
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export default function DebugPage() {
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  // Fetch restaurants for debugging
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/debug');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch debug data');
        }
        
        setRestaurants(data.restaurants);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);

  // Test specific restaurant IDs
  const testRestaurant = async (id: string) => {
    try {
      const response = await fetch(`/api/restaurants/${id}`);
      const status = response.status;
      
      let data;
      try {
        data = await response.json();
      } catch {
        // Ignore parsing error and set default error message
        data = { error: 'Failed to parse response' };
      }
      
      setTestResults(prev => ({
        ...prev,
        [id]: { status, success: response.ok, data }
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [id]: { status: 'error', success: false, error: String(err) }
      }));
    }
  };

  if (loading) {
    return <div className="p-8">Loading debug information...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Restaurant Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Available Restaurants</h2>
        <ul className="space-y-2">
          {restaurants.map(restaurant => (
            <li key={restaurant.id} className="border p-4 rounded">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-sm text-gray-500">ID: {restaurant.id}</p>
                  <p className="text-sm text-gray-500">Menu Items: {restaurant._count.menuItems}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => testRestaurant(restaurant.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Test API
                  </button>
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 inline-block"
                  >
                    View Page
                  </Link>
                </div>
              </div>
              
              {testResults[restaurant.id] && (
                <div className="mt-2 p-3 bg-gray-100 rounded">
                  <p>Status: {testResults[restaurant.id].status}</p>
                  <p>Success: {testResults[restaurant.id].success ? 'Yes' : 'No'}</p>
                  <details>
                    <summary className="cursor-pointer">Response Data</summary>
                    <pre className="overflow-auto max-h-40 p-2 bg-gray-800 text-white text-xs mt-2 rounded">
                      {JSON.stringify(testResults[restaurant.id].data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Numerical IDs</h2>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              onClick={() => testRestaurant(String(id))}
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              Test ID: {id}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
} 