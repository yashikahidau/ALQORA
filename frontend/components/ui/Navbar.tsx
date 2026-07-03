"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnimatePresence } from "framer-motion";
import { Menu } from "./Menu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import {
  User,
  Compass,
  Layers,
  Heart,
  ShoppingBag,
  SlidersHorizontal
} from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlistItems, isWishlistReady } = useWishlist();
  const { wishlistEnabled } = useStoreSettings();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isShopActive = pathname === "/shop" || pathname?.startsWith("/shop/");
  const isAccountActive = pathname?.startsWith("/account") || pathname === "/login";
  const isAdminActive = pathname === "/admin";
  const isWishlistActive = pathname === "/wishlist"
  const isOrdersActive = pathname === "/admin/orders";
  const isDashboardActive = pathname === "/admin/dashboard";
  const isSettingsActive = pathname === "/admin/settings";
  const isAdminPage = pathname.startsWith("/admin");

  // Reusable dynamic expansion text container styling to prevent duplicate lines
  const textRevealStyle = "max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap select-none";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9997] px-4 md:px-8 lg:px-16 py-4 md:py-6 flex items-center justify-between pointer-events-none select-none">

        {/* ================= LEFT SECTION ================= */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group h-12 w-12 rounded-full border border-[#2D211D]/10 bg-white/70 backdrop-blur-xl flex items-center justify-center transition-all duration-500 hover:scale-105 hover:border-[#2D211D]/30"
          >
            <div className="relative flex flex-col justify-center gap-[4px] w-[16px]">
              <span className="block h-[1.2px] w-full bg-[#2D211D]" />
              <span className="block h-[1.2px] w-3/4 bg-[#2D211D] transition-all duration-500 group-hover:w-full" />
            </div>
          </button>

          {/* Shop Button */}
          <Link
            href="/shop"
            className={`group h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${isShopActive
              ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
              : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
              }`}
          >
            <Compass size={14} strokeWidth={1.5} className="flex-shrink-0" />
            <span className={textRevealStyle}>Shop</span>
          </Link>

          {/* Admin Management Button */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`group h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${isAdminActive
                ? "border-[#7A2E3A]/40 bg-[#7A2E3A]/[0.06] text-[#7A2E3A]"
                : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
                }`}
            >
              <Layers size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <span className={textRevealStyle}>Admin</span>
            </Link>
          )}
        </div>

        {/* ================= CENTER BRAND LOGO ================= */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-10">
          <Link href="/" className="block relative group">
            <div
              className={`relative transition-all duration-700 ${isAdminPage
                ? "h-9 w-28 md:h-12 md:w-36"
                : "h-12 w-44 md:h-16 md:w-64"
                }`}
            >
              <Image
                src="/logo.png"
                alt="Alqora"
                fill
                sizes={isAdminPage ? "144px" : "256px"}
                priority
                className="object-contain brightness-0 transition-all duration-500 hover:scale-[1.02]"
              />
            </div>
          </Link>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Orders Button */}
          {isAdmin && (
            <Link
              href="/admin/orders"
              className={`group h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${isOrdersActive
                ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
                : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
                }`}
            >
              <ShoppingBag size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <span className={textRevealStyle}>Orders</span>
            </Link>
          )}

          {/* Dashboard / Profile Button */}
          <Link
            href={!user ? "/login" : isAdmin ? "/admin/dashboard" : "/account"}
            className={`group h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${(isAdmin && isDashboardActive) || (!isAdmin && isAccountActive)
              ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
              : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
              }`}
          >
            <User size={14} strokeWidth={1.5} className="flex-shrink-0" />
            <span className={textRevealStyle}>
              {isAdmin ? "Dashboard" : user ? user.name.split(" ")[0] : "Profile"}
            </span>
          </Link>

          {/* Settings Button */}
          {isAdmin && (
            <Link
              href="/admin/settings"
              className={`h-12 w-12 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${isSettingsActive
                ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
                : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
                }`}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
            </Link>
          )}

          {/* Standard User Actions (Wishlist & Cart) */}
          {!isAdmin && (
            <>
              {wishlistEnabled && (
                <Link
                  href="/wishlist"
                  className={`group relative h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${isWishlistActive
                      ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
                      : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
                    }`}
                >
                  <Heart size={14} strokeWidth={1.5} />
                  <span className={textRevealStyle}>Wishlist</span>

                  {isWishlistReady && totalWishlistItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full bg-[#7A2E3A] text-white text-[8px] font-semibold flex items-center justify-center px-1 z-10 shadow-sm">
                      {totalWishlistItems}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="h-12 w-12 rounded-full border border-[#2D211D]/10 bg-white/70 backdrop-blur-xl flex items-center justify-center relative transition-all duration-500 hover:scale-105 hover:border-[#2D211D]/30 text-[#2D211D]"
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-[#2D211D] text-white text-[8px] font-bold flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>

      {!isAdmin && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
};