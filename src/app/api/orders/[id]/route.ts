import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const dynamic = 'force-static';

// For static export - generate example order IDs
export function generateStaticParams() {
  return [
    { id: 'example-order-1' },
    { id: 'example-order-2' },
    { id: 'example-order-3' },
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                description: true,
                price: true,
                image: true,
              },
            },
          },
        },
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to view this order" },
        { status: 403 }
      );
    }

    // If we're at PENDING status and the order was created more than 5 minutes ago,
    // automatically update to CONFIRMED
    const orderDate = new Date(order.createdAt);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    let updatedStatus = order.status;
    
    if (order.status === "PENDING" && orderDate < fiveMinutesAgo) {
      updatedStatus = "CONFIRMED";
    }

    // If we're at CONFIRMED status and the order was confirmed more than 10 minutes ago,
    // automatically update to PREPARING
    if (
      order.status === "CONFIRMED" &&
      orderDate < new Date(Date.now() - 10 * 60 * 1000)
    ) {
      updatedStatus = "PREPARING";
    }

    // If we're at PREPARING status and the order was preparing more than 10 minutes ago,
    // automatically update to READY_FOR_DELIVERY
    if (
      order.status === "PREPARING" &&
      orderDate < new Date(Date.now() - 20 * 60 * 1000)
    ) {
      updatedStatus = "READY_FOR_DELIVERY";
    }

    // If we're at READY_FOR_DELIVERY status and the order was ready more than 5 minutes ago,
    // automatically update to OUT_FOR_DELIVERY
    if (
      order.status === "READY_FOR_DELIVERY" &&
      orderDate < new Date(Date.now() - 25 * 60 * 1000)
    ) {
      updatedStatus = "OUT_FOR_DELIVERY";
    }

    // If we're at OUT_FOR_DELIVERY status and the order was out for delivery more than 15 minutes ago,
    // automatically update to DELIVERED
    if (
      order.status === "OUT_FOR_DELIVERY" &&
      orderDate < new Date(Date.now() - 40 * 60 * 1000)
    ) {
      updatedStatus = "DELIVERED";
    }

    // If the status changed, update the database
    if (updatedStatus !== order.status) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: updatedStatus }
      });
    }

    // Include the updated status if it changed
    const responseOrder = {
      ...order,
      status: updatedStatus,
    };

    return NextResponse.json(responseOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this order" },
        { status: 403 }
      );
    }

    // Delete order items first (handle foreign key constraints)
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    // Delete the order
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
} 