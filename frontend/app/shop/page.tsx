"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const { products, loading, error, retry } = useProducts();

  return (
    <main className="relative overflow-hidden bg-[#F8F1EB] min-h-screen">
      
      {/* BACKGROUND AMBIENT BLOBS */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[#E8C9B8]/20 blur-[140px]" />
      <div className="absolute top-[20%] right-0 h-[420px] w-[420px] rounded-full bg-[#7A2E3A]/[0.05] blur-[140px]" />

      {/* CONTENT INNER WRAPPER */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-32 pb-40">

        {/* HERO SECTION */}
        <section className="max-w-[1600px] mx-auto mb-16">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-16 items-end">
            {/* LEFT HERO */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#A17F72]">
                ALQORA BEAUTY
              </span>
              <h1 className="mt-8 max-w-[900px] font-[family:var(--font-cormorant)] text-[74px] sm:text-[100px] xl:text-[150px] leading-[0.82] tracking-[-0.08em] text-[#2D211D]">
                Curated
                <br />
                Beauty
              </h1>
            </div>

            {/* RIGHT HERO TEXT */}
            <div className="xl:pb-8">
              <p className="max-w-sm text-[15px] leading-[2.1] text-[#8E7468]">
                Explore elevated beauty essentials inspired by
                softness, femininity, and editorial luxury.
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCTS DYNAMIC RENDER STATES */}
        <section className="max-w-[1600px] mx-auto">
          {loading && (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-[#8E7468] tracking-[0.25em] uppercase text-xs animate-pulse">
                Loading Products...
              </p>
            </div>
          )}

          {error && (
            <div className="min-h-[400px] flex items-center justify-center px-6">
              <div className="text-center max-w-md">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
                  Connection Issue
                </span>
                <h2 className="mt-6 text-[54px] leading-[0.9] tracking-[-0.06em] text-[#2D211D] font-[family:var(--font-cormorant)]">
                  Something Went Wrong
                </h2>
                <p className="mt-6 text-[#8E7468] leading-[2]">
                  {error}
                </p>
                <button
                  onClick={retry}
                  className="mt-10 h-[54px] px-10 rounded-full bg-[#7A2E3A] text-white uppercase tracking-[0.35em] text-[10px] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <ProductGrid initialProducts={products} />
          )}
        </section>

      </div>
    </main>
  );
}