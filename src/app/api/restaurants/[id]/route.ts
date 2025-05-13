import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define valid restaurant IDs for better error messages
const validRestaurantIds = [
  'italian-delight',
  'spicy-indian',
  'dragon-wok',
  'mexican-fiesta',
  'test-restaurant-1'
];

// Use segment config to tell Next.js that this route is dynamic
export const dynamic = 'force-dynamic';

// Next.js App Router workaround for the Sync Dynamic API error
export async function GET(
  request: NextRequest
  // We don't use context.params to avoid the Next.js dynamic API error
) {
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