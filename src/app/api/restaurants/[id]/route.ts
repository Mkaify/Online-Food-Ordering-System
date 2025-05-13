import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_API_ENABLED, getMockRestaurants } from "@/lib/mock-adapter";

// Define valid restaurant IDs for better error messages
const validRestaurantIds = [
  'italian-delight',
  'spicy-indian',
  'dragon-wok',
  'mexican-fiesta',
  'test-restaurant-1'
];

// Change to static for static export
export const dynamic = 'force-static';

// Required for static export - pre-generate the valid restaurant IDs paths
export function generateStaticParams() {
  return validRestaurantIds.map(id => ({
    id,
  }));
}

// Next.js App Router workaround for the Sync Dynamic API error
export async function GET(
  request: NextRequest
  // We don't use context.params to avoid the Next.js dynamic API error
) {
  // For static export, use mock data
  if (MOCK_API_ENABLED) {
    // Parse the ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Get ID from URL path
    
    // Find the restaurant with the matching ID from mock data
    const restaurants = getMockRestaurants();
    const restaurant = restaurants.find(r => r.id === id);
    
    if (!restaurant) {
      return NextResponse.json({
        error: "Restaurant not found", 
        message: "Try one of these IDs instead",
        validIds: validRestaurantIds
      }, { status: 404 });
    }
    
    return NextResponse.json(restaurant);
  }
  
  // Parse the ID from the URL directly as a workaround
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1]; // Get ID from URL path
  
  try {
    console.log("API: Fetching restaurant with ID:", id);

    // Check if ID is numeric and suggest valid IDs
    if (!isNaN(Number(id))) {
      console.log("Numeric ID detected, suggesting named IDs instead");
      return NextResponse.json({
        error: "Restaurant not found - use named IDs instead of numbers",
        validIds: validRestaurantIds
      }, { status: 404 });
    }

    // Get restaurant from database
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true,
        reviews: true,
      },
    });

    if (!restaurant) {
      console.log("Restaurant not found for ID:", id);
      return NextResponse.json({
        error: "Restaurant not found", 
        message: "Try one of these IDs instead",
        validIds: validRestaurantIds
      }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json({
      error: "Failed to fetch restaurant", 
      details: String(error),
      validIds: validRestaurantIds
    }, { status: 500 });
  }
} 