"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1200px] w-full mix-blend-multiply">
      
      {/* SECTION HEADER */}
      <header className="border-b border-[#2D211D]/10 pb-10">
        <span className="text-[9px] font-semibold uppercase tracking-[0.5em] text-[#A17F72]">
          Personal Concierge
        </span>
        <h1 className="mt-5 font-[family:var(--font-cormorant)] text-[68px] md:text-[88px] font-light leading-[0.95] tracking-[-0.02em] text-[#2D211D]">
          Welcome Back, <br />
          <span className="italic font-normal text-[#6B3037]">{user?.name || "Guest"}</span>
        </h1>
        <p className="mt-6 text-[14px] text-[#8E7468] max-w-[540px] font-light leading-relaxed tracking-wide">
          Manage your bespoke beauty collection, active shipments, curated wishlist, and tailored account configurations seamlessly.
        </p>
      </header>

      {/* CURATED HUB GRID */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-16">
        
        {/* WISHLIST HUB */}
        <div className="group flex flex-col justify-between border-t border-[#2D211D]/15 pt-8 relative">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#A17F72]">
                Collection
              </span>
              <span className="text-[10px] font-mono text-[#2D211D]/30">01</span>
            </div>
            <h3 className="mt-4 text-3xl font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] group-hover:text-[#6B3037] transition-colors duration-300">
              Wishlist
            </h3>
            <p className="mt-3 text-[13px] font-light text-[#8E7468] leading-relaxed">
              Review and adjust your saved seasonal items and formulas.
            </p>
          </div>
          <Link 
            href="/dashboard/wishlist" 
            className="mt-8 inline-flex items-center text-[10px] uppercase tracking-[0.25em] font-medium text-[#6B3037] border-b border-transparent hover:border-[#6B3037] w-fit pb-1 transition-all duration-300"
          >
            Explore saved →
          </Link>
        </div>

        {/* ORDERS HUB */}
        <div className="group flex flex-col justify-between border-t border-[#2D211D]/15 pt-8 relative">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#A17F72]">
                History
              </span>
              <span className="text-[10px] font-mono text-[#2D211D]/30">02</span>
            </div>
            <h3 className="mt-4 text-3xl font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] group-hover:text-[#6B3037] transition-colors duration-300">
              Orders
            </h3>
            <p className="mt-3 text-[13px] font-light text-[#8E7468] leading-relaxed">
              Track processing fulfillment and review past item acquisitions.
            </p>
          </div>
          <Link 
            href="/dashboard/orders" 
            className="mt-8 inline-flex items-center text-[10px] uppercase tracking-[0.25em] font-medium text-[#6B3037] border-b border-transparent hover:border-[#6B3037] w-fit pb-1 transition-all duration-300"
          >
            Track shipments →
          </Link>
        </div>

        {/* PROFILE HUB */}
        <div className="group flex flex-col justify-between border-t border-[#2D211D]/15 pt-8 relative">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#A17F72]">
                Identity
              </span>
              <span className="text-[10px] font-mono text-[#2D211D]/30">03</span>
            </div>
            <h3 className="mt-4 text-3xl font-[family:var(--font-cormorant)] tracking-wide text-[#2D211D] group-hover:text-[#6B3037] transition-colors duration-300">
              Profile
            </h3>
            <p className="mt-3 text-[13px] font-light text-[#8E7468] leading-relaxed">
              Update authentication profiles, addresses, and parameters.
            </p>
          </div>
          <Link 
            href="/dashboard/profile" 
            className="mt-8 inline-flex items-center text-[10px] uppercase tracking-[0.25em] font-medium text-[#6B3037] border-b border-transparent hover:border-[#6B3037] w-fit pb-1 transition-all duration-300"
          >
            Modify settings →
          </Link>
        </div>

      </div>

      {/* RICH LUXURY RECENT ACTIVITY PANEL */}
      <div className="mt-24 border-t border-[#2D211D]/15 pt-12 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8">
        <div className="flex items-start gap-6">
          {/* Circular Luxury Badge inspired by the mini circle icon styling in the Cart */}
          <div className="w-12 h-12 rounded-full bg-white/60 border border-[#2D211D]/10 flex items-center justify-center shrink-0 shadow-xs">
            <span className="text-xs font-serif text-[#6B3037] italic">ø</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#A17F72] block mb-2">
              Journal / Recent Activity
            </span>
            <h2 className="text-3xl font-light font-[family:var(--font-cormorant)] text-[#2D211D]">
              Your activity stream is currently <span className="italic">pristine</span>.
            </h2>
          </div>
        </div>
        
        {/* Premium CTA Button styled directly after the continuous shopping accent container */}
        <Link 
          href="/shop"
          className="px-8 py-4 bg-[#6B3037] hover:bg-[#5A262C] text-white font-medium text-[10px] uppercase tracking-[0.25em] rounded-full transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:-translate-y-[1px]"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}