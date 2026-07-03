"use client";

import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { useMemo, useState, useRef } from "react";

export function ProductGrid({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Derived unique categories from your product data dynamically
  const PRODUCT_TYPES = useMemo(() => {
    const types = [
      ...new Set(initialProducts.map((p) => p.product_type.trim().toLowerCase())),
    ].sort();
    return types;
  }, [initialProducts]);

  // Combined Search, Category Filtering, and Sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // SEARCH FILTER
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // CATEGORY FILTER
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.product_type.trim().toLowerCase() ===
selectedCategory.trim().toLowerCase()
      );
    }

    // SORTING PRICE FILTER
    if (sortBy === "low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy, initialProducts]);

  return (
    <section>
      {/* LUXURY EDITORIAL FILTERS PANEL */}
      <div className="mb-24 border-b border-[#E8DCD0] pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* LEFT: Combined Minimal Search & Sort Trigger */}
          <div className="flex items-center gap-8 shrink-0">
            {/* Elegant Search bar line */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search beauty essentials"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b border-[#D9C8BD] focus:border-[#7A2E3A] py-2 text-[14px] font-light text-[#2D211D] placeholder:text-[#B19385] focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Micro Structural Divider Line */}
            <div className="h-4 w-[1px] bg-[#E8DCD0] hidden sm:block" />

            {/* Premium Sort Dropdown Trigger Button */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#2D211D] font-medium hover:opacity-60 transition-opacity"
              >
                <span>
                  {sortBy === "default"
                    ? "Sort Price"
                    : sortBy === "low"
                    ? "Low To High"
                    : "High To Low"}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className={`transition-transform duration-500 transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M5 1V9M5 9L2 6M5 9L8 6"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Minimal Sort Menu Overlay */}
              <div
                className={`absolute top-[40px] left-0 w-[220px] overflow-hidden rounded-[20px] border border-[#E6D6CB] bg-[#F8F1EB]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(122,46,58,0.06)] transition-all duration-500 z-50 ${
                  isSortOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-3 pointer-events-none"
                }`}
              >
                <button
                  onClick={() => {
                    setSortBy("low");
                    setIsSortOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 border-b border-[#E7D8CF] transition-colors duration-300 hover:bg-[#7A2E3A] text-[#6B5148] hover:text-white text-[10px] uppercase tracking-[0.25em]"
                >
                  <span>Low To High</span>
                  <span>↗</span>
                </button>
                <button
                  onClick={() => {
                    setSortBy("high");
                    setIsSortOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 transition-colors duration-300 hover:bg-[#7A2E3A] text-[#6B5148] hover:text-white text-[10px] uppercase tracking-[0.25em]"
                >
                  <span>High To Low</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Seamless Linear Horizontal Category Scroller */}
          <div className="relative w-full lg:max-w-[calc(100%-380px)] flex items-center">
            {/* Visual Fade Overlay Gradients for smooth edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#F8F1EB] to-transparent z-10 opacity-0 lg:opacity-100" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F8F1EB] to-transparent z-10" />

            <div
              ref={scrollContainerRef}
              className="flex items-center gap-8 overflow-x-auto py-2 w-full no-scrollbar select-none scroll-smooth"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {/* Webkit scrollbar cleaner hook */}
              <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* ALL ACTION CAP */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-[11px] uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-300 relative py-1 ${
                  selectedCategory === "all"
                    ? "text-[#7A2E3A] font-semibold"
                    : "text-[#8E7468] hover:text-[#2D211D]"
                }`}
              >
                All
                {selectedCategory === "all" && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#7A2E3A]" />
                )}
              </button>

              {/* DYNAMIC CATEGORY ITEMS */}
              {PRODUCT_TYPES.map((type) => {
                const isActive = selectedCategory === type;
                const formattedName = type
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedCategory(type)}
                    className={`text-[11px] uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-300 relative py-1 ${
                      isActive ? "text-[#7A2E3A] font-semibold" : "text-[#8E7468] hover:text-[#2D211D]"
                    }`}
                  >
                    {formattedName}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#7A2E3A]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* EMPTY RENDER STATE */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
            Search Results
          </span>
          <h2 className="mt-6 font-[family:var(--font-cormorant)] text-[56px] md:text-[72px] leading-[0.9] tracking-[-0.06em] text-[#2D211D]">
            No Products Found
          </h2>
          <p className="mt-6 max-w-md text-[#8E7468] leading-[2]">
            We couldn't find any beauty essentials matching your search or selected category.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortBy("default");
            }}
            className="mt-10 h-[56px] px-10 rounded-full bg-[#7A2E3A] text-white text-[10px] uppercase tracking-[0.35em] transition-all duration-500 hover:scale-[1.03]"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* COMPACT CLEAN PRODUCT GRID DISPLAY */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-14 gap-y-40 xl:gap-y-52">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}