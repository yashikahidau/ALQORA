"use client";

import { useState, useEffect } from "react";
import { Sparkles, LogOut, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/lib/orderApi";
import { useWishlist } from "@/context/WishlistContext";

// --- High-End Editorial Motion Profiles ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { totalWishlistItems } = useWishlist();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await getMyOrders();

        if (response?.success) {
          setOrders(response.data || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to load account orders:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8F1EB] text-[#2D211D] font-sans relative overflow-hidden antialiased selection:bg-[#7A2E3A]/10 selection:text-[#7A2E3A] px-6 sm:px-12 lg:px-16">

      {/* EDITORIAL GRID LINES */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none opacity-[0.04] flex justify-between px-16">
        <div className="w-[1px] h-full bg-[#2D211D]" />
        <div className="w-[1px] h-full bg-[#2D211D] hidden md:block" />
        <div className="w-[1px] h-full bg-[#2D211D] hidden lg:block" />
        <div className="w-[1px] h-full bg-[#2D211D]" />
      </div>

      {/* LUXURY AMBIENT UNDERLAYS */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#7A2E3A]/[0.04] blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#A17F72]/[0.05] blur-[150px] pointer-events-none" />

      <motion.div
        className="max-w-7xl mx-auto pt-44 pb-32 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ================================================= */}
        {/* HERO HEADER SECTION                              */}
        {/* ================================================= */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-center border-b border-[#2D211D]/15 pb-16 mb-20"
          variants={fadeUpVariants}
        >
          <div className="space-y-4">
            <span className="text-[11px] tracking-[0.4em] font-bold text-[#7A2E3A] uppercase block">
              ALQORA PRIVATE ATELIER
            </span>
            <h1 className="text-[40px] sm:text-[60px] font-light tracking-tight text-[#2D211D] leading-[1.1] font-serif font-[family:var(--font-cormorant)]">
              Welcome Back,<br />
              <span className="italic font-serif font-light text-[#7A2E3A] block mt-1">
                {user?.name || "Guest"}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#4E3A33] font-normal max-w-lg tracking-wide leading-relaxed">
              Review your bespoke beauty rituals, track premium orders, manage your tailored shade profile, and access your curated selections.
            </p>
          </div>

          {/* Premium Membership Identity Plate */}
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7A2E3A]/10 via-transparent to-[#A17F72]/15 rounded-[24px] blur-xl opacity-80 transition-all duration-700 group-hover:opacity-100" />
            <div className="relative bg-white rounded-[24px] p-8 border border-[#2D211D]/15 shadow-[0_20px_50px_rgba(45,33,29,0.04)] overflow-hidden">
              <div className="absolute right-[-15px] bottom-[-35px] text-[140px] font-serif font-[family:var(--font-cormorant)] font-bold opacity-[0.03] text-[#2D211D] select-none pointer-events-none">
                A
              </div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#4E3A33]">Member Since</p>
                  <p className="text-xl font-semibold font-serif font-[family:var(--font-cormorant)] text-[#2D211D] mt-1">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                      : new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    }
                  </p>
                </div>
                <div className="h-11 w-11 rounded-full bg-[#F8F1EB] border border-[#7A2E3A]/20 flex items-center justify-center text-[#7A2E3A] shadow-sm">
                  <Sparkles size={16} className="stroke-[1.5]" />
                </div>
              </div>

              <div className="pt-5 border-t border-[#2D211D]/10">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#4E3A33]">Tiers Status</p>
                <p className="text-2xl font-medium font-serif font-[family:var(--font-cormorant)] tracking-[0.12em] text-[#7A2E3A] mt-1 uppercase">
                  {user?.badge || "Signature Member"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================= */}
        {/* EDITORIAL NAVIGATION GRID                         */}
        {/* ================================================= */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20"
          variants={containerVariants}
        >
          {/* Card 1: Wishlist */}
          <Link href="/wishlist" className="block group">
            <motion.div
              className="bg-white rounded-[24px] p-8 border border-[#2D211D]/12 shadow-[0_12px_40px_rgba(45,33,29,0.02)] h-[280px] flex flex-col justify-between transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(45,33,29,0.08)] hover:border-[#7A2E3A]/40 relative overflow-hidden"
              variants={fadeUpVariants}
            >
              <div className="absolute right-6 top-4 text-[64px] font-serif font-[family:var(--font-cormorant)] italic text-[#7A2E3A]/10 font-bold select-none transition-all duration-700 group-hover:text-[#7A2E3A]/15 group-hover:scale-105">01</div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A2E3A] block">
                  Vanity Selections
                </span>
                <h3 className="text-2xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] group-hover:text-[#7A2E3A] transition-colors duration-300">
                  Saved Favorites
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4E3A33] font-normal leading-relaxed max-w-[230px]">
                  Review and purchase items currently saved inside your wishlist layout.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A2E3A] pt-4 border-t border-[#2D211D]/10 w-full">
                <span>View Favorites</span>
                <ArrowRight size={12} className="stroke-[2] transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </motion.div>
          </Link>

          {/* Card 2: Orders */}
          <Link href="/account/orders" className="block group">
            <motion.div
              className="bg-white rounded-[24px] p-8 border border-[#2D211D]/12 shadow-[0_12px_40px_rgba(45,33,29,0.02)] h-[280px] flex flex-col justify-between transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(45,33,29,0.08)] hover:border-[#7A2E3A]/40 relative overflow-hidden"
              variants={fadeUpVariants}
            >
              <div className="absolute right-6 top-4 text-[64px] font-serif font-[family:var(--font-cormorant)] italic text-[#7A2E3A]/10 font-bold select-none transition-all duration-700 group-hover:text-[#7A2E3A]/15 group-hover:scale-105">02</div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A2E3A] block">
                  Procurement
                </span>
                <h3 className="text-2xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] group-hover:text-[#7A2E3A] transition-colors duration-300">
                  Order History
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4E3A33] font-normal leading-relaxed max-w-[230px]">
                  Track shipments, view detailed logs, and revisit your skincare or makeup purchases.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A2E3A] pt-4 border-t border-[#2D211D]/10 w-full">
                <span>Track Logistics</span>
                <ArrowRight size={12} className="stroke-[2] transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </motion.div>
          </Link>

          {/* Card 3: Return to Store */}
          <Link href="/shop" className="block group">
            <motion.div
              className="bg-white rounded-[24px] p-8 border border-[#2D211D]/12 shadow-[0_12px_40px_rgba(45,33,29,0.02)] h-[280px] flex flex-col justify-between transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(45,33,29,0.08)] hover:border-[#7A2E3A]/40 relative overflow-hidden"
              variants={fadeUpVariants}
            >
              <div className="absolute right-6 top-4 text-[64px] font-serif font-[family:var(--font-cormorant)] italic text-[#7A2E3A]/10 font-bold select-none transition-all duration-700 group-hover:text-[#7A2E3A]/15 group-hover:scale-105">03</div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A2E3A] block">
                  ALQORA Boutique
                </span>
                <h3 className="text-2xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] group-hover:text-[#7A2E3A] transition-colors duration-300">
                  Return to Store
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4E3A33] font-normal leading-relaxed max-w-[230px]">
                  Explore iconic essential foundations, new shade collections, and rich pigments.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A2E3A] pt-4 border-t border-[#2D211D]/10 w-full">
                <span>Explore Store</span>
                <ArrowRight size={12} className="stroke-[2] transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* ================================================= */}
        {/* DETAILS & PROFILE METRICS OVERVIEW                */}
        {/* ================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">

          {/* PROFILE DETAILS GRID */}
          <motion.div
            className="bg-white rounded-[24px] p-8 lg:p-10 border border-[#2D211D]/12 shadow-[0_12px_40px_rgba(45,33,29,0.02)] flex flex-col justify-between"
            variants={fadeUpVariants}
          >
            <div>
              <h2 className="text-2xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] mb-8 pb-3 border-b border-[#2D211D]/15">
                Account Credentials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4E3A33]">Full Name</p>
                  <p className="text-base font-semibold text-[#2D211D]">{user?.name || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4E3A33]">Email Address</p>
                  <p className="text-base font-semibold text-[#2D211D] break-all">{user?.email || "—"}</p>
                </div>
                <div className="sm:col-span-2 border-t border-[#2D211D]/10 pt-2" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4E3A33]">Registry Date</p>
                  <p className="text-base font-semibold text-[#2D211D]">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4E3A33]">Membership Rank</p>
                  <p className="text-base font-bold text-[#7A2E3A] font-serif font-[family:var(--font-cormorant)] tracking-wider uppercase">{user?.badge || "Member"}</p>
                </div>
                <div className="sm:col-span-2 border-t border-[#2D211D]/10 pt-2" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4E3A33]">Wishlist Items</p>
                  <p className="text-base font-semibold text-[#2D211D]">
                    {totalWishlistItems} {totalWishlistItems === 1 ? "Product" : "Products"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4E3A33]">Total Orders Placed</p>
                  <p className="text-base font-semibold text-[#2D211D]">{orders.length} Orders</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GRID STATISTICS TILES */}
          <motion.div
            className="bg-white rounded-[24px] p-8 lg:p-10 border border-[#2D211D]/12 shadow-[0_12px_40px_rgba(45,33,29,0.02)]"
            variants={fadeUpVariants}
          >
            <h2 className="text-2xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] mb-8 pb-3 border-b border-[#2D211D]/15">
              Account Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F8F1EB]/70 rounded-xl p-5 border border-[#2D211D]/10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#4E3A33] block mb-1">
                  Wishlist Size
                </span>
                <span className="text-3xl font-semibold font-serif font-[family:var(--font-cormorant)] text-[#7A2E3A]">
                  {totalWishlistItems}
                </span>
              </div>

              <div className="bg-[#F8F1EB]/70 rounded-xl p-5 border border-[#2D211D]/10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#4E3A33] block mb-1">
                  Total Orders
                </span>
                <span className="text-3xl font-semibold font-serif font-[family:var(--font-cormorant)] text-[#2D211D]">
                  {orders.length}
                </span>
              </div>

              <div className="bg-[#F8F1EB]/70 rounded-xl p-5 border border-[#2D211D]/10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#4E3A33] block mb-1">
                  Registry Period
                </span>
                <span className="text-base font-bold font-serif font-[family:var(--font-cormorant)] text-[#2D211D] mt-1">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "—"}
                </span>
              </div>

              <div className="bg-[#F8F1EB]/70 rounded-xl p-5 border border-[#2D211D]/10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#4E3A33] block mb-1">
                  Curation Rank
                </span>
                <span className="text-base font-serif tracking-wider text-[#7A2E3A] uppercase font-bold mt-1">
                  {user?.badge || "Member"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================================================= */}
        {/* RECENT REQUISITIONS / ORDERS TIMELINE             */}
        {/* ================================================= */}
        <motion.div
          className="bg-white rounded-[24px] p-8 lg:p-10 border border-[#2D211D]/12 shadow-[0_12px_40px_rgba(45,33,29,0.02)] mb-20"
          variants={fadeUpVariants}
        >
          <h2 className="text-2xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] mb-10 pb-3 border-b border-[#2D211D]/15">
            Recent Activity
          </h2>

          <div className="relative pt-2">
            <div className="absolute top-[32px] left-8 right-8 h-[1px] bg-[#2D211D]/15 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {ordersLoading ? (
                <div className="col-span-3 text-center py-10 text-[#4E3A33] text-sm font-medium tracking-wide">
                  Loading recent order activity...
                </div>
              ) : orders.length === 0 ? (
                <div className="col-span-3 text-center py-10 text-[#4E3A33] text-sm font-medium tracking-wide">
                  No orders found yet.
                </div>
              ) : (
                orders.slice(0, 3).map((order) => {
                  const status = order.status || "Pending";
                  const statusColors = {
                    Delivered: { badge: "text-emerald-950 bg-emerald-50 border-emerald-300 font-bold", dot: "bg-emerald-600", border: "border-emerald-600/40" },
                    Processing: { badge: "text-purple-950 bg-purple-50 border-purple-300 font-bold", dot: "bg-purple-600", border: "border-purple-600/40" },
                    Shipped: { badge: "text-blue-950 bg-blue-50 border-blue-300 font-bold", dot: "bg-blue-600", border: "border-blue-600/40" },
                    Pending: { badge: "text-amber-950 bg-amber-50 border-amber-300 font-bold", dot: "bg-amber-600", border: "border-amber-600/40" },
                    Cancelled: { badge: "text-rose-950 bg-rose-50 border-rose-300 font-bold", dot: "bg-rose-600", border: "border-rose-600/40" },
                  };

                  const colors = statusColors[status as keyof typeof statusColors] || statusColors.Pending;

                  return (
                    <div key={order._id} className="flex md:flex-col items-start gap-4 md:gap-0 group">
                      <div className={`w-12 h-12 rounded-full bg-white border-2 ${colors.border} flex items-center justify-center md:mb-5 shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-105`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                      </div>

                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${colors.badge}`}>
                            {status}
                          </span>
                          <span className="text-xs font-bold text-[#4E3A33]">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>

                        <h4 className="text-lg font-semibold text-[#2D211D] font-serif font-[family:var(--font-cormorant)] tracking-wide">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h4>

                        <p className="text-sm font-bold text-[#7A2E3A] tracking-wide">
                          ₹{Number(order.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-[#2D211D]/10 flex justify-end">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#7A2E3A] hover:text-[#2D211D] transition-colors duration-300 group"
            >
              <span>View Full Order Ledger</span>
              <ArrowRight size={12} className="stroke-[2] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================= */}
        {/* DE-AUTHENTICATION / SIGN OUT EXIT                 */}
        {/* ================================================= */}
        <motion.div
          className="relative rounded-[24px] p-8 lg:p-10 bg-white border border-[#7A2E3A]/30 shadow-[0_12px_40px_rgba(122,46,58,0.02)] overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          variants={fadeUpVariants}
        >
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#7A2E3A]/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <h3 className="text-xl font-normal font-serif font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D]">
              Terminate Session
            </h3>
            <p className="text-xs sm:text-sm text-[#4E3A33] font-normal tracking-wide">
              Securely lock your dashboard profile. You can authenticate again at any time.
            </p>
          </div>

          <button
            onClick={logout}
            className="group inline-flex items-center justify-center gap-3 bg-[#7A2E3A] hover:bg-[#2D211D] text-white px-10 py-4 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-500 shadow-sm shrink-0 relative z-10"
          >
            <span>Sign Out Profile</span>
            <LogOut size={12} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}