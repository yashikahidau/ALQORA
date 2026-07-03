"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ArrowLeft, Plus } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const { wishlistEnabled } = useStoreSettings();

  if (!wishlistEnabled) {
    router.replace("/shop");
    return null;
  }

  // IMPORTANT: filter out broken/null wishlist entries
  const validWishlist = wishlist.filter(
    (item) =>
      item &&
      item.product &&
      item.product._id &&
      item.product.name &&
      item.product.image_link
  );

  return (
    <ProtectedRoute>
      <main className="relative min-h-screen bg-[#F8F1EB] text-[#1A110E] antialiased selection:bg-[#7A2E3A]/10 selection:text-[#7A2E3A]">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#7A2E3A]/[0.02] blur-[150px] pointer-events-none" />
        <div className="absolute top-[20%] left-0 h-[500px] w-[500px] rounded-full bg-[#1A110E]/[0.01] blur-[130px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto pt-32 pb-36 px-6 sm:px-8 z-10">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-[#1A110E]/60 hover:text-[#7A2E3A] transition-all duration-500 mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.25] transition-transform duration-500 group-hover:-translate-x-2" />
            <span className="relative overflow-hidden block">
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">
                Return to Store
              </span>
              <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#7A2E3A]">
                Return to Store
              </span>
            </span>
          </Link>

          <div className="border-b border-[#1A110E]/5 pb-12 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-[10px] font-semibold tracking-[0.5em] text-[#7A2E3A] uppercase block">
                ALQORA ATELIER — PRIVATE COLECTION
              </span>
              <h1 className="text-[40px] sm:text-[54px] font-serif font-light tracking-tight text-[#1A110E] leading-[1.05]">
                Your <span className="font-serif italic text-[#7A2E3A]">Curated</span> Favorites
              </h1>
            </div>

            <div className="md:max-w-xs">
              <p className="text-xs text-[#1A110E]/60 font-light leading-relaxed tracking-wide border-l border-[#7A2E3A]/30 pl-4">
                A personal sanctuary reserved for signature beauty, rich pigments, and clean formulation rituals. Review your handpicked selections or finalize your acquisition.
              </p>
            </div>
          </div>

          {/* EMPTY STATE */}
          {validWishlist.length === 0 && (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#7A2E3A] to-transparent mb-6" />
              <h2 className="text-xl font-serif font-light tracking-wide text-[#1A110E]">
                Your Wishlist is Empty
              </h2>
              <p className="mt-3 text-xs text-[#1A110E]/50 max-w-xs font-light leading-relaxed tracking-wide">
                No beauty formulations or signature products have been saved to your collection yet.
              </p>
              <Link
                href="/shop"
                className="mt-8 h-11 px-8 border border-[#1A110E] text-[#1A110E] bg-transparent hover:bg-[#7A2E3A] hover:border-[#7A2E3A] hover:text-white inline-flex items-center justify-center text-[10px] font-medium uppercase tracking-[0.3em] transition-all duration-500 ease-out shadow-sm"
              >
                Explore Beauty Essentials
              </Link>
            </div>
          )}

          {/* GRID */}
          {validWishlist.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-16">
                {validWishlist.map((item) => (
                  <div
                    key={item.product._id}
                    className="group flex flex-col relative bg-transparent"
                  >
                    <div className="relative aspect-[3/4] w-full bg-[#EDE0D8] rounded-3xl overflow-hidden transition-all duration-700 ease-out group-hover:shadow-[0_15px_40px_rgba(26,17,14,0.03)]">
                      <Link
                        href={`/product/${item.product._id}`}
                        className="w-full h-full flex items-center justify-center p-10 relative"
                      >
                        <Image
                          src={item.product.image_link}
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain p-6 transition-all duration-1000 ease-out scale-[0.96] group-hover:scale-100"
                          priority
                        />
                      </Link>

                      <button
                        onClick={() => removeFromWishlist(item.product._id)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-[#1A110E]/5 flex items-center justify-center text-[#1A110E]/60 hover:bg-[#7A2E3A] hover:text-white transition-all duration-500 z-10"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.25]" />
                      </button>
                    </div>

                    <div className="mt-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between gap-4 border-b border-[#1A110E]/5 pb-2">
                        <span className="text-[9px] uppercase tracking-[0.4em] font-semibold text-[#7A2E3A]">
                          {item.product.product_type || "Luxury Formula"}
                        </span>
                        <p className="text-xs font-light text-[#1A110E]/80 tracking-wide">
                          ₹{Number(item.product.price || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      <h3 className="mt-3 text-xl tracking-tight text-[#1A110E] font-serif font-medium leading-snug transition-colors duration-500 group-hover:text-[#7A2E3A]">
                        <Link href={`/product/${item.product._id}`} className="block">
                          {item.product.name}
                        </Link>
                      </h3>

                      <div className="mt-2">
                        {item.product.stock > 10 ? (
                          <p className="text-emerald-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                            ● In Stock
                          </p>
                        ) : item.product.stock > 0 ? (
                          <p className="text-amber-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                            ● Only {item.product.stock} Left
                          </p>
                        ) : (
                          <p className="text-rose-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                            ● Out Of Stock
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[1px] bg-[#1A110E]/10 border border-[#1A110E]/10 mt-6 group-hover:border-[#7A2E3A]/30 transition-colors duration-500">
                      <Link
                        href={`/product/${item.product._id}`}
                        className="h-11 bg-[#FBF9F6] hover:bg-[#F5F2ED] text-[#1A110E]/70 hover:text-[#1A110E] text-[10px] font-medium uppercase tracking-[0.25em] flex items-center justify-center transition-all duration-300"
                      >
                        View Product
                      </Link>

                      <button
                        disabled={(item.product.stock || 0) <= 0}
                        onClick={async () => {
                          if ((item.product.stock || 0) <= 0) return;
                          await addToCart(item.product);
                          router.push("/checkout");
                        }}
                        className={`h-11 text-[10px] font-medium uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all duration-500 ${
                          item.product.stock > 0
                            ? "bg-[#1A110E] hover:bg-[#7A2E3A] text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {item.product.stock > 0 && (
                          <Plus className="w-3 h-3 stroke-[1.5]" />
                        )}
                        <span>{item.product.stock > 0 ? "Buy Now" : "Sold Out"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-32 pt-8 border-t border-[#1A110E]/5 flex justify-center">
                <button
                  onClick={clearWishlist}
                  className="group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#1A110E]/40 hover:text-rose-900 transition-all duration-500"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[1.25] transition-transform duration-500 group-hover:rotate-6" />
                  <span className="underline underline-offset-4 decoration-[#1A110E]/10 group-hover:decoration-rose-950/30">
                    Clear Entire Wishlist
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}