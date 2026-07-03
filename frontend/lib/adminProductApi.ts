import { protectedFetch } from "./protectedFetch";

export const deleteProduct = async (
  productId: string
) => {
  return protectedFetch(`/products/${productId}`, {
    method: "DELETE",
  });
};

export const updateProduct = async (
  productId: string,
  productData: any
) => {
  return protectedFetch(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};