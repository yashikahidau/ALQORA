"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/orderApi";
import { createRazorpayOrder } from "@/lib/paymentApi";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user } = useAuth();
  const {
    cart,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();
  const router = useRouter();

  const {
    codEnabled,
  } = useStoreSettings();

  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  // Track selected payment method for a better interactive UI experience
  const [paymentMethod, setPaymentMethod] = useState("card");

  const paymentMethods = [

    {
      id: "card",
      label: "Credit / Debit Card",
    },

    {
      id: "upi",
      label: "UPI / NetBanking",
    },

    ...(codEnabled
      ? [
        {
          id: "cod",
          label: "Cash On Delivery",
        },
      ]
      : []),

  ];

  useEffect(() => {
    if (
      !codEnabled &&
      paymentMethod === "cod"
    ) {
      setPaymentMethod("card");
    }
  }, [codEnabled, paymentMethod]);

  const handleRazorpayPayment = async () => {

    try {
      const razorpayOrder =
        await createRazorpayOrder(
          totalPrice
        );

      if (!razorpayOrder.success) {
        toast.error("Failed to initialize payment.");

        return;
      }

      const options = {

        key:
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount:
          razorpayOrder.order.amount,

        currency:
          "INR",

        name:
          "ALQORA",

        description:
          "Luxury Beauty Order",

        order_id:
          razorpayOrder.order.id,

        handler: async function (
          response: any
        ) {

          const products = cart.map(
            (item) => ({
              productId:
                item.product._id,

              name:
                item.product.name,

              image_link:
                item.product.image_link,

              price:
                item.product.price,

              quantity:
                item.quantity,
            })
          );

          const orderResponse =
            await createOrder(
              products,
              totalPrice,
              {
                fullName,
                phone,
                address,
              },
              "razorpay",
              "Paid",

              response.razorpay_payment_id,
              response.razorpay_order_id
            );

          if (orderResponse.success) {

            clearCart();

            toast.success("Payment completed successfully!");

            router.push(
              "/account/orders"
            );

          } else {

            toast.error(
              "Payment succeeded, but the order could not be created."
            );
          }
        },


        theme: {
          color:
            "#7A2E3A",
        },
      };

      const razorpay =
        new (window as any
        ).Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error("Payment failed. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {

    if (
      !fullName ||
      !phone ||
      !address
    ) {
      toast.warning(
        "Please complete all delivery details."
      );

      return;
    }

    if (paymentMethod !== "cod") {
      await handleRazorpayPayment();
      return;
    }

    try {

      const products = cart.map(
        (item) => ({
          productId:
            item.product._id,

          name:
            item.product.name,

          image_link:
            item.product.image_link,

          price:
            item.product.price,

          quantity:
            item.quantity,
        })
      );

      const response =
        await createOrder(
          products,
          totalPrice,
          {
            fullName,
            phone,
            address,
          },
          paymentMethod,
          paymentMethod === "cod"
            ? "Pending"
            : "Paid"
        );

      if (response.success) {
        clearCart();

        toast.success(
          "Order placed successfully!"
        );


        router.push(
          "/account"
        );
      } else {
        toast.error(
          response.error || "Failed to place order."
        );
      }
    } catch {
      toast.error(
        "Failed to place order. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F1EB] text-[#2D211D] antialiased">

      {/* HERO HEADER */}
      <header className="pt-32 pb-6 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-medium">
            Secure Checkout
          </span>
          <h1 className="mt-3 text-[56px] md:text-[84px] font-light leading-[0.95] tracking-tight text-[#2D211D]">
            Checkout
          </h1>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <section className="px-6 md:px-12 lg:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_440px] gap-12 items-start">

          {/* LEFT FORM FIELDS */}
          <div className="space-y-6">

            {/* CONTACT */}
            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/40 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-[22px] font-light tracking-wide">Contact Details</h2>
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

            {/* DELIVERY */}
            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/40 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-[22px] font-light tracking-wide">Delivery Address</h2>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E7468] block mb-2 pl-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    placeholder="e.g. David Brooks"
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
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="+1 (555) 000-0000"
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
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="Apartment, suite, unit, or street number"
                  className="w-full h-[58px] rounded-full border border-[#E4D3C8] bg-white/80 px-6 outline-none transition focus:border-[#A17F72] placeholder-[#BCA397] text-sm"
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/40 backdrop-blur-xl p-6 md:p-8">
              <h2 className="text-[22px] font-light tracking-wide">Payment Method</h2>

              <div className="mt-5 space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-4 px-6 h-[58px] rounded-full border cursor-pointer transition backend-card ${paymentMethod === method.id
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
                    <span className="text-sm tracking-wide">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handlePlaceOrder}
              className="group relative h-[64px] w-full overflow-hidden rounded-full bg-[#7A2E3A] text-white transition-transform active:scale-[0.99] shadow-lg shadow-[#7A2E3A]/10"
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)]"
              />
              <span className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.4em]">
                Place Order
              </span>
            </button>

          </div>

          {/* RIGHT SIDEBAR ORDER SUMMARY */}
          <aside className="h-fit lg:sticky lg:top-32">
            <div className="rounded-[28px] border border-[#E7D8CF] bg-white/60 backdrop-blur-xl p-6 md:p-8">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-semibold block mb-6">
                Order Summary
              </span>

              {/* PRODUCTS LIST */}
              <div className="max-h-[320px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-4 pb-4 border-b border-[#E7D8CF]/50 last:border-none last:pb-0">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-[#E7D8CF]/60">
                      <Image
                        src={item.product.image_link}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="mt-0.5 text-xs text-[#8E7468]">Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CALCULATION TOTALS */}
              <div className="mt-6 border-t border-[#E7D8CF] pt-6 space-y-3 text-sm text-[#8E7468]">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span className="text-[#2D211D] font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium tracking-wide uppercase text-xs">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-[#E7D8CF]/60 mt-4">
                  <span className="text-base text-[#2D211D]">Total Amount</span>
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