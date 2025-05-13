import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to create an order" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    const { restaurantId, items, total } = await request.json();

    if (!restaurantId || !items || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order in the database
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: OrderItem) => ({
            quantity: item.quantity,
            price: item.price,
            menuItemId: item.menuItemId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 