"use client";

import { useState } from "react";
import { addReview } from "@/lib/reviewApi";
import { toast } from "sonner";

interface Props {
  productId: string;
}

export default function ReviewForm({
  productId,
}: Props) {

  const [rating, setRating] =
    useState(5);

  const [review, setReview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setLoading(true);

      if(!review.trim()){
        toast.warning(
          "Please enter a review"
        );
        return;
      }

      const response =
        await addReview(
          productId,
          rating,
          review
        );

      if (response.success) {

        toast.success(
          "Review submitted successfully"
        );

        window.location.reload();

      } else {

        toast.error(
          response.error
        );
      }

      setLoading(false);
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mt-10
        bg-white/50
        border
        border-[#D6B5A7]/20
        rounded-[24px]
        p-8
      "
    >

      <h3
        className="
          text-xl
          text-[#2D211D]
          mb-6
        "
      >
        Write A Review
      </h3>

      <div className="mb-5">

        <label
          className="
            block
            mb-2
            text-sm
          "
        >
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(
              Number(
                e.target.value
              )
            )
          }
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        >

          <option value={5}>
            ★★★★★
          </option>

          <option value={4}>
            ★★★★☆
          </option>

          <option value={3}>
            ★★★☆☆
          </option>

          <option value={2}>
            ★★☆☆☆
          </option>

          <option value={1}>
            ★☆☆☆☆
          </option>

        </select>

      </div>

      <div>

        <label
          className="
            block
            mb-2
            text-sm
          "
        >
          Review
        </label>

        <textarea
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
          rows={5}
          required
          className="
            w-full
            border
            rounded-xl
            p-4
            resize-none
          "
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          mt-6
          px-8
          py-4
          rounded-full
          bg-[#7A2E3A]
          text-white
        "
      >
        {loading
          ? "Submitting..."
          : "Submit Review"}
      </button>

    </form>
  );
}