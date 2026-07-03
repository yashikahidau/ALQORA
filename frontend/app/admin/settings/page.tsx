"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, Globe, Heart, ShoppingBag, MapPin,
  Star, Truck, Download, LogOut, AlertCircle,
  Package, Users, ShoppingCart, IndianRupee
} from "lucide-react";
import { toast } from "sonner";

import {
  getStoreSettings,
  updateStoreSettings,
}
  from "@/lib/adminSettingsApi";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
}
  from "@/lib/authApi";

import EditProfileModal from "@/components/admin/EditProfileModal";

import ChangePasswordModal from "@/components/admin/ChangePasswordModal";
import { exportCustomers, exportOrders, exportRevenue } from "@/lib/adminUserApi";
import { useStoreSettings }
  from "@/context/StoreSettingsContext";


const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function AlqoraLuxuryAtelierSettings() {
  const router = useRouter();

  const {
    refreshSettings,
  } = useStoreSettings();

  const [storeExperience,
    setStoreExperience] =
    useState({
      wishlist: true,
      reviews: true,
      tracking: true,
      guestCheckout: false,
      freeShipping: true,
    });

  const [payments,
    setPayments] =
    useState({
      razorpay: true,
      upi: true,
      cards: true,
      cod: false,
    });


  const [adminProfile,
    setAdminProfile] =
    useState({

      name: "",

      email: "",

      role: "",

      badge: "",

    });

  const [editOpen,
    setEditOpen] =
    useState(false);

  const [passwordOpen,
    setPasswordOpen] =
    useState(false);
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [dangerAction, setDangerAction] = useState<string | null>(null);

  useEffect(() => {

    const loadSettings =
      async () => {

        const response =
          await getStoreSettings();

        if (
          response?.success
        ) {

          setStoreExperience({

            wishlist:
              response.settings.wishlistEnabled,

            reviews:
              response.settings.reviewsEnabled,

            tracking:
              response.settings.trackingEnabled,

            guestCheckout:
              response.settings.guestCheckout,

            freeShipping:
              true,

          });

          setPayments({

            razorpay: true,

            upi: true,

            cards: true,

            cod:
              response.settings.codEnabled,

          });
        }
      };

    loadSettings();



    const loadProfile =
      async () => {

        const response =
          await getMyProfile();

        if (
          response?.success
        ) {

          setAdminProfile({

            name:
              response.user.name,

            email:
              response.user.email,

            role:
              response.user.role,

            badge:
              response.user.badge,

          });

        }

      };

    loadProfile();

  }, []);


  const saveSettings = async (
    updatedStoreExperience = storeExperience,
    updatedPayments = payments
  ) => {

    const response =
      await updateStoreSettings({

        wishlistEnabled:
          updatedStoreExperience.wishlist,

        reviewsEnabled:
          updatedStoreExperience.reviews,

        trackingEnabled:
          updatedStoreExperience.tracking,

        guestCheckout:
          updatedStoreExperience.guestCheckout,

        codEnabled:
          updatedPayments.cod,

      });


    if (!response.success) {

      toast.error(
        response.error || "Failed to save settings."
      );

      return;

    }

    await refreshSettings();

  };


  const handleProfileSave =
    async (
      name: string,
      email: string
    ) => {

      const response =
        await updateMyProfile({

          name,

          email,

        });

      if (
        response?.success
      ) {

        setAdminProfile({

          name:
            response.user.name,

          email:
            response.user.email,

          role:
            response.user.role,

          badge:
            response.user.badge,

        });

        localStorage.setItem(
          "alqora-user",

          JSON.stringify(
            response.user
          )
        );

        toast.success(
          "Profile updated successfully."
        );

      } else {

        toast.error(
          response.error || "Failed to update profile."
        );

      }

    };


  const handlePasswordChange =
    async (
      currentPassword: string,
      newPassword: string
    ) => {

      const response =
        await changePassword(
          currentPassword,
          newPassword
        );

      if (response?.success) {

        toast.success(
          "Password updated successfully."
        );

      } else {

        toast.error(
          response?.error ||
          "Failed to update password."
        );

      }

    };

  const handleExportCustomers =
    async () => {

      const response =
        await exportCustomers();

      if (!response?.success) {

        toast.error(
          "Failed to export customers."
        );

        return;
      }

      const customers =
        response.customers;

      const headers = [
        "Name",
        "Email",
        "Badge",
        "Role",
        "Orders",
        "TotalSpent",
        "Joined",
      ];

      const csvRows = [
        headers.join(","),
      ];

      customers.forEach(
        (customer: any) => {

          csvRows.push(
            [
              customer.Name,
              customer.Email,
              customer.Badge,
              customer.Role,
              customer.Orders,
              customer.TotalSpent,
              customer.Joined,
            ].join(",")
          );

        }
      );

      const blob =
        new Blob(
          [csvRows.join("\n")],
          {
            type: "text/csv",
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "customers.csv";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );
      toast.success(
        "Customers exported successfully."
      );
    };

  const handleExportOrders =
    async () => {

      const response =
        await exportOrders();

      if (!response?.success) {

        toast.error(
          "Failed to export orders."
        );

        return;
      }

      const orders =
        response.orders;

      const headers = [
        "Order ID",
        "Customer",
        "Email",
        "Amount",
        "Status",
        "Payment Status",
        "Payment Method",
        "Date",
      ];

      const csvRows = [
        headers.join(","),
      ];

      orders.forEach(
        (order: any) => {

          csvRows.push(
            [
              `"${order.OrderID}"`,
              `"${order.Customer}"`,
              `"${order.Email}"`,
              order.Amount,
              `"${order.Status}"`,
              `"${order.PaymentStatus}"`,
              `"${order.PaymentMethod}"`,
              `"${order.Date}"`,
            ].join(",")
          );

        }
      );

      const blob =
        new Blob(
          [csvRows.join("\n")],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "orders.csv";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );
      toast.success(
        "Orders exported successfully."
      );
    };


  const handleExportRevenue =
    async () => {

      const response =
        await exportRevenue();

      if (!response?.success) {

        toast.error(
          "Failed to export revenue."
        );

        return;
      }

      const revenue =
        response.revenue;

      const headers = [
        "Month",
        "Delivered Orders",
        "Revenue",
        "Average Order Value",
      ];

      const csvRows = [
        headers.join(","),
      ];

      revenue.forEach(
        (row: any) => {

          csvRows.push(
            [
              `"${row.Month}"`,
              row.DeliveredOrders,
              row.Revenue,
              row.AverageOrderValue,
            ].join(",")
          );

        }
      );

      const blob =
        new Blob(
          [csvRows.join("\n")],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "revenue.csv";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );
      toast.success(
        "Revenue report exported successfully."
      );
    };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#1C1412] px-6 py-16 md:px-16 lg:px-24 font-sans antialiased relative selection:bg-[#7A2E3A]/10 selection:text-[#7A2E3A] pt-28">

      {/* Soft Luxury Light Ambient Glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7A2E3A]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">

        {/* ===================================================
            HEADER SECTION: CRISP EDITORIAL HEADQUARTERS
            =================================================== */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1C1412]/15 pb-8 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.4em] text-[#7A2E3A] uppercase">
                ALQORA BEAUTY
              </span>
              <div className="h-px w-8 bg-[#7A2E3A]/40" />
            </div>
            <h1 className="text-5xl md:text-6xl font-normal tracking-tight font-serif text-[#1C1412] leading-none">
              Store <span className="font-light italic text-[#A17F72]">Settings</span>
            </h1>
            <p className="text-base text-[#1C1412]/80 font-normal max-w-xl">
              Manage your digital storefront interface, payment configurations, and administrative controls.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#1C1412]/15 px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(28,20,18,0.04)] text-xs font-semibold tracking-wider shrink-0 self-start md:self-end">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[#1C1412] uppercase tracking-widest text-xs font-bold">Store Live</span>
          </div>
        </header>

        {/* ===================================================
            SECTION 1: BRAND PROFILE WITH LIVE METRICS
            =================================================== */}
        <div className="bg-white border border-[#1C1412]/10 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(28,20,18,0.03)] flex flex-col gap-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-[#1C1412]/10 pb-10">
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-5xl tracking-[0.15em] font-serif font-medium text-[#1C1412]">ALQORA</h3>
                <p className="text-xs tracking-[0.4em] text-[#7A2E3A] uppercase font-bold mt-2">UNVEIL THE AURA</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10 text-sm text-[#1C1412] font-medium">
                <div className="flex items-center gap-3.5 hover:text-[#7A2E3A] transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-[#A17F72] stroke-[2]" />
                  <span>support@alqora.com</span>
                </div>
                <div className="flex items-center gap-3.5 hover:text-[#7A2E3A] transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-[#A17F72] stroke-[2]" />
                  <span>+91 90001 00088</span>
                </div>
                <div className="flex items-center gap-3.5 hover:text-[#7A2E3A] transition-colors cursor-pointer">
                  <Globe className="w-4 h-4 text-[#A17F72] stroke-[2]" />
                  <span>www.alqora.com</span>
                </div>
                <div className="flex items-center gap-3.5 hover:text-[#7A2E3A] transition-colors cursor-pointer">
                  <InstagramIcon className="w-4 h-4 text-[#A17F72]" />
                  <span>@alqorabeauty</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 lg:pl-10">
              <button className="flex-1 lg:flex-none h-12 px-8 rounded-full border border-[#1C1412]/20 text-xs font-bold tracking-widest uppercase hover:bg-[#1C1412] hover:text-white transition-all duration-300">
                Change Logo
              </button>
              <button className="flex-1 lg:flex-none h-12 px-8 rounded-full bg-[#7A2E3A] hover:bg-[#5C202A] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(122,46,58,0.15)]">
                Edit Brand
              </button>
            </div>
          </div>

          {/* Premium Mini Metrics Integration */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            {[
              { label: "Products", count: "148", icon: Package },
              { label: "Orders", count: "1,240", icon: ShoppingCart },
              { label: "Customers", count: "892", icon: Users },
              { label: "Revenue", count: "₹18.4L", icon: IndianRupee }
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="bg-[#FDFBF9] border border-[#1C1412]/5 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#1C1412]/5 flex items-center justify-center text-[#7A2E3A]">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#A17F72] uppercase tracking-wider">{metric.label}</p>
                    <p className="text-2xl font-serif font-semibold text-[#1C1412] mt-0.5">{metric.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            SECTION 2: STORE EXPERIENCE (HIGH CONTRAST TOGGLES)
            =================================================== */}
        <section className="space-y-4">
          <span className="text-xs font-bold tracking-[0.3em] text-[#7A2E3A] uppercase block">Store Experience</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { key: "wishlist", label: "Wishlist", desc: "Allow customers to save favorites.", icon: Heart },
              { key: "reviews", label: "Product Reviews", desc: "Show customer feedback.", icon: Star },
              { key: "tracking", label: "Order Tracking", desc: "Enable live shipping updates.", icon: MapPin },
              { key: "guestCheckout", label: "Guest Checkout", desc: "Allow buying without profiles.", icon: ShoppingBag },
              { key: "freeShipping", label: "Free Shipping", desc: "Toggle free shipping tier.", icon: Truck }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = storeExperience[item.key as keyof typeof storeExperience];
              return (
                <div
                  key={item.key}
                  onClick={() => {

                    const updated = {
                      ...storeExperience,

                      [item.key]:
                        !isActive,
                    };

                    setStoreExperience(
                      updated
                    );

                    saveSettings(
                      updated,
                      payments
                    );
                  }}
                  className={`bg-white border rounded-[24px] p-6 flex flex-col justify-between items-start h-52 cursor-pointer select-none transition-all duration-300 relative ${isActive ? 'border-[#7A2E3A] shadow-[0_15px_35px_rgba(122,46,58,0.06)]' : 'border-[#1C1412]/15 hover:border-[#1C1412]/30'}`}
                >
                  <div className="w-full space-y-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#7A2E3A]/10 text-[#7A2E3A]' : 'bg-[#FDFBF9] text-[#A17F72] border border-[#1C1412]/5'}`}>
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-base font-bold tracking-tight text-[#1C1412] block">{item.label}</span>
                      <span className="text-xs text-[#1C1412]/70 font-medium block mt-1 leading-tight">{item.desc}</span>
                    </div>
                  </div>

                  <div className="w-full space-y-3 relative z-10">
                    <div className="w-full h-px bg-[#1C1412]/10" />
                    <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold">
                      <span className={isActive ? "text-[#7A2E3A]" : "text-[#A17F72]"}>{isActive ? "Active" : "Disabled"}</span>
                      <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${isActive ? 'bg-[#7A2E3A]' : 'bg-[#1C1412]/10'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            SECTION 3: PAYMENT METHODS & SHIPPING STATUS CARDS
            =================================================== */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Elegant Payment Status Panel */}
            <div className="bg-white border border-[#1C1412]/10 rounded-[32px] p-8 space-y-6 shadow-[0_20px_50px_rgba(28,20,18,0.02)]">
              <div className="flex items-center justify-between border-b border-[#1C1412]/10 pb-4">
                <h3 className="text-2xl font-serif font-normal text-[#1C1412]">Payment Methods</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A17F72]">Status</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "razorpay", label: "Razorpay" },
                  { key: "upi", label: "UPI Payments" },
                  { key: "cards", label: "Credit & Debit Cards" },
                  { key: "cod", label: "Cash On Delivery" }
                ].map((payment) => {
                  const isActive = payments[payment.key as keyof typeof payments];
                  return (
                    <div
                      key={payment.key}
                      onClick={() => {

                        const updated = {
                          ...payments,

                          [payment.key]:
                            !isActive,
                        };

                        setPayments(
                          updated
                        );

                        saveSettings(
                          storeExperience,
                          updated
                        );
                      }}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${isActive ? 'border-[#7A2E3A] bg-[#7A2E3A]/[0.02] text-[#1C1412]' : 'border-[#1C1412]/10 bg-gray-50/50 text-[#1C1412]/50 hover:border-[#1C1412]/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                        <span className="text-sm font-bold tracking-tight">{payment.label}</span>
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Parameter Panel */}
            <div className="bg-white border border-[#1C1412]/10 rounded-[32px] p-8 space-y-6 shadow-[0_20px_50px_rgba(28,20,18,0.02)]">
              <div className="flex items-center justify-between border-b border-[#1C1412]/10 pb-4">
                <h3 className="text-2xl font-serif font-normal text-[#1C1412]">Shipping</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A17F72]">Timeline</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Free Shipping Threshold", value: "Orders above ₹4,999" },
                  { label: "Standard Shipping", value: "3 — 5 Business Days" },
                  { label: "Express Shipping", value: "1 — 2 Business Days" }
                ].map((ship, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#FDFBF9] rounded-xl border border-[#1C1412]/5 hover:border-[#7A2E3A]/30 transition-all duration-300">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A17F72]">
                      {ship.label}
                    </span>
                    <span className="text-sm text-[#1C1412] font-bold">{ship.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ===================================================
            SECTION 4: OPERATOR, SECURITY & WORKSPACE UTILITIES
            =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* Admin Profile */}
          <div className="bg-white border border-[#1C1412]/10 rounded-[32px] p-8 flex flex-col justify-between space-y-8 shadow-[0_20px_50px_rgba(28,20,18,0.02)]">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-[0.3em] text-[#7A2E3A] uppercase block">{adminProfile.badge}</span>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#7A2E3A] text-white flex items-center justify-center font-serif text-xl font-medium shadow-md">
                  AA
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C1412]">{adminProfile.name}</h3>
                  <p className="text-sm text-[#A17F72] font-medium">{adminProfile.email}</p>
                  <p className="text-xs text-[#7A2E3A] font-bold uppercase tracking-widest mt-0.5">Store Owner</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() =>
                  setEditOpen(true)
                }
                className="h-11 text-xs font-bold tracking-wider uppercase rounded-full border border-[#1C1412]/10 text-[#1C1412] hover:bg-[#1C1412] hover:text-white transition-all duration-300">
                Edit Profile
              </button>
              <button
                onClick={() =>
                  setPasswordOpen(true)
                }
                className="h-11 text-xs font-bold tracking-wider uppercase rounded-full border border-[#1C1412]/10 text-[#1C1412] hover:bg-[#1C1412] hover:text-white transition-all duration-300">
                Password
              </button>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white border border-[#1C1412]/10 rounded-[32px] p-8 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(28,20,18,0.02)]">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-[0.3em] text-[#7A2E3A] uppercase block">Session Management</span>
              <p className="text-sm text-[#1C1412] font-semibold">
                You are currently signed in as Administrator.
              </p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
                className="w-full h-12 text-xs font-bold tracking-wider uppercase rounded-full bg-[#7A2E3A] text-white hover:bg-[#5C202A] transition-all duration-300 shadow-[0_10px_35px_rgba(122,46,58,0.15)] flex items-center justify-center gap-2"
              >
                <span>Sign Out</span>
                <LogOut className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full h-11 text-xs font-bold tracking-wider uppercase rounded-full border border-[#1C1412]/10 text-[#A17F72] hover:bg-[#FDFBF9] hover:text-[#1C1412] transition-all duration-300"
              >
                Return To Store
              </button>
            </div>
          </div>

          {/* Clean Ledger Exports */}
          <div className="bg-white border border-[#1C1412]/10 rounded-[32px] p-8 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(28,20,18,0.02)]">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-[0.3em] text-[#7A2E3A] uppercase block">Exports</span>
              <p className="text-sm text-[#A17F72] font-medium leading-relaxed">
                Download copies of your business reports for accounting records.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Customers", target: "Customers" },
                { label: "Orders", target: "Orders" },
                { label: "Revenue", target: "Revenue" }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {

                    if (
                      action.target ===
                      "Customers"
                    ) {

                      handleExportCustomers();

                      return;
                    }

                    if (
                      action.target ===
                      "Orders"
                    ) {

                      handleExportOrders();

                      return;
                    }

                    if (
                      action.target ===
                      "Revenue"
                    ) {

                      handleExportRevenue();

                      return;
                    }


                  }}
                  className="w-full h-11 px-4 text-xs font-bold text-[#1C1412]/90 rounded-xl bg-[#FDFBF9] border border-[#1C1412]/10 hover:border-[#7A2E3A]/40 hover:text-[#1C1412] flex items-center justify-between transition-all duration-300 group"
                >
                  <span>Export {action.label}</span>
                  <Download className="w-3.5 h-3.5 text-[#A17F72] group-hover:translate-y-0.5 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ===================================================
            RESTRICTED ATELIER FOOTER TOOLS
            =================================================== */}
        <footer className="border-t border-[#1C1412]/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <p className="text-[#A17F72] font-semibold font-mono tracking-wider">ALQORA HQ PANEL • v2.6.0</p>
          <div className="flex gap-8 text-[11px] font-bold tracking-wider uppercase text-[#A17F72]">
            <button
              onClick={() => { setDangerAction("Clear System Cache"); setShowDangerModal(true); }}
              className="hover:text-[#1C1412] transition-colors duration-300"
            >
              Clear Cache
            </button>
            <button
              onClick={() => { setDangerAction("Delete Dashboard Test Data"); setShowDangerModal(true); }}
              className="hover:text-rose-700 transition-colors duration-300"
            >
              Delete Test Orders
            </button>
          </div>
        </footer>

      </div>

      {/* ===================================================
          PREMIUM LIGHT VALIDATION MODAL
          =================================================== */}
      <AnimatePresence>
        {showDangerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDangerModal(false)}
              className="absolute inset-0 bg-[#1C1412]/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              className="bg-white border border-[#1C1412]/10 rounded-[28px] max-w-sm w-full p-8 shadow-[0_30px_70px_rgba(28,20,18,0.15)] space-y-6 relative z-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center mx-auto border border-rose-100">
                <AlertCircle className="w-5 h-5 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif text-[#1C1412] font-normal">Confirm Action</h3>
                <p className="text-xs text-[#A17F72] font-medium leading-relaxed">
                  Are you certain you want to execute <span className="font-bold text-[#1C1412]">"{dangerAction}"</span>? This cannot be undone.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold tracking-wider uppercase pt-2">
                <button
                  onClick={() => setShowDangerModal(false)}
                  className="h-11 rounded-full border border-[#1C1412]/15 hover:bg-[#FDFBF9] transition-all duration-300 text-[#1C1412]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success(
                      `${dangerAction} completed successfully.`
                    ); setShowDangerModal(false);
                  }}
                  className="h-11 rounded-full bg-rose-700 text-white hover:bg-rose-800 transition-all duration-300 shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      <EditProfileModal

        isOpen={editOpen}

        onClose={() =>
          setEditOpen(false)
        }

        profile={adminProfile}

        onSave={handleProfileSave}

      />


      <ChangePasswordModal

        isOpen={passwordOpen}

        onClose={() =>
          setPasswordOpen(false)
        }

        onSave={
          handlePasswordChange
        }

      />
    </div>
  );
}