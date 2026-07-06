"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createOrder } from "@/lib/orderApi";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/paymentApi";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const {
    cart,
    totalPrice,
    totalItems,
    setCartState,
  } = useCart();

  const router = useRouter();
  const { codEnabled } = useStoreSettings();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods = useMemo(
    () => [
      { id: "card", label: "Credit / Debit Card" },
      { id: "upi", label: "UPI / NetBanking" },
      ...(codEnabled ? [{ id: "cod", label: "Cash On Delivery" }] : []),
    ],
    [codEnabled]
  );

  useEffect(() => {
    if (!codEnabled && paymentMethod === "cod") {
      setPaymentMethod("card");
    }
  }, [codEnabled, paymentMethod]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const productsPayload = useMemo(() => {
    return cart.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      image_link: item.product.image_link,
      price: item.product.price,
      quantity: item.quantity,
    }));
  }, [cart]);

  const shippingPayload = useMemo(
    () => ({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    }),
    [fullName, phone, address]
  );

  const validateCheckout = () => {
    if (!user) {
      toast.error("Please login first.");
      return false;
    }

    if (!cart.length) {
      toast.error("Your cart is empty.");
      return false;
    }

    if (
      !shippingPayload.fullName ||
      !shippingPayload.phone ||
      !shippingPayload.address
    ) {
      toast.warning("Please complete all delivery details.");
      return false;
    }

    const digitsOnly = shippingPayload.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      toast.warning("Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  const handleOrderSuccess = async (message: string) => {
    setCartState([]);
    toast.success(message);
    router.push("/account/orders");
    setIsSubmitting(false);
  };

  const handleCODOrder = async () => {
    const response = await createOrder(
      productsPayload,
      totalPrice,
      shippingPayload,
      "cod",
      "Pending"
    );

    if (!response?.success) {
      toast.error(response?.error || "Failed to place order.");
      return false;
    }

    await handleOrderSuccess("Order placed successfully!");
    return true;
  };

  const handleRazorpayPayment = async () => {
    const razorpayOrder = await createRazorpayOrder(totalPrice);

    if (!razorpayOrder?.success || !razorpayOrder?.order) {
      toast.error(razorpayOrder?.error || "Failed to initialize payment.");
      setIsSubmitting(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.order.amount,
      currency: razorpayOrder.order.currency || "INR",
      name: "ALQORA",
      description: "Luxury Beauty Order",
      order_id: razorpayOrder.order.id,
      prefill: {
        name: shippingPayload.fullName || user?.name || "",
        email: user?.email || "",
        contact: shippingPayload.phone || "",
      },
      theme: {
        color: "#7A2E3A",
      },

      handler: async (response: any) => {
        try {
          const verifyResponse = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verifyResponse?.success) {
            toast.error(
              verifyResponse?.error || "Payment verification failed."
            );
            setIsSubmitting(false);
            return;
          }

          const orderResponse = await createOrder(
            productsPayload,
            totalPrice,
            shippingPayload,
            "razorpay",
            "Paid",
            response.razorpay_payment_id,
            response.razorpay_order_id
          );

          if (!orderResponse?.success) {
            toast.error(
              orderResponse?.error ||
              "Payment succeeded, but order creation failed."
            );
            setIsSubmitting(false);
            return;
          }

          await handleOrderSuccess("Payment completed successfully!");
        } catch (error) {
          console.error("RAZORPAY ORDER CREATION ERROR:", error);
          toast.error("Payment succeeded, but order creation failed.");
          setIsSubmitting(false);
        }
      },

      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    if (!validateCheckout()) return;

    try {
      setIsSubmitting(true);

      if (paymentMethod === "cod") {
        const success = await handleCODOrder();
        if (!success) {
          setIsSubmitting(false);
        }
        return;
      }

      await handleRazorpayPayment();
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
      toast.error("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8F1EB] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#A17F72]">
            Loading Checkout
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F1EB] text-[#2D211D] antialiased">
      <header className="pt-32 pb-6 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-medium">
            Secure Checkout
          </span>

          <h1 className="mt-3 text-[44px] sm:text-[52px] md:text-[84px] font-light leading-[0.95] tracking-tight text-[#2D211D]">
            Checkout
          </h1>
        </div>
      </header>

      <section className="px-6 md:px-12 lg:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_440px] gap-12 items-start">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/40 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-[22px] font-light tracking-wide">
                Contact Details
              </h2>

              <div className="mt-5">
                <label className="text-[10px] uppercase tracking-wider text-[#8E7468] block mb-2 pl-2">
                  Account Email
                </label>

                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full h-[58px] rounded-full border border-[#E4D3C8] bg-white/50 px-6 outline-none text-[#2D211D]/70 cursor-not-allowed text-sm"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/40 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-[22px] font-light tracking-wide">
                Delivery Address
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E7468] block mb-2 pl-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Yashika Hidau"
                    className="w-full h-[58px] rounded-full border border-[#E4D3C8] bg-white/80 px-6 outline-none transition focus:border-[#A17F72] placeholder-[#BCA397] text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E7468] block mb-2 pl-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98xxxxxxx"
                    className="w-full h-[58px] rounded-full border border-[#E4D3C8] bg-white/80 px-6 outline-none transition focus:border-[#A17F72] placeholder-[#BCA397] text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[10px] uppercase tracking-wider text-[#8E7468] block mb-2 pl-2">
                  Street Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, street, area, city"
                  className="w-full h-[58px] rounded-full border border-[#E4D3C8] bg-white/80 px-6 outline-none transition focus:border-[#A17F72] placeholder-[#BCA397] text-sm"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/40 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-[22px] font-light tracking-wide">
                Payment Method
              </h2>

              <div className="mt-5 space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    onClick={() =>
                      setPaymentMethod(method.id as "card" | "upi" | "cod")
                    }
                    className={`flex items-center gap-4 px-6 h-[58px] rounded-full border cursor-pointer transition ${paymentMethod === method.id
                        ? "border-[#7A2E3A] bg-[#7A2E3A]/5 font-medium"
                        : "border-[#E4D3C8] bg-white/60 hover:bg-white"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => { }}
                      className="accent-[#7A2E3A] h-4 w-4"
                    />
                    <span className="text-sm tracking-wide">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cart.length === 0}
              className={`group relative h-[64px] w-full overflow-hidden rounded-full text-white transition shadow-lg shadow-[#7A2E3A]/10 ${isSubmitting || cart.length === 0
                  ? "bg-[#7A2E3A]/60 cursor-not-allowed"
                  : "bg-[#7A2E3A] active:scale-[0.99]"
                }`}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)]" />

              <span className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.4em]">
                {isSubmitting ? "Processing..." : "Place Order"}
              </span>
            </button>
          </div>

          <aside className="h-fit lg:sticky lg:top-32">
            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/60 backdrop-blur-xl p-6 md:p-8">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-semibold block mb-6">
                Order Summary
              </span>

              <div className="max-h-[320px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="rounded-2xl border border-[#E7D8CF] bg-white/60 p-5 text-sm text-[#8E7468]">
                    Your cart is empty.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center gap-4 pb-4 border-b border-[#E7D8CF]/50 last:border-none last:pb-0"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-[#E7D8CF]/60">
                        <Image
                          src={item.product.image_link}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#8E7468]">
                          Qty {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm font-medium">
                        ₹
                        {(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 border-t border-[#E7D8CF] pt-6 space-y-3 text-sm text-[#8E7468]">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span className="text-[#2D211D] font-medium">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium tracking-wide uppercase text-xs">
                    Free
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-[#E7D8CF]/60 mt-4">
                  <span className="text-base text-[#2D211D]">
                    Total Amount
                  </span>

                  <span className="text-2xl font-light text-[#2D211D]">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}