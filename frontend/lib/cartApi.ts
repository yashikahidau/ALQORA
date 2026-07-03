import { protectedFetch } from "./protectedFetch";

// GET CART
export const getCart = async () => {
  return protectedFetch("/cart");
};

// ADD TO CART
export const addToCart = async (
  productId: string,
  quantity: number
) => {
  return protectedFetch("/cart", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
};

// DELETE CART ITEM
export const removeFromCart = async (
  productId: string
) => {
  return protectedFetch(`/cart/${productId}`, {
    method: "DELETE",
  });
};

// UPDATE ITEM QUANTITY
export const updateCartQuantity = async (
  productId: string,
  quantity: number
) => {
  return protectedFetch(`/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
    }),
  });
};

// CLEAR CART
export const clearCart = async () => {
  return protectedFetch("/cart", {
    method: "DELETE",
  });
};