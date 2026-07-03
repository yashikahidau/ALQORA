import { Product } from "./products";
import { API_URL } from "@/lib/config";
//to standardize the responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}


export const getProducts = async (): Promise<ApiResponse<Product[]>> => {

  try {
    const response = await fetch(
      `${API_URL}/products`
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch products",
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data,
    };

  } catch {

    return {
      success: false,
      error: "Backend unavailable",
    };
  }
};

export const getProductById = async (
  id: string
): Promise<ApiResponse<Product | null>> => {

  try {
    const response =
      await fetch(
        `${API_URL}/products/${id}`
      );

    if (!response.ok) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data,
    };
  }

  catch {
    return {
      success: false,
      error: "Backend unavailable",
    };
  }

};