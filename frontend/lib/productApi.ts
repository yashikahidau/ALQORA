import { protectedFetch } from "./protectedFetch";

export const createProduct = async (
  productData: {
    name: string;
    price: string;
    description: string;
    image_link: string;
    product_type: string;
    stock: number;
    rating: number;
  }
) => {
  return protectedFetch("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};