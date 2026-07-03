"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/orderApi";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Layers,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ExternalLink,
  Mail,
  User,
  Clock,
  Package,

} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Controls & Tracking State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeExpandedOrder, setActiveExpandedOrder] = useState<string | null>(null);

  // Analytical State Fields
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSalesCount: 0,
    pendingCount: 0,
    avgValue: 0
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getAllOrders();
        if (response.success) {
          const data = response.data || [];
          setOrders(data);
          setFilteredOrders(data);
          calculateAnalytics(data);
        }
      } catch (error) {
        console.error("Failed parsing internal operational datastores:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Compute live business analytics metrics 
  const calculateAnalytics = (data: any[]) => {
    const total = data.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    const pending = data.filter(
      o =>
        [
          "pending",
          "processing",
          "packed",
          "shipped",
          "out for delivery",
        ].includes(
          o.status?.toLowerCase()
        )
    ).length;
    setStats({
      totalRevenue: total,
      totalSalesCount: data.length,
      pendingCount: pending,
      avgValue: data.length ? total / data.length : 0
    });
  };

  // Live client-side processing optimization matrices
  useEffect(() => {
    let output = [...orders];

    if (statusFilter !== "all") {
      output = output.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      output = output.filter(o =>
        o._id.toLowerCase().includes(q) ||
        o.userId?.name?.toLowerCase().includes(q) ||
        o.userId?.email?.toLowerCase().includes(q)
      );
    }

    setFilteredOrders(output);
  }, [searchQuery, statusFilter, orders]);

  // Handle live status toggles (Mock implementation structure)
  const handleUpdateStatus =
    async (
      orderId: string,
      status: string
    ) => {

      try {
        const response =
          await updateOrderStatus(
            orderId,
            status
          );
        if (
          response.success
        ) {

          setOrders(prev => {

            const updatedOrders =
              prev.map(order =>
                order._id === orderId
                  ? {
                    ...order,
                    status,
                  }
                  : order
              );

            calculateAnalytics(updatedOrders);

            return updatedOrders;
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

  const toggleOrderExpansion = (id: string) => {
    setActiveExpandedOrder(activeExpandedOrder === id ? null : id);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          bg: "bg-amber-500/5 text-amber-700 border-amber-500/20",
          dot: "bg-amber-600",
        };

      case 'processing':
        return { bg: 'bg-purple-500/5 text-purple-700 border-purple-500/20', dot: 'bg-purple-600' };

      case "packed":
        return {
          bg: "bg-violet-500/5 text-violet-700 border-violet-500/20",
          dot: "bg-violet-600",
        };

      case 'shipped':
        return { bg: 'bg-blue-500/5 text-blue-700 border-blue-500/20', dot: 'bg-blue-600' };

      case 'delivered':
        return { bg: 'bg-emerald-500/5 text-emerald-700 border-emerald-500/20', dot: 'bg-emerald-600' };

      case "out for delivery":
        return {
          bg: "bg-indigo-500/5 text-indigo-700 border-indigo-500/20",
          dot: "bg-indigo-600",
        };

      case 'cancelled':
        return { bg: 'bg-rose-500/5 text-rose-700 border-rose-500/20', dot: 'bg-rose-600' };

      default:
        return {
          bg: "bg-slate-500/5 text-slate-700 border-slate-500/20",
          dot: "bg-slate-600",
        };
    }
  };

  const getPaymentStyle = (
    paymentStatus: string
  ) => {

    switch (
    paymentStatus?.toLowerCase()
    ) {

      case "paid":
        return {
          bg: "bg-emerald-500/5 text-emerald-700 border-emerald-500/20",
          dot: "bg-emerald-600",
        };

      case "failed":
        return {
          bg: "bg-rose-500/5 text-rose-700 border-rose-500/20",
          dot: "bg-rose-600",
        };

      default:
        return {
          bg: "bg-amber-500/5 text-amber-700 border-amber-500/20",
          dot: "bg-amber-600",
        };
    }

  };

  const getAllowedStatuses = (
    currentStatus: string
  ): string[] => {

    switch (currentStatus) {

      case "Pending":
        return [
          "Pending",
          "Processing",
          "Cancelled",
        ];

      case "Processing":
        return [
          "Processing",
          "Packed",
          "Cancelled",
        ];

      case "Packed":
        return [
          "Packed",
          "Shipped",
          "Cancelled",
        ];

      case "Shipped":
        return [
          "Shipped",
          "Out For Delivery",
        ];

      case "Out For Delivery":
        return [
          "Out For Delivery",
          "Delivered",
        ];

      case "Delivered":
        return [
          "Delivered",
        ];

      case "Cancelled":
        return [
          "Cancelled",
        ];

      default:
        return [
          currentStatus || "Pending",
        ];
    }
  };

  // --- SECTION 7: LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen  bg-[#F6F5F2] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#7A2E3A]/20"
            style={{ borderTopColor: "#7A2E3A" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-[#A17F72]/10"
            style={{ borderBottomColor: "#A17F72" }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#7A2E3A] font-light">ALQ</span>
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs tracking-[0.3em] text-[#A17F72] uppercase font-light font-sans"
        >
          Synchronizing Data
        </motion.p>
      </div>
    );
  }

  return (
    <main className="min-h-screen  bg-[#F6F5F2] text-[#2D211D] p-6 md:p-12  font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* TOP COMMAND HERO TITLE BAR */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#2D211D]/5 pb-8 pt-20 ">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#A17F72] font-semibold block mb-2">
              Operational Management
            </span>
            <h1 className="text-5xl sm:text-6xl font-light leading-tight tracking-[-0.03em] font-[family:var(--font-cormorant)] text-[#2D211D]">
              Orders <span className="italic text-[#7A2E3A]">Management</span>
            </h1>
          </div>
          <div className="text-xs text-[#8E7468] font-light font-mono bg-white/60 px-4 py-2 border border-[#E4D3C8]/40 rounded-xl">
            Active Records: {filteredOrders.length} / {orders.length} Units
          </div>
        </div>

        {/* 1. ANALYTICAL TELEMETRY BLOCK GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gross Gross Value */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E4D3C8]/40 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A17F72] font-semibold block">Revenue</span>
              <h3 className="text-2xl font-serif font-medium mt-1 font-[family:var(--font-cormorant)]">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-700">
              <DollarSign size={18} />
            </div>
          </div>

          {/* Volume Indices */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E4D3C8]/40 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A17F72] font-semibold block">Orders</span>
              <h3 className="text-2xl font-serif font-medium mt-1 font-[family:var(--font-cormorant)]">{stats.totalSalesCount} Orders</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#7A2E3A]/5 flex items-center justify-center text-[#7A2E3A]">
              <ShoppingBag size={18} />
            </div>
          </div>

          {/* Bottlenecks Counter */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E4D3C8]/40 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A17F72] font-semibold block">Active Orders</span>
              <h3 className="text-2xl font-serif font-medium mt-1 font-[family:var(--font-cormorant)]">{stats.pendingCount} Holds</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/5 flex items-center justify-center text-amber-700">
              <Clock size={18} />
            </div>
          </div>

          {/* Ticket Average Value */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E4D3C8]/40 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A17F72] font-semibold block">Average Order Value</span>
              <h3 className="text-2xl font-serif font-medium mt-1 font-[family:var(--font-cormorant)]">₹{stats.avgValue.toLocaleString("en-IN")}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-700">
              <Layers size={18} />
            </div>
          </div>
        </div>

        {/* 2. LIVE FILTER CONTROLS HUB */}
        <div className="bg-white border border-[#E4D3C8]/40 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Internal Input Group */}
          <div className="relative w-full md:max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E7468]" />
            <input
              type="text"
              placeholder="Search via Order Hash, Customer name, or Email routing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F6F5F2]/60 border border-[#E4D3C8]/50 rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#2D211D] focus:outline-none focus:border-[#7A2E3A]/40 focus:bg-white transition-all placeholder:text-[#8E7468]/50 font-light"
            />
          </div>

          {/* Filtering States Segments */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="text-[#8E7468] text-xs flex items-center gap-1.5 shrink-0 pr-2">
              <SlidersHorizontal size={13} /> Status Segmentation:
            </div>
            {[
              "All",
              "Pending",
              "Processing",
              "Packed",
              "Shipped",
              "Out For Delivery",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status.toLowerCase())}
                className={`px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider font-medium border transition-all duration-300 ${statusFilter === status.toLowerCase()
                  ? 'bg-[#2D211D] text-white border-[#2D211D]'
                  : 'bg-[#F6F5F2]/40 text-[#8E7468] border-[#E4D3C8]/40 hover:bg-white hover:text-[#2D211D]'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 3. PRIMARY ADMINISTRATIVE LEDGER DATA LIST */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-[#E4D3C8]/30 rounded-3xl p-16 text-center text-sm font-light text-[#8E7468]">
              No secure database matches found matching input control criteria.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusMeta = getStatusStyle(order.status);
              const isExpanded = activeExpandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className={`bg-white border rounded-2xl transition-all duration-500 overflow-hidden shadow-sm ${isExpanded ? 'border-[#7A2E3A]/30 ring-1 ring-[#7A2E3A]/5 bg-[#FDFBF9]' : 'border-[#E4D3C8]/40 hover:border-[#7A2E3A]/15'
                    }`}
                >
                  {/* MASTER STRIP ROW HEAD */}
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    {/* Column 1: Core System Metadata */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#F6F5F2] rounded-xl text-[#8E7468] font-mono text-[11px] font-semibold border border-[#E4D3C8]/20 hidden sm:block">
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-[15px] font-medium text-[#2D211D] flex items-center gap-1.5">
                            <User size={13} className="text-[#8E7468]" />
                            {order.userId?.name || "Anonymous Asset"}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-semibold flex items-center gap-1.5 ${statusMeta.bg}`}>
                            <span className={`w-1 h-1 rounded-full ${statusMeta.dot}`} />
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E7468] font-light mt-1 flex items-center gap-1.5 font-mono">
                          <Mail size={12} className="text-[#A17F72]/60" />
                          {order.userId?.email || "no-contact-record@alqora.com"}
                        </p>
                      </div>
                    </div>

                    {/* Column 2: Date and Nested Item Count metrics */}
                    <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-10 text-left lg:text-right ml-0 lg:ml-auto">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#A17F72] block">Timestamp</span>
                        <span className="text-xs font-light text-[#2D211D] block mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          }) : "System Epoch"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#A17F72] block">Items</span>
                        <span className="text-xs font-mono text-[#2D211D] block mt-0.5">
                          {order.products?.length || 0} Line Items
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#A17F72] block">Total Amount</span>
                        <span className="text-base font-serif font-medium text-[#7A2E3A] block mt-0.5 font-[family:var(--font-cormorant)]">
                          ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>



                    {/* Column 3: Live Control Interfaces */}
                    <div className="flex items-center gap-3 border-t border-[#F6F5F2] pt-4 lg:pt-0 lg:border-none justify-between sm:justify-end">
                      {/* State Modifier Picker Selector Dropdown */}
                      <div className="relative inline-block text-left ">
                        <select
                          value={order.status || "Pending"}

                          disabled={
                            order.status === "Delivered" ||
                            order.status === "Cancelled"
                          }
                          onChange={(e) => {
                            handleUpdateStatus(
                              order._id,
                              e.target.value
                            );
                          }}
                          className="appearance-none bg-[#F6F5F2] hover:bg-[#2D211D] hover:text-white border border-[#E4D3C8]/60 text-xs text-[#2D211D] font-medium py-2 pl-4 pr-10 rounded-xl cursor-pointer transition-all duration-300 focus:outline-none"
                        >
                          {getAllowedStatuses(order.status).map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                        <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>

                      {/* Expand Control Strip Trigger */}
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className={`p-2 rounded-xl bg-[#F6F5F2] hover:bg-[#7A2E3A]/5 border border-[#E4D3C8]/40 text-[#8E7468] hover:text-[#7A2E3A] transition-all duration-300 ${isExpanded ? 'rotate-180 bg-[#7A2E3A]/5 text-[#7A2E3A]' : ''
                          }`}
                      >
                        <ChevronDown size={15} />
                      </button>
                    </div>

                  </div>

                  {/* NESTED EXPANSION DRAWER OVERLAY PANEL */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#2D211D]/5 bg-[#FAFAFA]/50 animate-slide-down">
                      <div className="rounded-xl border border-[#E4D3C8]/30 bg-white overflow-hidden p-4 mt-2">
                        <div className="text-[10px] uppercase tracking-widest text-[#A17F72] font-semibold border-b border-[#F6F5F2] pb-3 mb-4 flex items-center gap-1.5">
                          <Package size={12} /> Manifest Ledger Detail
                        </div>

                        <div className="divide-y divide-[#F6F5F2]">
                          {order.products && order.products.map((item: any, idx: number) => (
                            <div key={item.productId || idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-4">
                                {item.image_link && (
                                  <div className="relative w-12 h-12 bg-[#F6F5F2] border border-[#E4D3C8]/40 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                      src={
                                        item.image_link ||
                                        "/placeholder-product.png"
                                      }
                                      alt={item.name || "Manifest Asset"}
                                      fill
                                      className="object-cover p-0.5"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h5 className="text-sm font-medium text-[#2D211D] max-w-sm truncate">{item.name || "Fine Selection Asset"}</h5>
                                  <p className="text-[10px] uppercase tracking-wider text-[#A17F72] mt-0.5 font-mono">
                                    SKU Units: {item.quantity || 1} × ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono font-medium text-[#2D211D]">
                                  ₹{(
                                    Number(item.price || 0) *
                                    (item.quantity || 1)
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* SHIPPING DETAILS */}

                        <div className="mt-5 rounded-xl border border-[#E4D3C8]/30 bg-[#F6F5F2]/40 p-5">

                          <p className="text-[10px] uppercase tracking-widest text-[#A17F72] font-semibold mb-4">
                            Shipping Information
                          </p>

                          <div className="space-y-3">

                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#8E7468]">
                                Full Name
                              </span>

                              <p className="text-sm text-[#2D211D] mt-1">
                                {order.shippingAddress?.fullName || "Not Available"}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#8E7468]">
                                Phone
                              </span>

                              <p className="text-sm text-[#2D211D] mt-1">
                                {order.shippingAddress?.phone || "Not Available"}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#8E7468]">
                                Address
                              </span>

                              <p className="text-sm text-[#2D211D] mt-1 leading-relaxed">
                                {order.shippingAddress?.address || "Not Available"}
                              </p>
                            </div>

                          </div>

                        </div>
                        {/* PAYMENT INFORMATION */}

                        <div className="mt-5 rounded-xl border border-[#E4D3C8]/30 bg-white p-5">

                          <div className="flex items-center justify-between mb-4">

                            <p className="text-[10px] uppercase tracking-widest text-[#A17F72] font-semibold">
                              Payment Information
                            </p>

                            <span
                              className={`
        px-3
        py-1
        rounded-full
        border
        text-[9px]
        uppercase
        tracking-wider
        font-semibold
        flex
        items-center
        gap-1.5
        ${getPaymentStyle(
                                order.paymentStatus
                              ).bg}
      `}
                            >
                              <span
                                className={`
          w-1.5
          h-1.5
          rounded-full
          ${getPaymentStyle(
                                  order.paymentStatus
                                ).dot}
        `}
                              />

                              {order.paymentStatus || "Pending"}

                            </span>

                          </div>

                          <div className="grid md:grid-cols-2 gap-4">

                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#8E7468]">
                                Payment Method
                              </span>

                              <p className="text-sm text-[#2D211D] mt-1 capitalize">
                                {order.paymentMethod || "Not Available"}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#8E7468]">
                                Transaction State
                              </span>

                              <p className="text-sm text-[#2D211D] mt-1">
                                {order.paymentStatus || "Pending"}
                              </p>
                            </div>

                          </div>

                        </div>

                        {/* Extra Administrative Internal Manifest Verification Section */}
                        <div className="bg-[#F6F5F2]/40 rounded-xl mt-5 p-4 border border-[#E4D3C8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="text-[#8E7468] font-light">
                            System Identifier Key: <span className="font-mono text-[11px] font-normal text-[#2D211D] select-all bg-white px-1.5 py-0.5 rounded border border-[#E4D3C8]/30 ml-1">{order._id}</span>
                          </div>
                          <button className="text-[10px] uppercase tracking-widest text-[#7A2E3A] font-semibold hover:opacity-80 flex items-center gap-1">
                            Print Invoice Receipt <ExternalLink size={10} />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}