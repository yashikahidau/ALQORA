"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  quantity?: number;
}

export function AddToCartButton({
  product,
  quantity = 1,
}: Props) {

  const { addToCart } = useCart();

  return (

    <button
      onClick={() =>
        addToCart(product, quantity)
      }
      className="
        group
        relative
        h-[56px]
        overflow-hidden
        rounded-full
        bg-[#7A2E3A]
        px-10
        text-white
        transition-all
        duration-700
        hover:scale-[1.02]
        hover:shadow-[0_18px_50px_rgba(122,46,58,0.22)]
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

      {/* TEXT */}
      <span
        className="
          relative
          z-10
          text-[10px]
          uppercase
          tracking-[0.35em]
        "
      >
        Add To Cart
      </span>

    </button>

  );
}