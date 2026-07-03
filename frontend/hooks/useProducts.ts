"use client";

import { useEffect, useState } from "react";

import {
     getProducts,
} from "@/lib/api";

import {
     Product,
} from "@/lib/products";

export function useProducts() {
     const [products, setProducts] = useState<Product[]>([]);

     const [loading, setLoading] =
          useState(true);

     const [error, setError] =
          useState<string | null>(null);

     const fetchProducts = async () => {

  try {

    setLoading(true);

    setError(null);

    const response =
      await getProducts();

    if (
      response.success &&
      response.data
    ) {

      setProducts(
        response.data
      );

    } else {

      setError(
        response.error ??
        "Something went wrong"
      );

    }

  } catch {

    setError(
      "Unexpected error occurred"
    );

  } finally {

    setLoading(false);

  }

};
useEffect(() => {
  fetchProducts();
}, []);

     return {
          products,
          loading,
          error,
          retry: fetchProducts,
     };
}