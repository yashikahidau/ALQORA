"use client";

import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "@/lib/orderApi";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Calendar, Hash, ArrowLeft, CreditCard, Box, CheckCircle2, Clock, Truck, AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getMyOrders();

        if (response?.success) {
          setOrders(response.data || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed loading internal archives:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);



  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`cancel-${orderId}`);

      const response = await cancelOrder(orderId);

      if (response?.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                ...order,
                status: "Cancelled",
              }
              : order
          )
        );

        toast.success("Order cancelled successfully.");
      } else {
        toast.error(
          response?.error || "Failed to cancel order"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in again.");
        return;
      }

      setActionLoading(`invoice-${orderId}`);

      const response = await fetch(
        `${API_URL}/invoice/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${orderId}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice.");
    } finally {
      setActionLoading(null);
    }
  };

  // Helper: Clear High-Contrast Status Theming 
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || "pending";

    if (s === "delivered")
      return {
        text: "text-emerald-800 border-emerald-300",
        bg: "bg-emerald-50/70",
        dot: "bg-emerald-600",
        icon: <CheckCircle2 size={12} />
      };

    if (s === "out for delivery")
      return {
        text: "text-indigo-800 border-indigo-300",
        bg: "bg-indigo-50/70",
        dot: "bg-indigo-600",
        icon: <Truck size={12} />
      };

    if (s === "shipped")
      return {
        text: "text-blue-800 border-blue-300",
        bg: "bg-blue-50/70",
        dot: "bg-blue-600",
        icon: <Truck size={12} />
      };

    if (s === "packed")
      return {
        text: "text-violet-800 border-violet-300",
        bg: "bg-violet-50/70",
        dot: "bg-violet-600",
        icon: <Box size={12} />
      };

    if (s === "processing")
      return {
        text: "text-purple-800 border-purple-300",
        bg: "bg-purple-50/70",
        dot: "bg-purple-600",
        icon: <Clock size={12} />
      };

    if (s === "cancelled")
      return {
        text: "text-rose-800 border-rose-300",
        bg: "bg-rose-50/70",
        dot: "bg-rose-600",
        icon: <AlertCircle size={12} />
      };

    return {
      text: "text-amber-800 border-amber-300",
      bg: "bg-amber-50/70",
      dot: "bg-amber-600",
      icon: <Clock size={12} />
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7A2E3A]/5 blur-[120px]" />
        <div className="text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#A17F72] font-semibold">
            Curating Personal Archive
          </p>
          <h2 className="mt-4 text-[32px] md:text-[40px] font-serif font-light text-[#2D211D] tracking-tight font-[family:var(--font-cormorant)]">
            Retrieving Orders
          </h2>
          <div className="mt-8 mx-auto w-12 h-[1px] bg-[#7A2E3A]/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#7A2E3A] animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      </main>
    );
  }

  const orderSteps = [
    "Pending",
    "Processing",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const getStepIndex = (
    status: string
  ) => {

    const index =
      orderSteps.findIndex(
        step => step === status
      );

    return index === -1 ? 0 : index;
  };
  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-36 pb-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Decorative Brand Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#7A2E3A]/3 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#8E7468]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* BACK TO ATELIER NAVIGATION */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#594943] hover:text-[#7A2E3A] font-medium transition-colors duration-300 mb-12"
        >
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Atelier
        </Link>

        {/* HEADER SECTION */}
        <div className="mb-16 border-b border-[#2D211D]/10 pb-12">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#A17F72] font-bold block mb-3">
            Customer Ledger
          </span>
          <h1 className="text-[44px] md:text-[68px] leading-[0.95] tracking-tight text-[#2D211D] font-serif font-light font-[family:var(--font-cormorant)]">
            Your Orders
          </h1>
          <p className="mt-5 max-w-xl text-[#4A3E39] text-[15px] leading-[1.7] font-normal">
            A meticulously kept directory of your asset acquisitions, curated shipments, and past beauty order manifests.
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="rounded-[40px] border border-[#E4D3C8]/80 bg-white p-16 text-center shadow-[0_20px_50px_rgba(45,33,29,0.04)]">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#7A2E3A]/5 flex items-center justify-center text-[#7A2E3A] mb-6">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A17F72] font-bold block">
              Archive Void
            </span>
            <h2 className="mt-3 text-3xl text-[#2D211D] font-serif font-light font-[family:var(--font-cormorant)]">
              Your collection manifest is empty
            </h2>
            <p className="mt-4 max-w-xs mx-auto text-sm text-[#594943] leading-relaxed font-light">
              Once fine selection orders have been fulfilled, they will render beautifully inside this secure window space.
            </p>
            <Link href="/" className="mt-8 inline-block px-8 py-3 rounded-full bg-[#2D211D] text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#7A2E3A] transition-colors duration-500 shadow-sm">
              Explore Collections
            </Link>
          </div>
        )}

        {/* ARCHIVE GRID / STACKED CARDS */}
        <div className="space-y-10">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);

            return (
              <div
                key={order._id}
                className="group rounded-3xl border border-[#D9C4B7] bg-white shadow-[0_12px_40px_rgba(45,33,29,0.03)] overflow-hidden hover:border-[#7A2E3A]/30 hover:shadow-[0_20px_50px_rgba(45,33,29,0.07)] transition-all duration-500"
              >
                {/* 1. COMPONENT TOP INFOBAR: SYSTEMATIC HIGH-CONTRAST EDITORIAL GRID */}
                <div className="px-6 py-5 sm:px-8 bg-[#FAF8F5] border-b border-[#E4D3C8]/60 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 items-center">

                  {/* Item Cell 1: Manifest ID */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#A17F72] font-bold block">
                      Manifest Reference
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[#2D211D]">
                      <Hash size={12} className="text-[#594943] shrink-0" />
                      <span className="text-[13px] font-mono font-bold tracking-tight">
                        {order._id ? order._id.slice(-8).toUpperCase() : "UNASSIGNED"}
                      </span>
                    </div>
                  </div>

                  {/* Item Cell 2: Date Placement */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#A17F72] font-bold block">
                      Date Lodged
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[#2D211D]">
                      <Calendar size={12} className="text-[#594943] shrink-0" />
                      <span className="text-[13px] font-medium text-[#2D211D]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "System Date"}
                      </span>
                    </div>
                  </div>

                  {/* Item Cell 3: Transaction Telemetry */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#A17F72] font-bold block">
                      Settlement Method
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[#2D211D]">
                      <CreditCard size={12} className="text-[#594943] shrink-0" />
                      <span className="text-[13px] font-medium text-[#2D211D] truncate">
                        {order.paymentMethod === "razorpay" ? "Razorpay" : "Cash Ledger"}{" "}
                        <span className="text-[11px] font-mono font-bold text-[#7A2E3A]">({order.paymentStatus?.toUpperCase() || "PAID"})</span>
                      </span>
                    </div>
                  </div>

                  {/* Item Cell 4: Status Indicator Badge Container */}
                  <div className="md:text-right col-span-2 md:col-span-1 justify-self-start md:justify-self-end">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.15em] font-bold shadow-sm ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.icon}
                      {order.status || "Processing"}
                    </span>
                  </div>

                </div>


                <div className="px-6 sm:px-8 py-6 border-b border-[#E4D3C8]/40">

                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A17F72] font-bold mb-5">
                    Shipment Progress
                  </p>

                  {order.status === "Cancelled" ? (

                    <div className="flex items-center gap-3 text-rose-700">
                      <AlertCircle size={18} />
                      <span className="text-sm font-medium">
                        This order has been cancelled.
                      </span>
                    </div>

                  ) : (

                    <div className="flex items-center justify-between overflow-x-auto">

                      {orderSteps.map((step, index) => {

                        const active =
                          index <= getStepIndex(
                            order.status
                          );

                        return (

                          <div
                            key={step}
                            className="flex items-center flex-1"
                          >

                            <div className="flex flex-col items-center min-w-[80px]">

                              <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${active
                                    ? "bg-[#7A2E3A] text-white"
                                    : "bg-[#E4D3C8] text-[#8E7468]"
                                  }
                `}
                              >
                                {active ? "✓" : index + 1}
                              </div>

                              <span
                                className={`
                  mt-2 text-[10px] uppercase tracking-wider text-center
                  ${active
                                    ? "text-[#2D211D] font-semibold"
                                    : "text-[#A17F72]"
                                  }
                `}
                              >
                                {step}
                              </span>

                            </div>

                            {index <
                              orderSteps.length - 1 && (
                                <div
                                  className={`
                  flex-1 h-[2px]
                  ${index <
                                      getStepIndex(
                                        order.status
                                      )
                                      ? "bg-[#7A2E3A]"
                                      : "bg-[#E4D3C8]"
                                    }
                `}
                                />
                              )}

                          </div>
                        );
                      })}

                    </div>

                  )}

                </div>



                {/* 2. CARD CENTRAL PRODUCT ARCHIVE */}
                <div className="px-6 py-2 sm:px-8 divide-y divide-[#E4D3C8]/40">
                  {order.products && order.products.map((product: any, index: number) => (
                    <div
                      key={product.productId || index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6"
                    >
                      {/* Product Left Cluster details */}
                      <div className="flex items-center gap-4 sm:gap-5">
                        {/* Impeccable Border Image Wrapper Container */}
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-[#F5F1ED] border border-[#E4D3C8]/60 shrink-0 shadow-inner">
                          {product.image_link ? (
                            <Image
                              src={product.image_link}
                              alt={product.name || "Product"}
                              fill
                              className="object-cover p-0.5 transition-transform duration-500 group-hover:scale-102"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#A17F72]/40 bg-[#F5F1ED]">
                              <Box size={20} strokeWidth={1} />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[#2D211D] text-[17px] font-serif font-semibold tracking-tight font-[family:var(--font-cormorant)] leading-tight">
                            {product.name || "Atelier Core Lineup Unit"}
                          </h4>
                          {/* Richer Color Weighting for Sub-labels */}
                          <p className="text-[11px] uppercase tracking-[0.15em] text-[#594943] font-bold font-mono">
                            QTY: {product.quantity || 1} <span className="mx-2 text-[#D9C4B7] font-normal">•</span> ₹{Number(product.price || 0).toLocaleString("en-IN")} each
                          </p>
                        </div>
                      </div>

                      {/* Product Row Total pricing calculations */}
                      <div className="sm:text-right pl-24 sm:pl-0">
                        <span className="text-[#2D211D] font-bold text-base font-mono tracking-tight">
                          ₹{(
                            Number(product.price || 0) *
                            (product.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. LEDGER COMPONENT FOOTER TOTAL CLOSING */}
                <div className="px-6 py-5 sm:px-8 border-t border-[#E4D3C8]/50 bg-[#FAF8F5]/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A17F72] font-bold block">
                      Total Capital Transacted
                    </span>
                    <span className="text-xs text-[#594943] italic font-normal block mt-1">
                      Includes luxury delivery and protective cosmetic packaging arrangements
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-3">

                    <span className="text-2xl sm:text-3xl font-serif font-medium text-[#7A2E3A] tracking-tight font-[family:var(--font-cormorant)]">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </span>

                    {(
                      order.status === "Pending" ||
                      order.status === "Processing"
                    ) && (

                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={actionLoading === `cancel-${order._id}`}
                          className="
    px-5 py-2.5
    rounded-full
    bg-rose-600
    text-white
    text-[11px]
    uppercase
    tracking-[0.15em]
    font-semibold
    hover:bg-rose-700
    transition-all
    duration-300
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
                        >
                          {actionLoading === `cancel-${order._id}`
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}

                    {order.status === "Delivered" ? (
                      <button
                        onClick={() => downloadInvoice(order._id)}
                        disabled={actionLoading === `invoice-${order._id}`}
                        className="
    px-5 py-2.5
    rounded-full
    bg-[#7A2E3A]
    text-white
    text-[11px]
    uppercase
    tracking-[0.15em]
    font-semibold
    hover:bg-[#5F2330]
    transition-all
    duration-300
    shadow-sm
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
                      >
                        {actionLoading === `invoice-${order._id}`
                          ? "Downloading..."
                          : "Download Invoice"}
                      </button>
                    ) : order.status === "Cancelled" ? (

                      <button
                        disabled
                        className="
      px-5 py-2.5
      rounded-full
      bg-rose-100
      text-rose-700
      text-[11px]
      uppercase
      tracking-[0.15em]
      font-semibold
      cursor-not-allowed
    "
                      >
                        Order Cancelled
                      </button>

                    ) : (

                      <button
                        disabled
                        className="
      px-5 py-2.5
      rounded-full
      bg-[#E4D3C8]
      text-[#8E7468]
      text-[11px]
      uppercase
      tracking-[0.15em]
      font-semibold
      cursor-not-allowed
    "
                      >
                        Available After Delivery
                      </button>

                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}