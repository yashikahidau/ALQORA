"use client";

import { Product } from "@/lib/products";
import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartQuantity,
  clearCart as clearCartApi,
} from "@/lib/cartApi";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number
  ) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (
    productId: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{
    success: boolean;
    error?: string;
  }>;
  loadCart: () => Promise<void>;
  setCartState: (items: CartItem[]) => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext =
  createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const setCartState = useCallback((items: CartItem[]) => {
    setCart(items);
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        setCart([]);
        return;
      }

      const response = await getCart();

      if (response?.success && Array.isArray(response.data?.items)) {
        const mappedCart = response.data.items
          .map((item: any) => ({
            product: item.productId,
            quantity: item.quantity,
          }))
          .filter(
            (item: any) =>
              item &&
              item.product &&
              item.product._id &&
              item.product.price !== undefined &&
              item.quantity > 0
          );

        setCart(mappedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (
    product: Product,
    quantity = 1
  ) => {
    try {
      const response = await addToCartApi(product._id, quantity);

      if (!response?.success) {
        return {
          success: false,
          error: response?.error || "Failed to add item to cart",
        };
      }

      await loadCart();
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to add item to cart",
      };
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await removeFromCartApi(productId);

      if (!response?.success) {
        return {
          success: false,
          error: response?.error || "Failed to remove item",
        };
      }

      await loadCart();
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to remove item",
      };
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number
  ) => {
    try {
      const response = await updateCartQuantity(productId, quantity);

      if (!response?.success) {
        return {
          success: false,
          error: response?.error || "Failed to update quantity",
        };
      }

      await loadCart();
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to update quantity",
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await clearCartApi();

      if (!response?.success) {
        return {
          success: false,
          error: response?.error || "Failed to clear cart",
        };
      }

      setCart([]);
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to clear cart",
      };
    }
  };

  const safeCart = cart.filter(
    (item) =>
      item &&
      item.product &&
      item.product._id &&
      item.product.price !== undefined &&
      item.quantity > 0
  );

  const totalPrice = safeCart.reduce(
    (total, item) =>
      total + Number(item.product.price || 0) * item.quantity,
    0
  );

  const totalItems = safeCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
        setCartState,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
};