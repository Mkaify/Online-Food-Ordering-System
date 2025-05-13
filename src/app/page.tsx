export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Our Food Ordering App</h1>
        <p className="mb-4">Browse our restaurants and place your order</p>
        <div className="mt-6">
          <a
            href="/restaurants"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Restaurants
          </a>
        </div>
      </div>
    </div>
  );
} 