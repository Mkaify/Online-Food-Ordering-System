import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to view your orders" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to clear your order history" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all order IDs for this user
    const userOrders = await prisma.order.findMany({
      where: { userId },
      select: { id: true }
    });

    const orderIds = userOrders.map((order: { id: string }) => order.id);

    // Delete all order items for these orders first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: orderIds
        }
      }
    });

    // Then delete all orders
    await prisma.order.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${orderIds.length} orders` 
    });
  } catch (error) {
    console.error("Error clearing order history:", error);
    return NextResponse.json(
      { error: "Failed to clear order history" },
      { status: 500 }
    );
  }
} 