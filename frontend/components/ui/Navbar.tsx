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
  SlidersHorizontal,
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
  const isShopActive =
    pathname === "/shop" || pathname?.startsWith("/shop/");
  const isAccountActive =
    pathname?.startsWith("/account") || pathname === "/login";
  const isAdminActive = pathname === "/admin";
  const isWishlistActive = pathname === "/wishlist";
  const isOrdersActive = pathname === "/admin/orders";
  const isDashboardActive = pathname === "/admin/dashboard";
  const isSettingsActive = pathname === "/admin/settings";
  const isAdminPage = pathname.startsWith("/admin");

  const textRevealStyle =
    "max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap select-none";

  const pillBase =
    "border border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] transition-all duration-500 hover:scale-[1.03] hover:border-[#2D211D]/30";

  const pillActive =
    "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]";

  return (
    <>
      {/* =========================================================
          MOBILE NAVBAR
      ========================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-[9997] md:hidden px-4 pt-4">
        <div className="h-14 rounded-full border border-[#2D211D]/10 bg-white/75 backdrop-blur-xl shadow-sm px-3 grid grid-cols-[40px_1fr_40px] items-center">
          {/* LEFT - MENU */}
          <div className="flex justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="h-10 w-10 rounded-full flex items-center justify-center text-[#2D211D] hover:bg-[#2D211D]/5 transition"
              aria-label="Open menu"
            >
              <div className="relative flex flex-col justify-center gap-[4px] w-[16px]">
                <span className="block h-[1.2px] w-full bg-[#2D211D]" />
                <span className="block h-[1.2px] w-3/4 bg-[#2D211D]" />
              </div>
            </button>
          </div>

          {/* CENTER - LOGO */}
          <div className="flex justify-center">
            <Link href="/" className="block">
              <div
                className={`relative ${
                  isAdminPage ? "h-7 w-24" : "h-8 w-28"
                }`}
              >
                <Image
                  src="/logo.png"
                  alt="Alqora"
                  fill
                  priority
                  sizes="112px"
                  className="object-contain brightness-0"
                />
              </div>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex justify-end">
            {!isAdmin ? (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative h-10 w-10 rounded-full flex items-center justify-center text-[#2D211D] hover:bg-[#2D211D]/5 transition"
                aria-label="Open cart"
              >
                <ShoppingBag size={16} strokeWidth={1.7} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 h-4 min-w-4 rounded-full bg-[#2D211D] text-white text-[8px] font-semibold flex items-center justify-center px-1 leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            ) : (
              <Link
                href="/admin/dashboard"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                  isDashboardActive
                    ? "text-[#7A2E3A] bg-[#7A2E3A]/[0.08]"
                    : "text-[#2D211D] hover:bg-[#2D211D]/5"
                }`}
                aria-label="Dashboard"
              >
                <User size={16} strokeWidth={1.7} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* =========================================================
          DESKTOP / TABLET NAVBAR
      ========================================================= */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-[9997] px-6 lg:px-16 py-6 items-center justify-between pointer-events-none select-none">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`group h-12 w-12 rounded-full flex items-center justify-center ${pillBase}`}
            aria-label="Open menu"
          >
            <div className="relative flex flex-col justify-center gap-[4px] w-[16px]">
              <span className="block h-[1.2px] w-full bg-[#2D211D]" />
              <span className="block h-[1.2px] w-3/4 bg-[#2D211D] transition-all duration-500 group-hover:w-full" />
            </div>
          </button>

          {!isAdmin && (
            <Link
              href="/shop"
              className={`group h-12 px-4 rounded-full flex items-center justify-center ${
                isShopActive ? pillActive : pillBase
              }`}
            >
              <Compass size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <span className={textRevealStyle}>Shop</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className={`group h-12 px-4 rounded-full flex items-center justify-center ${
                isAdminActive ? pillActive : pillBase
              }`}
            >
              <Layers size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <span className={textRevealStyle}>Admin</span>
            </Link>
          )}
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-10">
          <Link href="/" className="block relative group">
            <div
              className={`relative transition-all duration-700 ${
                isAdminPage ? "h-12 w-36" : "h-16 w-64"
              }`}
            >
              <Image
                src="/logo.png"
                alt="Alqora"
                fill
                priority
                sizes={isAdminPage ? "144px" : "256px"}
                className="object-contain brightness-0 transition-all duration-500 hover:scale-[1.02]"
              />
            </div>
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {isAdmin && (
            <Link
              href="/admin/orders"
              className={`group h-12 px-4 rounded-full flex items-center justify-center ${
                isOrdersActive ? pillActive : pillBase
              }`}
            >
              <ShoppingBag
                size={14}
                strokeWidth={1.5}
                className="flex-shrink-0"
              />
              <span className={textRevealStyle}>Orders</span>
            </Link>
          )}

          {/* Dashboard / Profile */}
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              className={`group h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${
                isDashboardActive
                  ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
                  : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
              }`}
            >
              <User size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <span className={textRevealStyle}>Dashboard</span>
            </Link>
          ) : (
            <Link
              href={user ? "/account" : "/login"}
              className={`group h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${
                isAccountActive
                  ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
                  : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
              }`}
            >
              <User size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <span className={textRevealStyle}>
                {user ? user.name.split(" ")[0] : "Profile"}
              </span>
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin/settings"
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                isSettingsActive ? pillActive : pillBase
              }`}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
            </Link>
          )}

          {!isAdmin && (
            <>
              {wishlistEnabled && (
                <Link
                  href="/wishlist"
                  className={`group relative h-12 px-4 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-105 ${
                    isWishlistActive
                      ? "border-[#7A2E3A]/30 bg-[#7A2E3A]/[0.04] text-[#7A2E3A]"
                      : "border-[#2D211D]/10 bg-white/70 backdrop-blur-xl text-[#2D211D] hover:border-[#2D211D]/30"
                  }`}
                >
                  <Heart size={14} strokeWidth={1.5} />
                  <span className={textRevealStyle}>Wishlist</span>

                  {user && isWishlistReady && totalWishlistItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full bg-[#7A2E3A] text-white text-[8px] font-semibold flex items-center justify-center px-1 z-10 shadow-sm">
                      {totalWishlistItems}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative h-12 w-12 rounded-full flex items-center justify-center ${pillBase}`}
                aria-label="Open cart"
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