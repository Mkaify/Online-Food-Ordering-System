import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Test connection first
    try {
      await prisma.$queryRaw`SELECT 1 as result`;
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection error", details: String(dbError) },
        { status: 500 }
      );
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          category ? { menuItems: { some: { category } } } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      include: {
        menuItems: true,
        reviews: true,
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants", details: String(error) },
      { status: 500 }
    );
  }
} 