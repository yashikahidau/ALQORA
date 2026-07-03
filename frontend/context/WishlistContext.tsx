"use client";

import { Product } from "@/lib/products";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface WishlistItem {
  product: Product;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: string) => boolean;
  totalWishlistItems: number;
  isWishlistReady: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isWishlistReady, setIsWishlistReady] = useState(false);

  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>("wishlist", []);

  useEffect(() => {
    setIsWishlistReady(true);
  }, []);

  // -------------------------------
  // 1) sanitize corrupted wishlist entries
  // -------------------------------
  const safeWishlist = useMemo(() => {
    return (wishlist || []).filter(
      (item) =>
        item &&
        item.product &&
        typeof item.product === "object" &&
        typeof item.product._id === "string" &&
        item.product._id.trim() !== ""
    );
  }, [wishlist]);

  // -------------------------------
  // 2) if corrupted entries exist in localStorage, remove them permanently
  // -------------------------------
  useEffect(() => {
    if (!isWishlistReady) return;

    if (safeWishlist.length !== (wishlist?.length || 0)) {
      setWishlist(safeWishlist);
    }
  }, [isWishlistReady, wishlist, safeWishlist, setWishlist]);

  // -------------------------------
  // add to wishlist
  // -------------------------------
  const addToWishlist = (product: Product) => {
    if (!product || !product._id) return;

    setWishlist((prevWishlist) => {
      const cleanPrev = (prevWishlist || []).filter(
        (item) =>
          item &&
          item.product &&
          typeof item.product._id === "string" &&
          item.product._id.trim() !== ""
      );

      const existingItem = cleanPrev.some(
        (item) => item.product._id === product._id
      );

      if (existingItem) return cleanPrev;

      return [...cleanPrev, { product }];
    });
  };

  // -------------------------------
  // remove from wishlist
  // -------------------------------
  const removeFromWishlist = (productId: string) => {
    if (!productId) return;

    setWishlist((prevWishlist) =>
      (prevWishlist || []).filter(
        (item) => item?.product?._id && item.product._id !== productId
      )
    );
  };

  // -------------------------------
  // clear wishlist
  // -------------------------------
  const clearWishlist = () => {
    setWishlist([]);
  };

  // -------------------------------
  // total items (only valid items)
  // -------------------------------
  const totalWishlistItems = safeWishlist.length;

  // -------------------------------
  // check if wishlisted
  // -------------------------------
  const isWishlisted = (productId: string) => {
    if (!productId) return false;
    return safeWishlist.some((item) => item.product._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: safeWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        totalWishlistItems,
        isWishlistReady,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// custom hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};