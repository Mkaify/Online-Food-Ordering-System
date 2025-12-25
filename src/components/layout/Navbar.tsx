"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { items, isHydrated } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show cart count after hydration to prevent mismatch
  const showCartCount = mounted && isHydrated && items.length > 0;
  // Only show session-dependent UI after mounted
  const showSessionUI = mounted && status !== 'loading';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            FoodOrder
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/restaurants"
              className="text-gray-600 hover:text-indigo-600"
            >
              Restaurants
            </Link>

            <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600">
              <ShoppingCart className="w-6 h-6" />
              {showCartCount && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {showSessionUI && (
              session ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    <User className="w-6 h-6" />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 