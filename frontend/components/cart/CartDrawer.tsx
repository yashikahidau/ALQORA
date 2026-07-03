"use client";

import { useCart } from "@/context/CartContext";
import { CartItem } from "./CartItem";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
}: Props) {

  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const safeCart = cart.filter(
  (item) =>
    item &&
    item.product &&
    item.product._id &&
    item.product.price !== undefined &&
    item.quantity > 0
);

  const router = useRouter();

  const { user } = useAuth();

  const {
    guestCheckout,
  } = useStoreSettings();


  // LOCK BODY SCROLL WHEN DRAWER IS OPEN
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);


  return (

    <AnimatePresence>

      {isOpen && (

        <>

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[9998]
              bg-black/20
              backdrop-blur-md
            "
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 120,
            }}
            className="
              fixed
              right-0
              top-0
              z-[9999]
              h-screen
              w-full
              sm:w-[520px]
              bg-[#F8F1EB]
              border-l
              border-[#E7D8CF]
              overflow-hidden
            "
          >

            {/* SOFT GLOW */}
            <div
              className="
                absolute
                top-0
                right-0
                h-[320px]
                w-[320px]
                rounded-full
                bg-[#E8C9B8]/20
                blur-[120px]
              "
            />

            {/* CONTENT */}
            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                px-7
                md:px-10
                pt-10
                pb-8
              "
            >

              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-[#E7D8CF] pb-8">

                <div>

                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.35em]
                      text-[#A17F72]
                    "
                  >
                    Shopping Cart
                  </span>

                  <h2
                    className="
                      mt-3
                      text-[42px]
                      leading-none
                      tracking-[-0.05em]
                      text-[#2D211D]
                    "
                  >
                    Your Bag
                  </h2>

                </div>

                {/* CLOSE BUTTON */}
                <button
                  onClick={onClose}
                  className="
                    group
                    h-[48px]
                    w-[48px]
                    rounded-full
                    border
                    border-[#E5D5CB]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-500
                    hover:bg-[#7A2E3A]
                    hover:text-white
                    hover:rotate-90
                  "
                >

                  <X
                    size={18}
                    className="
                      transition-all
                      duration-500
                    "
                  />

                </button>

              </div>

              {/* EMPTY STATE */}
              {safeCart.length === 0 && (

                <div
                  className="
                    relative
                    flex
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    text-center
                    overflow-hidden
                  "
                >

                  {/* PREMIUM GLOW */}
                  <div
                    className="
                      absolute
                      h-[320px]
                      w-[320px]
                      rounded-full
                      bg-[#E8C9B8]/20
                      blur-[100px]
                    "
                  />

                  {/* ICON */}
                  <div
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      justify-center
                      h-[120px]
                      w-[120px]
                      rounded-full
                      border
                      border-[#E6D6CC]
                      bg-white/30
                      backdrop-blur-md
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        h-[54px]
                        w-[54px]
                        rounded-full
                        bg-[#F6EEEA]
                      "
                    >

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8A6E63"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2l3 4" />
                        <path d="M18 2l-3 4" />
                        <path d="M3 7h18" />
                        <path d="M5 7l1 13h12l1-13" />
                      </svg>

                    </div>

                  </div>

                  {/* TEXT */}
                  <div className="relative z-10 mt-12">

                    <span
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.38em]
                        text-[#A17F72]
                      "
                    >
                      Curated Beauty Essentials
                    </span>

                    <h3
                      className="
                        mt-5
                        text-[54px]
                        leading-[0.92]
                        tracking-[-0.06em]
                        text-[#2D211D]
                      "
                    >
                      Cart Empty
                    </h3>

                    <p
                      className="
                        mt-6
                        max-w-[310px]
                        text-[15px]
                        leading-[2]
                        text-[#8E7468]
                      "
                    >
                      Your curated beauty essentials
                      will appear here once added.
                    </p>

                    {/* CONTINUE SHOPPING */}
                    <button
                      onClick={onClose}
                      className="
                        group
                        relative
                        mt-10
                        h-[62px]
                        overflow-hidden
                        rounded-full
                        bg-[#7A2E3A]
                        px-12
                        transition-all
                        duration-500
                        hover:scale-[1.03]
                        hover:shadow-[0_10px_35px_rgba(122,46,58,0.22)]
                      "
                    >

                      {/* SHIMMER */}
                      <div
                        className="
                          absolute
                          inset-0
                          opacity-0
                          transition-opacity
                          duration-700
                          group-hover:opacity-100
                          bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)]
                        "
                      />

                      <span
                        className="
                          relative
                          z-10
                          text-[11px]
                          uppercase
                          tracking-[0.35em]
                          text-white
                        "
                      >
                        Continue Shopping
                      </span>

                    </button>

                  </div>

                </div>

              )}

              {/* CART ITEMS */}
              {safeCart.length > 0 && (

                <>

                  {/* ITEMS */}
                  <div
                    className="
                      flex-1
                      overflow-y-auto
                      py-8
                      space-y-8

                      [scrollbar-width:none]
                      [-ms-overflow-style:none]

                      [&::-webkit-scrollbar]:hidden
                    "
                  >

                    {safeCart.map((item) => (

                      <CartItem
                        key={item.product._id}
                        item={item}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                      />

                    ))}

                  </div>

                  {/* FOOTER */}
                  <div className="border-t border-[#E7D8CF] pt-8">

                    <div className="flex items-center justify-between">

                      <span
                        className="
                          text-[12px]
                          uppercase
                          tracking-[0.35em]
                          text-[#A17F72]
                        "
                      >
                        Total ({totalItems})
                      </span>

                      <span
                        className="
    text-[28px]
    tracking-[-0.04em]
    text-[#2D211D]
  "
                      >
                        ₹
                        {totalPrice.toLocaleString("en-IN")}
                      </span>

                    </div>

                    {/* CHECKOUT */}
                    <button
                      onClick={() => {

                        onClose();

                        setTimeout(() => {

                          if (
                            !guestCheckout &&
                            !user
                          ) {

                            toast.info(
                              "Please login to continue checkout."
                            );

                            router.push("/login");

                            return;

                          }

                          router.push("/checkout");

                        }, 300);

                      }}
                      className="
                        group
                        relative
                        mt-8
                        h-[62px]
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-[#7A2E3A]
                        text-white
                      "
                    >

                      {/* SHIMMER */}
                      <div
                        className="
                          absolute
                          inset-0
                          opacity-0
                          transition-opacity
                          duration-700
                          group-hover:opacity-100
                          bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)]
                        "
                      />

                      <span
                        className="
                          relative
                          z-10
                          text-[11px]
                          uppercase
                          tracking-[0.35em]
                        "
                      >
                        Proceed To Checkout
                      </span>

                    </button>

                    {/* CONTINUE SHOPPING */}
                    <button
                      onClick={onClose}
                      className="
                        mt-4
                        w-full
                        text-center
                        text-[10px]
                        uppercase
                        tracking-[0.35em]
                        text-[#8E7468]
                        transition-all
                        duration-300
                        hover:text-[#7A2E3A]
                      "
                    >
                      Continue Shopping
                    </button>

                    {/* CLEAR */}
                    <button
                      onClick={clearCart}
                      className="
                        mt-4
                        w-full
                        text-center
                        text-[10px]
                        uppercase
                        tracking-[0.35em]
                        text-[#A17F72]
                        transition-all
                        duration-300
                        hover:text-[#7A2E3A]
                      "
                    >
                      Clear Cart
                    </button>

                  </div>

                </>

              )}

            </div>

          </motion.div>

        </>

      )}

    </AnimatePresence>

  );
}