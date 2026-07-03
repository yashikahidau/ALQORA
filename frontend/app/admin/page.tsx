"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { uploadImage } from "@/lib/uploadApi";
import { createProduct } from "@/lib/productApi";
import { getProducts } from "@/lib/api";
import { deleteProduct, updateProduct } from "@/lib/adminProductApi";
import EditProductModal from "@/components/admin/EditProductModal";
import { useRouter } from "next/navigation";

// Luxury Toast Notification Type Interface
interface LuxuryToast {
  id: number;
  message: string;
  type: "success" | "error" | "delete";
}

export default function AdminPage() {
  const { user } = useAuth();

  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  // Luxury Toasts System State
  const [toasts, setToasts] = useState<LuxuryToast[]>([]);


  // Trigger Notification Handler
  const showToast = (message: string, type: "success" | "error" | "delete" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const loadProducts = async () => {
    const response = await getProducts();
    if (response.success && response.data) {
      setProducts(response.data);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle local memory cleanup for preview URLs
  const handleImageChange = (file: File | null) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!image) {
        showToast("Please select a product image", "error");
        return;
      }

      setLoading(true);

      // STEP 1: Upload Imagery
      const uploadResponse = await uploadImage(image);

      if (!uploadResponse.success) {
        showToast(uploadResponse.error || "Upload Failed", "error");
        return;
      }

      // STEP 2: Structural URL mapping
      const imageUrl = uploadResponse.imageUrl;

      // STEP 3: API Request Dispatch
      const productResponse = await createProduct({
        name,
        price,
        description,
        image_link: imageUrl,
        product_type: productType,
        stock: Number(stock),
        rating: 5,
      });

      if (productResponse.success) {
        await loadProducts();
        showToast("Product Created", "success");

        // Clear states cleanly
        setName("");
        setPrice("");
        setDescription("");
        setProductType("");
        setStock("");
        setImage(null);
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
          setImagePreviewUrl(null);
        }
      } else {
        showToast(productResponse.error || "Creation failed", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    // Elegant, seamless custom check sequence
    const confirmed = window.confirm("Delete this product permanently?");
    if (!confirmed) return;

    const response = await deleteProduct(productId);

    if (response.success) {
      await loadProducts();
      showToast("Product Deleted", "delete");
    } else {
      showToast(response.error || "Unable to delete", "error");
    }
  };

  const handleEditProduct =
    (product: any) => {

      setSelectedProduct(product);

      setIsEditOpen(true);
    };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop mechanics
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };


  const handleSaveProduct =
    async (
      updatedProduct: any,
      selectedImage?: File | null
    ) => {

      let imageUrl =
        updatedProduct.image_link;

      if (selectedImage) {

        const uploadResponse =
          await uploadImage(selectedImage);

        if (!uploadResponse.success) {

          showToast(
            "Image upload failed",
            "error"
          );

          return;

        }

        imageUrl =
          uploadResponse.imageUrl;

      }

      const response =
        await updateProduct(
          updatedProduct._id,
          {
            ...updatedProduct,
            image_link: imageUrl,
          }
        );

      if (response.success) {

        await loadProducts();

        showToast(
          "Product Updated",
          "success"
        )

        setIsEditOpen(false);

      } else {

        showToast(
          response.error,
          "error"
        );

      }

    };

  // Access Denied Screen (Styled to match the brand)
  if (user?.role !== "admin") {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#F8F1EB] px-6">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[#E8C9B8]/30 blur-[140px]" />
        <div className="relative z-10 max-w-md w-full rounded-[32px] border border-[#E4D5CC] bg-white/60 p-10 text-center backdrop-blur-xl shadow-xl shadow-[#2D211D]/5">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#7A2E3A] font-semibold">SECURITY ERROR</span>
          <h1 className="mt-4 font-[family:var(--font-cormorant)] text-4xl font-light text-[#2D211D] leading-tight">Access Denied</h1>
          <p className="mt-4 text-sm text-[#A17F72] leading-relaxed">
            You do not have the necessary administrative credentials to access the Alqora Product Studio.
          </p>
          <button className="mt-8 w-full h-[52px] rounded-full bg-[#2D211D] text-white text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-[#7A2E3A]">
            Return to Store
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-[#F8F1EB] min-h-screen text-[#2D211D]">

      {/* GLOBAL TOAST LAYER — Premium Center-Top Dropdown */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full px-6 items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-4 px-8 py-3.5 rounded-full shadow-xl border backdrop-blur-xl transition-all duration-500 bg-white/95 text-center whitespace-nowrap animate-fade-in
        ${toast.type === "success" ? "border-[#E4D5CC] text-[#2D211D]" : ""}
        ${toast.type === "delete" ? "border-[#7A2E3A]/20 text-[#7A2E3A]" : ""}
        ${toast.type === "error" ? "border-red-200 text-red-800 bg-red-50/95" : ""}`}
          >
            {toast.type === "success" && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">✓</span>
            )}
            {toast.type === "delete" && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7A2E3A]/10 text-[#7A2E3A] text-xs font-semibold">✓</span>
            )}
            {toast.type === "error" && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">✕</span>
            )}
            <p className="text-[11px] uppercase tracking-[0.25em] font-medium leading-none">{toast.message}</p>
          </div>
        ))}
      </div>
      {/* LUXURY BACKGROUND BLOB AMBIENCE */}
      <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-[#E8C9B8]/40 blur-[160px] pointer-events-none" />
      <div className="absolute top-[20%] right-0 h-[520px] w-[520px] rounded-full bg-[#7A2E3A]/[0.07] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-[30%] h-[400px] w-[400px] rounded-full bg-[#A17F72]/[0.1] blur-[130px] pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-28 pb-32">

        {/* EDITORIAL HEADER */}
        <header className="max-w-[1500px] mx-auto border-b border-[#E4D5CC]/60 pb-12">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#A17F72]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#A17F72] font-medium">
              ALQORA MANAGEMENT SUITE
            </span>
          </div>

          <h1 className="mt-6 font-[family:var(--font-cormorant)] text-[68px] sm:text-[90px] md:text-[115px] leading-[0.85] tracking-[-0.06em] font-light">
            Product <br />
            <span className="italic text-[#7A2E3A]">Studio</span>
          </h1>
        </header>

        {/* MAIN WORKSPACE GRID */}
        <section className="mt-16 max-w-[1500px] mx-auto grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-start">

          {/* PRODUCT CREATION FORM */}
          <div className="rounded-[40px] border border-[#E4D5CC] bg-white/40 backdrop-blur-xl p-8 md:p-12 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-semibold">
                N° 01 // INVENTORY CREATION
              </span>
              <div className="h-2 w-2 rounded-full bg-[#7A2E3A] animate-pulse" />
            </div>

            <h2 className="mt-4 text-[38px] md:text-[46px] leading-[1] tracking-[-0.04em] font-light font-[family:var(--font-cormorant)]">
              Add New Beauty Item
            </h2>

            <form onSubmit={(e) => e.preventDefault()} className="mt-10 grid gap-6">

              {/* Product Name Input */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[62px] rounded-full border border-[#E5D5CB] bg-white/70 px-7 outline-none transition-all duration-300 focus:border-[#7A2E3A] focus:bg-white focus:shadow-md focus:shadow-[#7A2E3A]/5 placeholder-[#A17F72]/60"
                />
              </div>

              {/* Price, Stock & Type */}
              <div className="grid md:grid-cols-3 gap-6">

                <input
                  type="text"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-[62px] rounded-full border border-[#E5D5CB] bg-white/70 px-7 outline-none"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full h-[62px] rounded-full border border-[#E5D5CB] bg-white/70 px-7 outline-none"
                />

                <input
                  type="text"
                  placeholder="Product Type"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full h-[62px] rounded-full border border-[#E5D5CB] bg-white/70 px-7 outline-none"
                />

              </div>

              {/* Description Input */}
              <div className="relative">
                <textarea
                  placeholder="Tell the luxury story of this beauty product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full rounded-[28px] border border-[#E5D5CB] bg-white/70 p-7 outline-none resize-none transition-all duration-300 focus:border-[#7A2E3A] focus:bg-white focus:shadow-md focus:shadow-[#7A2E3A]/5 placeholder-[#A17F72]/60 leading-relaxed"
                />
              </div>

              {/* INSTANT VISUAL PREVIEW AND FILE PICKER */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group/upload cursor-pointer rounded-[36px] border-2 border-dashed text-center transition-all duration-500 flex flex-col items-center justify-center min-h-[220px] overflow-hidden relative p-6
                  ${isDragging ? "border-[#7A2E3A] bg-[#7A2E3A]/5" : "border-[#D6B5A7] bg-white/30 hover:bg-white/60 hover:border-[#7A2E3A]"}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                />

                {imagePreviewUrl ? (
                  /* ENHANCED LIVE IMAGE PREVIEW HUD */
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-50 group-hover/upload:opacity-90 transition-opacity">
                    <img
                      src={imagePreviewUrl}
                      alt="Upload Preview"
                      className="w-full h-full object-contain p-4 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-[#2D211D]/10 backdrop-blur-[1px] opacity-0 group-hover/upload:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <span className="bg-white/90 text-[#2D211D] px-4 py-2 rounded-full text-[9px] font-semibold uppercase tracking-[0.25em] shadow-lg border border-[#E4D5CC]">
                        Change Image
                      </span>
                    </div>
                    {/* Tiny Floating Filename Label */}
                    <div className="absolute bottom-3 left-4 right-4 text-center pointer-events-none">
                      <p className="text-[10px] text-[#A17F72] bg-white/80 backdrop-blur-md px-2 py-1 rounded-md inline-block max-w-full truncate border border-[#E4D5CC]/40">
                        {image?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* STANDARD MINIMAL DROPZONE VISUAL */
                  <>
                    <div className="h-12 w-12 rounded-full bg-[#F8F1EB] group-hover/upload:bg-[#7A2E3A]/10 flex items-center justify-center transition-colors duration-300 mb-4">
                      <svg className="w-5 h-5 text-[#A17F72] group-hover/upload:text-[#7A2E3A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#2D211D] tracking-tight">Drag & drop product imagery</p>
                    <p className="text-xs text-[#A17F72] mt-1">Supports high-res PNG, JPEG, or WEBP</p>
                  </>
                )}
              </div>

              {/* Premium Call To Action Button */}
              <button
                onClick={handleCreateProduct}
                disabled={loading}
                type="submit"
                className="mt-2 w-full h-[64px] rounded-full bg-[#7A2E3A] text-white uppercase tracking-[0.35em] text-[11px] font-medium shadow-lg shadow-[#7A2E3A]/20 transition-all duration-500 hover:bg-[#2D211D] hover:shadow-[#2D211D]/20 hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>

            </form>
          </div>

          {/* LUXURY MANAGEMENT SIDE PANEL */}
          <aside className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 w-full">

            {/* ANALYTICS */}
            <div
              onClick={() => router.push("/admin/dashboard")}
              className="group relative rounded-[32px] border border-[#E4D5CC] bg-white/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-xl hover:shadow-[#2D211D]/5 hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="font-[family:var(--font-cormorant)] text-7xl italic">
                  D
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-semibold block">
                ANALYTICS // 01
              </span>

              <h3 className="mt-4 text-[32px] tracking-[-0.03em] text-[#2D211D] font-[family:var(--font-cormorant)] font-light">
                Dashboard
              </h3>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-[#A17F72]">
                  Revenue & business insights
                </span>

                <div className="h-8 w-8 rounded-full border border-[#E5D5CB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#7A2E3A] group-hover:border-[#7A2E3A]">
                  <svg className="w-3 h-3 text-[#2D211D] group-hover:text-white transition-colors transform group-hover:translate-x-[2px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>




            {/* ORDERS MANAGEMENT CARD */}
            <div
              onClick={() =>
                router.push("/admin/orders")
              }
              className="group relative rounded-[32px] border border-[#E4D5CC] bg-white/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-xl hover:shadow-[#2D211D]/5 hover:-translate-y-1 overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="font-[family:var(--font-cormorant)] text-7xl italic font-serif">O</span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-semibold block">
                MANAGEMENT // 02
              </span>

              <h3 className="mt-4 text-[32px] tracking-[-0.03em] text-[#2D211D] font-[family:var(--font-cormorant)] font-light">
                Manage Orders
              </h3>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-[#A17F72] group-hover:text-[#7A2E3A] transition-colors">Review pending requests</span>
                <div className="h-8 w-8 rounded-full border border-[#E5D5CB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#7A2E3A] group-hover:border-[#7A2E3A]">
                  <svg className="w-3 h-3 text-[#2D211D] group-hover:text-white transition-colors transform group-hover:translate-x-[2px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* USERS MANAGEMENT CARD */}
            <div
              onClick={() => router.push("/admin/users")}
              className="group relative rounded-[32px] border border-[#E4D5CC] bg-white/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-xl hover:shadow-[#2D211D]/5 hover:-translate-y-1 overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="font-[family:var(--font-cormorant)] text-7xl italic font-serif">U</span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72] font-semibold block">
                MANAGEMENT // 03
              </span>

              <h3 className="mt-4 text-[32px] tracking-[-0.03em] text-[#2D211D] font-[family:var(--font-cormorant)] font-light">
                Manage Users
              </h3>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-[#A17F72] group-hover:text-[#7A2E3A] transition-colors">Configure user profiles</span>
                <div className="h-8 w-8 rounded-full border border-[#E5D5CB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#7A2E3A] group-hover:border-[#7A2E3A]">
                  <svg className="w-3 h-3 text-[#2D211D] group-hover:text-white transition-colors transform group-hover:translate-x-[2px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>

          </aside>

        </section>

        {/* PRODUCTS LIST SECTION */}
        <section className="mt-32 md:mt-48 max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#E4D5CC]/60 pb-12 relative z-10">

            <div className="absolute top-[-40px] left-0 text-[120px] md:text-[160px] font-bold text-[#E8C9B8]/10 tracking-widest pointer-events-none select-none font-[family:var(--font-cormorant)] z-0">
              ALQORA
            </div>

            <div className="max-w-2xl relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[1px] w-10 bg-[#A17F72]" />
                <span className="text-[10px] uppercase tracking-[0.45em] text-[#A17F72] font-semibold">
                  CURRENT ARCHIVE
                </span>
              </div>

              <h2 className="font-[family:var(--font-cormorant)] text-[54px] sm:text-[72px] lg:text-[92px] leading-[0.9] tracking-[-0.05em] text-[#2D211D] font-light">
                Product <span className="italic font-normal text-[#7A2E3A]">Inventory</span>
              </h2>
            </div>

            <div className="relative group self-start md:self-end mt-6 md:mt-0 z-10">
              <div className="h-[130px] w-[130px] rounded-full border border-[#E4D5CC] bg-white/70 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 shadow-sm hover:shadow-md hover:border-[#A17F72]/50">
                <span className="text-4xl font-light font-[family:var(--font-cormorant)] text-[#2D211D] leading-none">
                  {products.length}
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#A17F72] mt-2 font-semibold">
                  UNITS
                </span>
              </div>
              <div className="absolute inset-[-6px] border border-dashed border-[#D6B5A7]/40 rounded-full pointer-events-none" />
            </div>
          </div>

          {/* GRID OUTLINE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 relative z-10">
            {products.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col items-center text-center transition-all duration-500"
              >
                <div className="relative w-full aspect-[4/5] rounded-[44px] overflow-hidden bg-[#F1E5DC]/50 border border-[#E4D5CC]/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#2D211D]/5 group-hover:bg-[#F1E5DC]/80">
                  <img
                    src={product.image_link}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 p-8 mix-blend-multiply"
                  />

                  <div className="absolute inset-0 bg-[#2D211D]/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                    <button
                      onClick={() =>
                        handleEditProduct(product)
                      }
                      className="h-12 w-12 rounded-full bg-white text-[#2D211D] flex items-center justify-center hover:bg-[#7A2E3A] hover:text-white transition-all duration-300 shadow-xl transform translate-y-3 group-hover:translate-y-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="h-12 w-12 rounded-full bg-white text-[#7A2E3A] flex items-center justify-center hover:bg-[#7A2E3A] hover:text-white transition-all duration-300 shadow-xl transform translate-y-3 group-hover:translate-y-0 delay-75"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center w-full">
                  <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-[#A17F72]">
                    {product.product_type}
                  </span>

                  <h3 className="mt-2.5 text-2xl font-[family:var(--font-cormorant)] text-[#2D211D] font-light max-w-[85%] group-hover:text-[#7A2E3A] transition-colors duration-300 tracking-tight leading-tight">
                    {product.name}
                  </h3>

                  <div className="mt-3.5 flex items-center gap-4 text-xs font-light text-[#A17F72]">
                    <span className="h-[1px] w-5 bg-[#E4D5CC]" />
                    <span className="text-[#2D211D] font-medium tracking-wide">  ₹{Number(product.price).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</span>
                    <span className="h-[1px] w-5 bg-[#E4D5CC]" />
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">

                    {product.stock > 10 ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <p className="text-[9px] text-green-600 uppercase tracking-[0.2em] font-medium">
                          {product.stock} In Stock
                        </p>
                      </>
                    ) : product.stock > 0 ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        <p className="text-[9px] text-yellow-600 uppercase tracking-[0.2em] font-medium">
                          Only {product.stock} Left
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <p className="text-[9px] text-red-600 uppercase tracking-[0.2em] font-medium">
                          Out Of Stock
                        </p>
                      </>
                    )}

                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

      </div>

      <EditProductModal
        isOpen={isEditOpen}
        product={selectedProduct}
        onClose={() =>
          setIsEditOpen(false)
        }
        onSave={handleSaveProduct}
      />
    </main>
  );
}