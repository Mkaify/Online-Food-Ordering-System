import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import SessionProviderClient from "@/components/common/SessionProviderClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Ordering System",
  description: "Order your favorite food online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-arp="">
      <body className={inter.className}>
        <SessionProviderClient>
          <ErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <OrderProvider>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">{children}</main>
                  </div>
                </OrderProvider>
              </CartProvider>
            </AuthProvider>
          </ErrorBoundary>
        </SessionProviderClient>
      </body>
    </html>
  );
} 