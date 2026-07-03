"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Menu = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const adminMenuItems = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Products", href: "/admin" },
    { title: "Orders", href: "/admin/orders" },
    { title: "Settings", href: "/admin/settings" },
  ];

  const customerMenuItems = [
    { title: "Shop", href: "/shop" },
    { title: "Wishlist", href: "/wishlist" },
    { title: "Account", href: "/account" },
    { title: "Orders", href: "/account/orders" },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const originalOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-start">
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#2D211D]/30 backdrop-blur-[14px]"
      />

      {/* PANEL (Completely locked - No X or Y axis scrolling allowed) */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 120,
        }}
        className="relative h-full w-full md:w-[58%] lg:w-[46%] bg-[#F8F1EB] text-[#2D211D] overflow-hidden flex flex-col"
      >
        {/* GLOW BLOBS */}
        <div className="absolute top-[-10%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[#E8C9B8]/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[380px] w-[380px] rounded-full bg-[#7A2E3A]/[0.06] blur-[120px] pointer-events-none" />

        {/* CONTENT BOUNDARY CONTAINER */}
        <div className="relative z-10 flex flex-col h-full px-8 md:px-14 pt-10 pb-12 overflow-hidden">
          
          {/* TOP HEADER */}
          <div className="flex items-center justify-between shrink-0 mb-6 md:mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.42em] text-[#A17F72]">
                ALQORA
              </span>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-[#E5D5CB] bg-white/55 px-6 h-[48px] backdrop-blur-xl transition-all duration-700 hover:scale-[1.03] hover:border-[#7A2E3A]/20 hover:bg-[#7A2E3A] hover:shadow-[0_10px_40px_rgba(122,46,58,0.12)] shrink-0"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.28),transparent)]" />
              <span className="relative z-10 text-[10px] uppercase tracking-[0.34em] text-[#7A5E54] transition-all duration-500 group-hover:text-white">
                Close
              </span>
              <div className="relative z-10 transition-all duration-500 group-hover:rotate-90 group-hover:scale-110 group-hover:text-white">
                <X size={16} />
              </div>
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-3 md:gap-5 my-auto py-2 overflow-hidden">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-end justify-between border-b border-[#E7D8CF] pb-2 md:pb-3 gap-4"
                >
                  <span className="font-[family:var(--font-cormorant)] text-[32px] sm:text-[38px] md:text-[46px] lg:text-[52px] leading-[0.95] tracking-[-0.04em] uppercase text-[#2D211D] transition-all duration-500 group-hover:translate-x-2 group-hover:text-[#7A2E3A] pr-4 block truncate select-none">
                    {item.title}
                  </span>
                  
                  <span className="mb-1 text-[10px] uppercase tracking-[0.35em] text-[#A17F72] shrink-0 font-medium">
                    0{i + 1}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* FOOTER ACTIONS */}
          <div className="mt-auto pt-6 shrink-0">
            {isAdmin ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
                    Administrator
                  </p>
                  <h3 className="mt-1 text-xl font-[family:var(--font-cormorant)] text-[#2D211D]">
                    {user?.name || "ALQORA Admin"}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full h-[50px] rounded-full bg-[#7A2E3A] text-white text-[10px] uppercase tracking-[0.35em] font-medium transition-all duration-500 hover:bg-[#2D211D] shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between border-t border-[#E7D8CF]/60 pt-4">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
                  Editorial Beauty Experience
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
                  Since 2025
                </span>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>,
    document.body
  );
};