"use client";

import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import SessionProviderClient from "@/components/common/SessionProviderClient";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderClient>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  {children}
                </main>
              </div>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SessionProviderClient>
  );
}
