import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Simple query to check if the database is connected
    const dbResult = await prisma.$queryRaw`SELECT 1 as result`;
    
    return NextResponse.json({ 
      status: "Database connection successful", 
      result: dbResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      status: "Database connection failed", 
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 