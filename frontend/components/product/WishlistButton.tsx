"use client";

import { Product } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";

interface Props {
  product: Product;
}

export function WishlistButton({
  product,
}: Props) {

  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useWishlist();

  const saved =
    isWishlisted(product._id);

  const handleClick = () => {

    if (saved) {

      removeFromWishlist(
        product._id
      );

    } else {

      addToWishlist(
        product
      );

    }

  };

  return (

    <button
      onClick={handleClick}
      className="
        h-[56px]
        rounded-full
        border
        border-[#E4D3C8]
        bg-white/60
        px-10
        text-[10px]
        uppercase
        tracking-[0.35em]
        text-[#6B5148]
        backdrop-blur-md
        transition-all
        duration-500
        hover:border-[#7A2E3A]
      "
    >
      {saved
        ? "♥ Saved"
        : "♡ Save Product"}
    </button>

  );

}