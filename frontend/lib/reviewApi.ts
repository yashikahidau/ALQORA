import { API_URL } from "./config";
import { protectedFetch } from "./protectedFetch";

// GET REVIEWS
export const getProductReviews = async (
  productId: string
) => {
  const response = await fetch(
    `${API_URL}/reviews/${productId}`
  );

  return response.json();
};

// ADD REVIEW
export const addReview = async (
  productId: string,
  rating: number,
  review: string
) => {
  return protectedFetch("/reviews", {
    method: "POST",
    body: JSON.stringify({
      productId,
      rating,
      review,
    }),
  });
};