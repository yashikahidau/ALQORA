"use client";
import Link from "next/link";

const ORDERS_MOCK = [
  {
    id: "AQ-90821",
    status: "DISPATCHED",
    statusColor: "#6B3037", // Elegant Crimson instead of standard green
    isCurrent: true,
    items: [
      {
        name: "Velvet Skin Foundation — No. 04 Warm Ivory",
        eta: "Arriving Tomorrow",
        timeWindow: "By 6 PM",
        price: "$68.00",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Aura Illuminating Serum & Highlighter Duet",
        eta: "Expected Mon, 8 June",
        timeWindow: "10 AM – 4 PM",
        price: "$110.00",
        quantity: 1,
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRZLxq33aurJtcXwQP2eOP_oVSg1nh8SHkloU7vTHdMfBXbCG7HUKjxueEqxTmV_ATQVI9ZNJyWcO_f0LZCl-BVr-yqoA6Ant9_gU8Rh0cEXD_oCklzGevbQQ",
      }
    ]
  },
  {
    id: "AQ-89712",
    status: "DELIVERED ON 24 MAY",
    statusColor: "#2D211D",
    isCurrent: false,
    items: [
      {
        name: "Satin Lip & Cheek Rouge — Tint Crimson",
        eta: "Delivered May 24",
        timeWindow: "Signature Received",
        price: "$42.00",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200",
      }
    ]
  }
];

export default function OrdersPage() {
  return (
    <div className="max-w-[1200px] w-full mix-blend-multiply animate-fade-in">

      {/* HEADER SECTION (Derived from the blueprint layout) */}
      <header className="border-b border-[#2D211D]/10 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[13px] font-semibold uppercase tracking-[0.5em] text-[#A17F72]">
            Purchase Log
          </span>
          <h1 className="mt-4 font-[family:var(--font-cormorant)] text-[56px] md:text-[72px] font-light leading-none tracking-[-0.02em] text-[#2D211D]">
            Order History
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[14px] uppercase tracking-[0.2em] text-[#8E7468] font-light">
            {ORDERS_MOCK.length} Manifestations
          </span>
        </div>
      </header>

      {/* CHRONOLOGICAL STACKED MASTER WRAPPER */}
      <div className="mt-12 flex flex-col gap-12">
        {ORDERS_MOCK.map((order) => (
          <div
            key={order.id}
            className={`group grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 pb-10 border-b border-[#2D211D]/10 relative ${order.isCurrent ? 'pt-2' : ''
              }`}
          >
            {/* Visual Accent Bar indicating current active fulfillment status */}
            {order.isCurrent && (
              <div className="absolute left-0 top-0 h-[2px] w-16 bg-[#6B3037]" />
            )}

            {/* LEFT SIDE COLUMN: STATUS & PRODUCT ROWS */}
            <div className="flex flex-col gap-6">

              {/* Status Header Block */}
              <div className="flex items-center gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0 animate-pulse"
                  style={{ backgroundColor: order.statusColor }}
                />
                <span className="text-[13px] font-medium uppercase tracking-[0.3em]" style={{ color: order.statusColor }}>
                  {order.status}
                </span>
                <span className="text-[12px] text-[#2D211D]/30 font-mono ml-auto lg:ml-0">
                  Ref: {order.id}
                </span>
              </div>

              {/* Sub-Rows: Order Content Map */}
              <div className="flex flex-col gap-6 bg-white/30 backdrop-blur-xs p-6 rounded-2xl border border-[#2D211D]/[0.03]">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${idx !== order.items.length - 1 ? "border-b border-[#2D211D]/5 pb-6" : ""
                      }`}
                  >
                    {/* Thumbnail & Description Details */}
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-[#F0E2D7] relative overflow-hidden rounded-xl border border-[#2D211D]/5 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-medium text-[#2D211D] leading-snug max-w-[380px]">
                          {item.name}
                        </h4>
                        <p className="text-[13px] text-[#A17F72] uppercase tracking-wider mt-1.5 font-light">
                          Qty: {item.quantity} • <span className="font-medium text-[#2D211D]/70">{item.price}</span>
                        </p>
                      </div>
                    </div>

                    {/* Timeline Text Block within row */}
                    <div className="sm:text-right border-l sm:border-l-0 sm:border-r border-[#2D211D]/10 pl-4 sm:pl-0 sm:pr-6 py-1 shrink-0">
                      <p className="text-[16px] font-serif italic text-[#2D211D]">
                        {item.eta}
                      </p>
                      <p className="text-[13px] font-light text-[#8E7468] mt-0.5">
                        {item.timeWindow}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT SIDE COLUMN: PREMIUM VERTICAL ACTION ACTIONS PANEL */}
            <div className="flex flex-col justify-center gap-3 lg:border-l border-[#2D211D]/5 lg:pl-10 lg:h-full">

              {/* Primary Premium Action Hook */}
              {order.isCurrent ? (
                <button className="w-full py-3.5 bg-[#6B3037] hover:bg-[#5A262C] text-white font-medium text-[12px] uppercase tracking-[0.25em] rounded-full transition-all duration-300 shadow-xs hover:shadow-md transform hover:-translate-y-[1px]">
                  Track Shipment
                </button>
              ) : (
                <button className="w-full py-3.5 border border-[#6B3037] text-[#6B3037] bg-transparent hover:bg-[#6B3037] hover:text-white font-medium text-[12px] uppercase tracking-[0.25em] rounded-full transition-all duration-300">
                  Buy Again
                </button>
              )}

              {/* Secondary Actions Row */}
              <button className="w-full py-3.5 border border-[#2D211D]/10 bg-white/40 hover:bg-white/80 text-[#2D211D] text-[12px] uppercase tracking-[0.25em] rounded-full transition-all duration-300">
                View Details
              </button>

              {/* Editorial Inline Links */}
              <div className="flex justify-center gap-6 mt-3 text-[12px] uppercase tracking-[0.2em] font-light text-[#8E7468]">
                <button className="hover:text-[#6B3037] transition-colors relative group py-1">
                  Get Invoice
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#6B3037] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </button>
                <span className="text-[#2D211D]/10">•</span>
                <button className="hover:text-[#6B3037] transition-colors relative group py-1">
                  Assistance
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#6B3037] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* FOOTER NEED ASSISTANCE REDIRECT */}
      <footer className="mt-24 border-t border-[#2D211D]/10 pt-10 text-center">
        <p className="text-[14px] font-light text-[#8E7468] tracking-wide">
          Experiencing an anomaly with a delivery? Contact our{" "}
          <Link href="/concierge" className="text-[#6B3037] font-normal underline underline-offset-4 hover:text-[#5A262C]">
            Private Concierge Services
          </Link>
          .
        </p>
      </footer>

    </div>
  );
}