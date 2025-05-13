import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1 as result`;
    
    // Get all restaurants with their IDs
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            menuItems: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      restaurants
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
} 