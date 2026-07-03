"use client";

import { useState } from "react";

import { Product } from "@/lib/products";

import { AddToCartButton } from "./AddToCartButton";
import { BuyNowButton } from "./BuyNowButton";
import { WishlistButton } from "./WishlistButton";
import { useStoreSettings } from "@/context/StoreSettingsContext";

interface Props {
  product: Product;
}

export function ProductActions({
  product,
}: Props) {

  const [quantity, setQuantity] =
    useState(1);
const {
  wishlistEnabled,
} = useStoreSettings();
  return (

    <div className="mt-16">

      {/* QUANTITY */}

      <div
        className="
          flex
          items-center
          gap-4
          mb-8
        "
      >

        <button
          onClick={() =>
            setQuantity(
              Math.max(
                1,
                quantity - 1
              )
            )
          }
          className="
            w-10
            h-10
            rounded-full
            border
            border-[#D6B5A7]
          "
        >
          -
        </button>

        <span
          className="
            min-w-[40px]
            text-center
          "
        >
          {quantity}
        </span>

        <button
          onClick={() =>
            setQuantity(
              Math.min(
                product.stock,
                quantity + 1
              )
            )
          }
          className="
            w-10
            h-10
            rounded-full
            border
            border-[#D6B5A7]
          "
        >
          +
        </button>

      </div>

      <div
        className="
          flex
          flex-wrap
          gap-4
          items-center
        "
      >

        <AddToCartButton
          product={product}
          quantity={quantity}
        />

        <BuyNowButton
          product={product}
          quantity={quantity}
        />

        {wishlistEnabled && (

  <WishlistButton
    product={product}
  />

)}

      </div>

    </div>
  );
}