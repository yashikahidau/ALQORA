"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  quantity?: number;
}

export function BuyNowButton({
  product,
 quantity = 1,
}: Props) {

  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = async () => {

    await addToCart(product, quantity);

    router.push("/checkout");
  };

  return (
    <button
      onClick={handleBuyNow}
      className="
        px-10
        py-4
        rounded-full
        bg-[#7A2E3A]
        text-white
        uppercase
        text-[14px]
        tracking-[0.2em]
        hover:bg-[#5E202B]
        transition-all
      "
    >
      Buy Now
    </button>
  );
}