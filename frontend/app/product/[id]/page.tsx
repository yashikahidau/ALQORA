
import { getProductById } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/product/ProductActions";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import ReviewForm from "@/components/product/ReviewForm";
import ProductReviews from "@/components/product/ProductReviews";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {

  const { id } = await params;
  const response = await getProductById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const product = response.data;

  const productsResponse = await getProducts();

  const relatedProducts = productsResponse.data
    ?.filter(
      (item: any) =>
        item.product_type === product.product_type &&
        item._id !== product._id
    )
    .slice(0, 4);

  return (
    <main className="relative overflow-hidden bg-[#F8F1EB] min-h-screen selection:bg-[#7A2E3A]/10 selection:text-[#7A2E3A]">

      {/* LUXURY BACKGROUND ARTWORK */}
      <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-[#E8C9B8]/20 blur-[160px] pointer-events-none" />
      <div className="absolute top-[30%] right-0 h-[500px] w-[500px] rounded-full bg-[#7A2E3A]/[0.03] blur-[140px] pointer-events-none" />

      {/* CONTENT INNER CONTAINER */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 xl:px-24 pt-36 pb-40 max-w-[1600px] mx-auto">

        {/* EDITORIAL BREADCRUMBS */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-[#A17F72] font-medium"
        >
          <Link
            href="/"
            className="hover:text-[#7A2E3A] transition-colors duration-300 ease-out"
          >
            Home
          </Link>
          <span className="text-[#D6B5A7]/60 text-[9px]">/</span>
          <Link
            href="/shop"
            className="hover:text-[#7A2E3A] transition-colors duration-300 ease-out"
          >
            Shop
          </Link>
          <span className="text-[#D6B5A7]/60 text-[9px]">/</span>
          <span className="text-[#2D211D] truncate max-w-[200px] font-semibold">
            {product.name}
          </span>
        </nav>

        {/* PRIMARY PRODUCT ROW */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">

          {/* LEFT COLUMN: HERO PREVIEW */}
          <div className="lg:col-span-6 w-full">
            <div className="group relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#F3E9E0] to-[#EBE0D5] aspect-[0.9] w-full flex items-center justify-center transition-all duration-700 ease-out shadow-[0_15px_40px_-20px_rgba(45,33,29,0.06)] hover:shadow-[0_35px_70px_-25px_rgba(122,46,58,0.1)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35)_0%,transparent_75%)] transition-opacity duration-700 group-hover:opacity-60" />
              <div className="relative w-full h-full p-12 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src={product.image_link}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6 drop-shadow-[0_15px_25px_rgba(45,33,29,0.04)]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORE ACTIONS (TYPOGRAPHY BALANCED) */}
          <div className="lg:col-span-6 w-full lg:pl-6 xl:pl-12 flex flex-col justify-center">

            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#A17F72]">
              {product.product_type}
            </span>

            <h1 className="mt-4 font-[family:var(--font-cormorant)] text-[54px] md:text-[76px] xl:text-[88px] leading-[0.85] tracking-[-0.04em] text-[#2D211D] font-light">
              {product.name}
            </h1>


            <div
              className="
    mt-6
    flex
    items-center
    gap-3
  "
            >

              <div
                className="
      text-[#F59E0B]
      text-lg
    "
              >
                {"★★★★★".split("").map((star, index) => (
                  <span
                    key={index}
                    className={
                      index < Math.round(product.averageRating || 0)
                        ? "text-[#F59E0B]"
                        : "text-[#E5D5CA]"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <span
                className="
      text-[#8D7569]
      text-sm
    "
              >
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>

              <span
                className="
      text-[#8D7569]
      text-sm
    "
              >
                ({product.totalReviews || 0} Reviews)
              </span>

            </div>

            <div className="mt-6 flex items-center gap-5">
              <span className="text-2xl font-[family:var(--font-cormorant)] tracking-wide text-[#7A2E3A] font-medium">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <div className="h-[1px] w-16 bg-[#D6B5A7]/60" />

              {/* COMPACT CLEAN STATUS FLAGGING */}
              {product.stock > 10 ? (
                <span className="text-emerald-700 text-[10px] uppercase tracking-[0.2em] font-semibold bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10">
                  In Stock
                </span>
              ) : product.stock > 0 ? (
                <span className="text-amber-700 text-[10px] uppercase tracking-[0.2em] font-semibold bg-amber-500/5 px-2.5 py-0.5 rounded border border-amber-500/10">
                  Only {product.stock} Left
                </span>
              ) : (
                <span className="text-rose-700 text-[10px] uppercase tracking-[0.2em] font-semibold bg-rose-500/5 px-2.5 py-0.5 rounded border border-rose-500/10">
                  Vault Closed — Out of Stock
                </span>
              )}
            </div>

            <p className="mt-8 text-[15px] leading-[1.9] text-[#8D7569] font-light max-w-xl">
              {product.description}
            </p>

            {/* INTEGRATED ACTIONS MODULE */}
            <div className="mt-10 w-full max-w-xl target-quantity-alignment">
              {/* ProductActions hosts the plus/minus buttons, Add to Cart, Buy Now & Save buttons */}
              <ProductActions product={product} />
            </div>

          </div>
        </section>

        {/* DETAILED SERVICE & ARCHIVE GRID (BALANCES THE BOTTOM SPACE) */}
        <section className="mt-28 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[#D6B5A7]/30 pt-16 max-w-[1600px] mx-auto">

          {/* FORMULATION PILLARS */}
          <div className="bg-[#F1E5DC]/30 rounded-[24px] p-8 border border-[#D6B5A7]/20 backdrop-blur-sm">
            <h3 className="text-[11px] uppercase tracking-[0.35em] text-[#7A2E3A] font-bold mb-6 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#7A2E3A]" /> Formulation Pillars
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#8D7569] text-sm font-light">
              <li className="flex items-center gap-3 transition-colors duration-300 hover:text-[#7A2E3A]">
                <span className="text-[#A17F72] text-xs">✦</span> Long Lasting Formula
              </li>
              <li className="flex items-center gap-3 transition-colors duration-300 hover:text-[#7A2E3A]">
                <span className="text-[#A17F72] text-xs">✦</span> Lightweight Texture Feel
              </li>
              <li className="flex items-center gap-3 transition-colors duration-300 hover:text-[#7A2E3A]">
                <span className="text-[#A17F72] text-xs">✦</span> Premium Beauty Essential
              </li>
              <li className="flex items-center gap-3 transition-colors duration-300 hover:text-[#7A2E3A]">
                <span className="text-[#A17F72] text-xs">✦</span> Suitable For Everyday Use
              </li>
            </ul>
          </div>

          {/* ATELIER DELIVERY ADVANTAGES */}
          <div className="bg-[#F1E5DC]/30 rounded-[24px] p-8 border border-[#D6B5A7]/20 backdrop-blur-sm flex flex-col justify-center">
            <h3 className="text-[11px] uppercase tracking-[0.35em] text-[#7A2E3A] font-bold mb-6 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#7A2E3A]" /> Concierge Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#8D7569] text-[13px] font-light">
              <div className="flex items-center gap-3 group">
                <span className="text-[#A17F72] transition-transform duration-300 group-hover:translate-x-0.5">✓</span>
                <span>Free Shipping On All Orders</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="text-[#A17F72] transition-transform duration-300 group-hover:translate-x-0.5">✓</span>
                <span>Secure Encrypted Payments</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="text-[#A17F72] transition-transform duration-300 group-hover:translate-x-0.5">✓</span>
                <span>Luxury Velvet Box Packaging</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="text-[#A17F72] transition-transform duration-300 group-hover:translate-x-0.5">✓</span>
                <span>Delivery: 3–7 Business Days</span>
              </div>
            </div>
          </div>

        </section>

        <section
          className="
    mt-32
    border-t
    border-[#D6B5A7]/20
    pt-20
  "
        >

          <h2
            className="
      text-[42px]
      font-[family:var(--font-cormorant)]
      text-[#2D211D]
    "
          >
            Customer Reviews
          </h2>

          <p
            className="
      mt-3
      text-[#8D7569]
    "
          >
            Real experiences from verified customers.
          </p>

          <div className="mt-10">

            <ProductReviews
              productId={product._id}
            />

            <ReviewForm
              productId={product._id}
            />

          </div>

        </section>

        {/* REFINED RELATED PRODUCTS COMPONENT */}
        {
          relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-36 border-t border-[#D6B5A7]/20 pt-20">
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[38px] md:text-[46px] font-[family:var(--font-cormorant)] text-[#2D211D] font-light tracking-tight">
                      You May Also Like
                    </h2>
                    <p className="mt-2 text-[#8D7569] text-sm font-light tracking-wide">
                      Discover more curated seasonal formulations built for modern sophistication.
                    </p>
                  </div>
                </div>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
                  {relatedProducts?.map((item: any, index: number) => (
                    <div
                      key={item._id}
                      className="transform hover:-translate-y-2 transition-all duration-500 ease-out"
                    >
                      <ProductCard product={item} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

      </div>
    </main>
  );
}