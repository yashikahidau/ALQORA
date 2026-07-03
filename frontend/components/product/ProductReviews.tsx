"use client";

import { useEffect, useState } from "react";
import { getProductReviews } from "@/lib/reviewApi";

interface Props {
  productId: string;
}

export default function ProductReviews({
  productId,
}: Props) {

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadReviews =
      async () => {

        const response =
          await getProductReviews(
            productId
          );

        if (response.success) {
          setReviews(
            response.data
          );
        }

        setLoading(false);
      };

    loadReviews();

  }, [productId]);

  if (loading) {
    return (
      <p className="text-[#8D7569]">
        Loading reviews...
      </p>
    );
  }

  return (
    <div className="space-y-6">

      {reviews.length === 0 && (
        <p className="text-[#8D7569]">
          No reviews yet.
        </p>
      )}

      {reviews.map((review) => (

        <div
          key={review._id}
          className="
            bg-white/50
            border
            border-[#D6B5A7]/20
            rounded-[24px]
            p-6
          "
        >

          <div className="flex items-center justify-between">

            <h4 className="font-medium text-[#2D211D]">
              {review.userId.name}
            </h4>

            <p
            className="
              text-xs
              text-[#A17F72
              mt-1
              "
            >
              {
                new Date(
                  review.createdAt
                ).toLocaleDateString()
              }

            </p>

            <div className="text-[#7A2E3A]">
              {"★".repeat(review.rating)}
            </div>

          </div>

          <p
            className="
              mt-3
              text-[#8D7569]
              leading-relaxed
            "
          >
            {review.review}
          </p>

        </div>

      ))}

    </div>
  );
}