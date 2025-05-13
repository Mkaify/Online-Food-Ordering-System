import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request
  // We don't use context.params to avoid the Next.js dynamic API error
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to view orders" },
        { status: 401 }
      );
    }

    // Extract ID from URL to avoid 'sync dynamic APIs' error
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    const userId = session.user.id;

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
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
                image: true,
              },
            },
          },
        },
      },
    });

    // Check if order exists and belongs to the current user
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to view this order" },
        { status: 403 }
      );
    }

    // Calculate automatic order progression based on time
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = Date.now();
    const orderAgeMinutes = (currentTime - orderTime) / (1000 * 60);
    
    // Define status progression and time thresholds (30 min total, divided into stages)
    const statuses = ["PENDING", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED"];
    const stageMinutes = 30 / statuses.length; // Each stage lasts 6 minutes
    
    let updatedStatus = order.status;
    
    // Determine the current status based on elapsed time
    if (orderAgeMinutes <= stageMinutes) {
      updatedStatus = "PENDING";
    } else if (orderAgeMinutes <= stageMinutes * 2) {
      updatedStatus = "PREPARING";
    } else if (orderAgeMinutes <= stageMinutes * 3) {
      updatedStatus = "READY_FOR_DELIVERY";
    } else if (orderAgeMinutes <= stageMinutes * 4) {
      updatedStatus = "OUT_FOR_DELIVERY";
    } else {
      updatedStatus = "DELIVERED";
    }
    
    // Update the order status if it's changed
    if (updatedStatus !== order.status) {
      await prisma.order.update({
        where: { id },
        data: { status: updatedStatus }
      });
      
      order.status = updatedStatus;
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
  // We don't use context.params to avoid the Next.js dynamic API error
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete orders" },
        { status: 401 }
      );
    }

    // Extract ID from URL to avoid 'sync dynamic APIs' error
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    const userId = session.user.id;

    // First check if the order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this order" },
        { status: 403 }
      );
    }

    // Delete order items first
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });

    // Then delete the order
    await prisma.order.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
} 