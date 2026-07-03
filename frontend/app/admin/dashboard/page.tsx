"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  ShoppingBag,
  Users,
  Layers,
  Clock,
  RotateCw,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertTriangle,
  PlusCircle,
  Sliders,
  UserCheck,
  ArrowUpRight
} from "lucide-react";
import { getDashboardStats } from "@/lib/adminDashboardApi";

// --- TYPES & INTERFACES ---
interface OrderUser {
  name?: string;
  email?: string;
}

interface RecentOrder {
  _id: string;
  userId?: OrderUser;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paidOrders: number;
  failedOrders: number;
}

interface ApiResponse {
  success: boolean;
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topCustomers?: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response && response.success) {
          setTopCustomers(response.topCustomers || []);
          setData(response);
        } else {
          setError("Failed to fetch dashboard data.");
        }
      } catch (err) {
        console.error("Dashboard engine error:", err);
        setError("An error occurred while connecting to the analytics service.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1EB] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#7A2E3A]/20"
            style={{ borderTopColor: "#7A2E3A" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A2E3A] font-bold">ALQ</span>
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR HANDLER ---
  if (error || !data || !data.stats) {
    return (
      <div className="min-h-screen bg-[#F8F1EB] flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center p-10 bg-white/60 backdrop-blur-md rounded-3xl border border-[#E4D5CC]">
          <AlertTriangle className="w-8 h-8 text-[#7A2E3A] mx-auto mb-4 stroke-[1.25]" />
          <p className="text-sm text-[#2D211D] font-medium">{error || "Data unavailable."}</p>
        </div>
      </div>
    );
  }

  const { stats, recentOrders } = data;

  return (
    <div className="relative min-h-screen bg-[#F8F1EB] text-[#2D211D] antialiased px-20 md:px-28 pt-28 pb-20 overflow-x-hidden p-12">
      
      {/* BACKGROUND BRANDING DEPTH */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[#E8C9B8]/20 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-10">

        {/* ===================================================
            SECTION 1: BALANCED HERO HEADER
            =================================================== */}
        <header className="border-b border-[#E4D5CC] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="h-[1px] w-6 bg-[#7A2E3A]" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#7A2E3A] font-bold">
                Alqora Admin Portal
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-light leading-tight tracking-[-0.03em] font-[family:var(--font-cormorant)] text-[#2D211D]">
              Store <span className="italic text-[#7A2E3A]">Dashboard</span>
            </h1>
            <p className="text-xs text-[#A17F72] font-medium tracking-wide">
              Overview of your beauty store metrics, orders, and sales performance.
            </p>
          </div>
          
          <div className="text-left md:text-right hidden sm:block border-r border-[#E4D5CC] pr-5 py-0.5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#A17F72] font-bold">CURRENT DATE</p>
            <p className="text-xs tracking-wide text-[#2D211D] font-bold mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* ===================================================
            SECTION 2: SALES OVERVIEW CARDS
            =================================================== */}
        <section className="space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#A17F72] font-bold">Sales Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Total Revenue", val: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: Crown },
              { label: "Total Orders", val: (stats.totalOrders || 0).toLocaleString(), icon: ShoppingBag },
              { label: "Total Customers", val: (stats.totalCustomers || 0).toLocaleString(), icon: Users },
              { label: "Total Products", val: (stats.totalProducts || 0).toLocaleString(), icon: Layers },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/60 backdrop-blur-md border border-white/90 rounded-[22px] shadow-[0_4px_20px_rgba(45,33,29,0.01)] flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#A17F72] font-bold">{kpi.label}</p>
                  <p className="text-3xl font-light font-[family:var(--font-cormorant)] tracking-tight text-[#2D211D]">{kpi.val}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E4D5CC] text-[#7A2E3A] shadow-sm">
                  <kpi.icon className="w-4 h-4 stroke-[1.5]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            SECTION 3: BALANCED MID ROW UTILITIES
            =================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-1 space-y-3">
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#A17F72] font-bold">Payment Tracking</h2>
            <div className="grid grid-cols-2 gap-4 h-[76px]">
              <div className="bg-white/60 backdrop-blur-md border border-white/90 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <CreditCard className="w-3.5 h-3.5 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#2D211D]">Paid Orders</span>
                </div>
                <span className="text-xl font-[family:var(--font-cormorant)] text-emerald-800 font-bold">{stats.paidOrders || 0}</span>
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-white/90 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#2D211D]">Failed Payments</span>
                </div>
                <span className="text-xl font-[family:var(--font-cormorant)] text-rose-800 font-bold">{stats.failedOrders || 0}</span>
              </div>
            </div>
          </section>

          <section className="xl:col-span-2 space-y-3">
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#A17F72] font-bold">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Add New Product", path: "/admin", icon: PlusCircle },
                { label: "Manage Store Orders", path: "/admin/orders", icon: Sliders },
                { label: "View User Accounts", path: "/admin/users", icon: UserCheck },
              ].map((act, idx) => (
                <a
                  href={act.path}
                  key={idx}
                  className="h-[76px] flex items-center justify-between px-5 bg-white/60 hover:bg-white backdrop-blur-md border border-white/90 rounded-2xl shadow-sm group transition-all duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#7A2E3A]/5 text-[#7A2E3A] rounded-xl group-hover:bg-[#2D211D] group-hover:text-white transition-colors">
                      <act.icon className="w-3.5 h-3.5 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-bold tracking-wide text-[#2D211D]">{act.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#A17F72] group-hover:text-[#7A2E3A] transition-colors stroke-[1.5]" />
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* ===================================================
            SECTION 4: ORDER FULFILLMENT MATRIX
            =================================================== */}
        <section className="space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#A17F72] font-bold">Order Fulfillment Pipelines</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: "Pending", count: stats.pendingOrders || 0, icon: Clock, tint: "border-amber-200 text-amber-900 bg-amber-50/40" },
              { title: "Processing", count: stats.processingOrders || 0, icon: RotateCw, tint: "border-blue-200 text-blue-900 bg-blue-50/40" },
              { title: "Shipped", count: stats.shippedOrders || 0, icon: Truck, tint: "border-indigo-200 text-indigo-900 bg-indigo-50/40" },
              { title: "Delivered", count: stats.deliveredOrders || 0, icon: CheckCircle, tint: "border-emerald-200 text-emerald-900 bg-emerald-50/40" },
              { title: "Cancelled", count: stats.cancelledOrders || 0, icon: XCircle, tint: "border-rose-200 text-rose-900 bg-rose-50/40" },
            ].map((status, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-between h-[110px] shadow-sm transition-all group ${status.tint}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-opacity-90">{status.title}</span>
                  <status.icon className="w-3.5 h-3.5 opacity-70 group-hover:scale-110 transition-transform stroke-[1.75]" />
                </div>
                <p className="text-3xl font-light font-[family:var(--font-cormorant)] tracking-tight text-[#2D211D]">
                  {status.count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            SECTION 5: SPACIOUS LOG DATA SEGMENT
            =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* RECENT ORDERS TABLE (LEFT 2/3 COLUMN) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#A17F72] font-bold">Recent Orders</h2>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A2E3A] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E4D5CC]">
                {recentOrders?.length || 0} Total Orders
              </span>
            </div>
            <div className="w-full overflow-hidden bg-white/60 backdrop-blur-md border border-[#E4D5CC] rounded-[24px] shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-[#E4D5CC] bg-[#2D211D]/[0.02] text-[10px] tracking-[0.15em] uppercase text-[#2D211D] font-bold">
                    <th className="py-5 px-6 w-[25%]">Order ID</th>
                    <th className="py-5 px-6 w-[42%]">Customer Profile</th>
                    <th className="py-5 px-6 text-right w-[20%]">Amount</th>
                    <th className="py-5 px-6 text-center w-[13%]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4D5CC]/60 text-xs text-[#2D211D]">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order) => {
                      let badgeStyle = "bg-stone-100 text-stone-800 border-stone-200";
                      const orderStatus = (order.status || "pending").toLowerCase();
                      if (orderStatus === "delivered") badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
                      else if (orderStatus === "pending") badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
                      else if (orderStatus === "cancelled") badgeStyle = "bg-rose-50 text-rose-800 border-rose-200";
                      else if (orderStatus === "shipped" || orderStatus === "processing") badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";

                      return (
                        <tr key={order._id} className="hover:bg-white/80 transition-colors duration-150">
                          <td className="py-5 px-6 font-mono text-[11px] font-bold text-[#7A2E3A]">
                            #{order._id.slice(-7).toUpperCase()}
                          </td>
                          <td className="py-5 px-6">
                            <div className="font-bold text-[#2D211D] truncate max-w-[220px]">{order.userId?.name || "Guest Customer"}</div>
                            <div className="text-[10px] text-[#A17F72] font-semibold mt-0.5 truncate max-w-[220px]">{order.userId?.email || "No Email Provided"}</div>
                          </td>
                          <td className="py-5 px-6 text-right font-bold text-[#2D211D]">
                            ₹{Number(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-5 px-6 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] tracking-widest border uppercase font-bold min-w-[85px] ${badgeStyle}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-[#A17F72] font-medium text-xs">No customer transactions logged.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* DE-COMPACTED TOP CUSTOMERS PANEL (RIGHT 1/3 COLUMN) */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#A17F72] font-bold">Top Customers</h2>
            <div className="bg-white/60 backdrop-blur-md border border-[#E4D5CC] rounded-[24px] p-6 shadow-sm min-h-[460px] flex flex-col justify-start space-y-6">
              {topCustomers && topCustomers.length > 0 ? (
                <div className="divide-y divide-[#E4D5CC] space-y-4">
                  {topCustomers.slice(0, 5).map((customer: any, index: number) => (
                    <div key={customer.email || index} className="flex justify-between items-center pt-4 first:pt-0">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-[#2D211D]">
                          {customer.name || "Guest Account"}
                        </h3>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold border ${
                          customer.badge === "Platinum" ? "bg-[#7A2E3A] text-white border-[#7A2E3A]" : "bg-white text-[#A17F72] border-[#E4D5CC]"
                        }`}>
                          {customer.badge || "Customer"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#7A2E3A]">
                          ₹{Number(customer.totalSpent || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#A17F72] font-bold tracking-wide mt-0.5">
                          {customer.totalOrders} Orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="my-auto text-center">
                  <p className="text-xs text-[#A17F72] font-medium py-6">No custom profiles registered.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}