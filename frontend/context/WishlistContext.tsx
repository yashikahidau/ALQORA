"use client";
import { Product } from "@/lib/products";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
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

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {

     const [isWishlistReady, setIsWishlistReady] = useState(false);

     useEffect(() => {
          setIsWishlistReady(true);
     }, []);
     const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>("wishlist", []);

     //add function
     const addToWishlist = (
          product: Product
     ) => {
          setWishlist(prevWishlist => {
               const existingItem = prevWishlist.some(
                    item =>
                         item.product._id === product._id
               );

               if (existingItem) {
                    return prevWishlist;
               }
               return [
                    ...prevWishlist,
                    { product }
               ];
          })
     };

     //remove function
     const removeFromWishlist = (productId: string) => {
          setWishlist(prevWishlist => prevWishlist.filter(item => item.product._id !== productId));
     }

     //clear cart function
     const clearWishlist = () => {
          setWishlist([]);
     }

     //calculate total items
     const totalWishlistItems = wishlist.length;

     const isWishlisted = (
          productId: string
     ) => {
          return wishlist.some(item => item.product._id === productId);
     }

     return (
          <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist, isWishlisted, totalWishlistItems, isWishlistReady }}>
               {children}
          </WishlistContext.Provider>

     )
}


//custom hook 
export const useWishlist = () => {
     const context = useContext(WishlistContext);
     if (!context) {
          throw new Error("useWishlist must be used within a WishlistProvider");
     }
     return context
}
