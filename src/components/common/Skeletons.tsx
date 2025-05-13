import React from 'react';

export const RestaurantCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="relative h-40 w-full rounded-lg overflow-hidden animate-pulse">
    <div className="absolute inset-0 bg-gray-200" />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="h-6 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
);

export const MenuItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm animate-pulse">
    <div className="h-20 w-20 bg-gray-200 rounded" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

export const CartItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-16 w-16 bg-gray-200 rounded" />
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-24" />
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
); 