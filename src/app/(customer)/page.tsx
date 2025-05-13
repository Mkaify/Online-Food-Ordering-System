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
            <a 
              href="/restaurants"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Browse Restaurants
            </a>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity bg-gray-200">
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Italian</h3>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity bg-gray-200">
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Indian</h3>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity bg-gray-200">
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Chinese</h3>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity bg-gray-200">
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Mexican</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Restaurants</h2>
          <a
            href="/restaurants"
            className="text-blue-600 flex items-center hover:text-blue-800 transition-colors"
          >
            <span className="mr-1">View All</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Italian Delight</h3>
              <p className="text-gray-600">Authentic Italian cuisine</p>
            </div>
          </div>
          <div className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Spicy Indian</h3>
              <p className="text-gray-600">Best Indian food in town</p>
            </div>
          </div>
          <div className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Dragon Wok</h3>
              <p className="text-gray-600">Authentic Chinese cuisine</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Restaurant</h3>
            <p className="text-gray-600">Browse through our wide selection of restaurants</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Your Meal</h3>
            <p className="text-gray-600">Pick your favorite dishes from the menu</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Enjoy Your Food</h3>
            <p className="text-gray-600">We&apos;ll deliver your order right to your door</p>
          </div>
        </div>
      </section>
    </div>
  );
} 