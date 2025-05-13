"use client";

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(() => import("@/contexts/AuthContext").then(mod => mod.AuthProvider), { ssr: false });
const CartProvider = dynamic(() => import("@/contexts/CartContext").then(mod => mod.CartProvider), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 