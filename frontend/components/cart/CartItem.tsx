"use client";

import { CartItem as CartItemType } from "@/context/CartContext";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

interface Props {
  item: CartItemType;
  removeFromCart: (id: string) => void;
  updateQuantity: (
    id: string,
    quantity: number
  ) => void;
}

export function CartItem({
  item,
  removeFromCart,
  updateQuantity,
}: Props) {

  return (

    <div
      className="
        group
        relative
        flex
        gap-5
        border-b
        border-[#E7D8CF]
        pb-8
      "
    >

      {/* IMAGE */}
      <div
        className="
          relative
          h-[140px]
          w-[110px]
          overflow-hidden
          rounded-[28px]
          bg-[#EFE4DC]
          shrink-0
        "
      >

        <Image
          src={item.product.image_link}
          alt={item.product.name}
          fill
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col">

        {/* TOP */}
        <div className="flex items-start justify-between">

          <div>

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#A17F72]
              "
            >
              {item.product.product_type}
            </span>

            <h3
              className="
                mt-3
                text-[28px]
                leading-[0.95]
                tracking-[-0.05em]
                text-[#2D211D]
              "
            >
              {item.product.name}
            </h3>

          </div>

          <button
            onClick={() =>
              removeFromCart(
                item.product._id
              )
            }
            className="
              transition-all
              duration-300
              hover:rotate-90
              hover:text-[#7A2E3A]
            "
          >
            <X size={16} />
          </button>

        </div>

        {/* BOTTOM */}
        <div className="mt-auto flex items-center justify-between pt-8">

          {/* QUANTITY */}
          <div
            className="
              flex
              items-center
              gap-4
              rounded-full
              border
              border-[#E5D5CB]
              px-4
              h-[42px]
            "
          >

            <button
              onClick={() => {

                if (
                  item.quantity === 1
                ) {
                  removeFromCart(
                    item.product._id
                  );
                } else {
                  updateQuantity(
                    item.product._id,
                    item.quantity - 1
                  );
                }
              }}
              className="
  transition-colors
    duration-300
    hover:text-[#7A2E3A]
"
            >
              <Minus size={14}
                className="
      transition-transform
      duration-300
      hover:scale-125
    "
              />
            </button>

            <span className="text-[14px]">
              {item.quantity}
            </span>

            <button
              disabled={
                item.quantity >= item.product.stock
              }
              onClick={() =>
                updateQuantity(
                  item.product._id,
                  item.quantity + 1
                )
              }
              className={`
  transition-colors
    duration-300

  ${item.quantity >= item.product.stock
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-[#7A2E3A] "
                }
`}
            >
              <Plus size={14}

                className={`
      transition-transform
      duration-300
      ${item.quantity >= item.product.stock
                    ? ""
                    : "hover:scale-125"
                  }
    `}
              />
            </button>

          </div>


          {item.product.stock > 0 &&
            item.quantity >= item.product.stock && (

              <p
                className="
      mt-3
      text-[11px]
      uppercase
      tracking-[0.15em]
      text-[#C27A00]
    "
              >
                Only {item.product.stock} item(s) available
              </p>

            )}

          {/* PRICE */}
          <span
            className="
    text-[15px]
    tracking-[0.08em]
    text-[#7A2E3A]
  "
          >
            ₹
            {(
              Number(item.product.price) *
              item.quantity
            ).toLocaleString("en-IN")}
          </span>

        </div>

      </div>

    </div>
  );
}