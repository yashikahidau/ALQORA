"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { API_URL } from "@/lib/config";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({
  product,
  index,
}: ProductCardProps) {

  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useWishlist();

  const { addToCart } = useCart();

  const wishlisted =
    isWishlisted(product._id);
  const {
    wishlistEnabled,
  } = useStoreSettings();

  const [added, setAdded] =
    useState(false);

  const imageUrl =
  product.image_link.startsWith("/uploads")
    ? `${API_URL}${product.image_link}`
    : product.image_link;


  return (
    <Link
      href={`/product/${product._id}`}
      className="group block"
    >
      <article
        className={`
          relative
          ${index % 2 !== 0 ? "xl:translate-y-24" : ""}
        `}
      >

        {/* IMAGE */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[34px]
            bg-[#F1E5DC]
            aspect-[0.82]
          "
        >

          {wishlistEnabled && (

            <button
              onClick={(e) => {

                e.preventDefault();

                if (wishlisted) {

                  removeFromWishlist(
                    product._id
                  );

                } else {

                  addToWishlist(
                    product
                  );

                }

              }}

              className="
      absolute
      top-4
      right-4
      z-20
      w-10
      h-10
      rounded-full
      bg-white/80
      backdrop-blur-md
      border
      border-[#DDCBC1]
      flex
      items-center
      justify-center
      transition-all
      duration-300
      hover:bg-[#7A2E3A]
      hover:text-white
    "
            >

              <Heart
                size={16}
                className={
                  wishlisted
                    ? "fill-[#7A2E3A] text-[#7A2E3A]"
                    : ""
                }
              />

            </button>

          )}

          {/* GLOW */}
          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_top,rgba(122,46,58,0.08),transparent_60%)]
            "
          />

          <img
            src={imageUrl}
            alt={product.name}
            sizes="(max-width:768px) 100vw, 33vw"
            className="
               absolute
  inset-0
  h-full
  w-full
  object-contain
  p-8
  transition-transform
  duration-700
  ease-out
  group-hover:scale-[1.03]
            "
          />

          <div
            className="
          absolute
          inset-x-4
          bottom-4
          opacity-0
          translate-y-4
          group-hover:opacity-100
          group-hover:translate-y-0
          transition-all
          duration-500
          z-20
          "
          >

            <div
              className="
          grid
          grid-cols-2
          overflow-hidden
          rounded-full
          bg-white/95
          backdrop-blur-md
          border
          border-white/70
          shadow-lg
          "
            >

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/product/${product._id}`;
                }}
                className="
    h-11
    flex
    items-center
    justify-center
    text-[10px]
    uppercase
    tracking-[0.25em]
    text-[#2D211D]
    hover:bg-[#F7F3EF]
    transition-colors
    w-full
  "
              >
                View Piece
              </button>

              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (product.stock <= 0) return;

                  try {
                    await addToCart(product);

                    setAdded(true);

                    setTimeout(() => {
                      setAdded(false);
                    }, 1500);

                  } catch (error) {
                    console.error(error);
                  }
                }}

                disabled={product.stock <= 0}
                className={`
    h-11
    flex
    items-center
    justify-center
    text-[10px]
    uppercase
    tracking-[0.25em]
    transition-all

    ${product.stock > 0
                    ? "bg-[#1A110E] text-white hover:bg-[#7A2E3A]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
  `}
              >
                {product.stock <= 0
                  ? "Sold Out"
                  : added
                    ? "Added ✓"
                    : "Add To Bag"}
              </button>

            </div>
          </div>


        </div>

        {/* CONTENT */}
        <div className="pt-8 px-1">

          {/* CATEGORY */}
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.32em]
              text-[#A17D70]
            "
          >
            {product.product_type}
          </span>

          {/* TITLE */}
          <h2
            className="
              mt-4
              max-w-[75%]
              font-[family:var(--font-cormorant)]
              text-[42px]
              leading-[0.9]
              tracking-[-0.05em]
              text-[#2D211D]
            "
          >
            {product.name}
          </h2>


          <div className="mt-4">

            {product.stock > 10 ? (

              <p className="text-green-600 text-[11px] uppercase tracking-[0.15em]">
                ● In Stock
              </p>

            ) : product.stock > 0 ? (

              <p className="text-yellow-600 text-[11px] uppercase tracking-[0.15em]">
                ● Only {product.stock} Left
              </p>

            ) : (

              <p className="text-rose-600 text-[11px] uppercase tracking-[0.15em]">
                ● Sold Out
              </p>

            )}

          </div>

          {/* BOTTOM */}
          <div className="mt-6 flex items-center justify-between">

            <div className="flex items-center gap-5">

              <span
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.28em]
                  text-[#7A2E3A]
                "
              >
               ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              <div className="h-px w-12 bg-[#D6B5A7]" />

            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#DDCBC1]
                text-[#7A2E3A]
                transition-all
                duration-500
                group-hover:-translate-y-1
                group-hover:translate-x-1
              "
            >
              ↗
            </div>

          </div>

        </div>

      </article >
    </Link >
  );
}