import React, { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  image_link: string;
  product_type: string;
  rating: number;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product, selectedImage?: File | null) => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: EditProductModalProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  // Sync state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setPreviewImage(product.image_link);
      setSelectedImage(null);
    }

    // Lock background scroll when open, restore when closed or unmounted
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up function to ensure scroll is restored if the component unmounts unexpectedly
    return () => {
      document.body.style.overflow = "";
    };
  }, [product, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData, selectedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* 1. Backdrop Overlay with Editorial Blur */}
      <div
        className="fixed inset-0 bg-[#2D211D]/10 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
      />

      {/* 2. Modal Card Container */}
      <div className="relative bg-[#FBF9F6] w-full max-w-4xl rounded-[24px] md:rounded-[32px] shadow-2xl border border-[#E4D5CC]/40 overflow-hidden transform scale-100 transition-all duration-500 max-h-[90vh] flex flex-col md:flex-row animate-scale-up my-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 h-10 w-10 flex items-center justify-center rounded-full border border-[#E4D5CC] bg-white/80 backdrop-blur-sm text-[#2D211D] hover:bg-[#2D211D] hover:text-white transition-all duration-300 group"
          aria-label="Close modal"
        >
          <span className="text-sm font-light tracking-none group-hover:rotate-90 transition-transform duration-300">✕</span>
        </button>

        {/* Left Side: Visual Product Slate */}
        <div className="w-full md:w-5/12 bg-[#F5EFEA] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E4D5CC]/40 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A2E3A] font-semibold">
              Archive Registry
            </span>
            <h2 className="text-2xl font-light text-[#2D211D] mt-2 tracking-wide font-serif">
              Modify <span className="italic font-normal text-[#7A2E3A]">Item</span>
            </h2>
            <p className="text-[11px] text-[#2D211D]/60 tracking-wide mt-1 uppercase">
              SKU Ref: #{formData._id.slice(-6)}
            </p>
          </div>

          {/* Luxury Rounded Image Box Container */}
          <div className="my-6 flex justify-center items-center">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[24px] bg-[#FAF6F0] p-4 border border-[#E4D5CC]/30 shadow-inner flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={formData.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="text-[11px] uppercase tracking-wider text-[#2D211D]/40">No Image Preview</div>
              )}
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2D211D]/60 mb-2">
              Replace Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setSelectedImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }}
              className="block w-full text-[11px] text-[#2D211D] file:mr-4 file:px-5 file:py-2 file:rounded-full file:border-0 file:bg-[#2D211D] file:text-white file:text-[10px] file:uppercase file:tracking-[0.2em] file:cursor-pointer file:hover:bg-[#7A2E3A]"
            />
          </div>

          <div className="hidden md:block text-[10px] uppercase tracking-widest text-[#2D211D]/40 text-center">
            Alqora Editorial Interface ©2026
          </div>
        </div>

        {/* Right Side: Fluid Form Inputs */}
        <form onSubmit={handleSubmit} className="w-full md:w-7/12 p-6 md:p-12 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5 md:space-y-6">
            {/* Input Element: Product Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2D211D]/60">
                Product Title
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-[#E4D5CC] rounded-xl px-4 py-3 text-sm text-[#2D211D] focus:outline-none focus:border-[#7A2E3A] focus:ring-1 focus:ring-[#7A2E3A]/20 transition-all duration-300 font-light"
                required
              />
            </div>

            {/* Two Column Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input Element: Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2D211D]/60">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.product_type}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                  className="w-full bg-white border border-[#E4D5CC] rounded-xl px-4 py-3 text-sm text-[#2D211D] focus:outline-none focus:border-[#7A2E3A] focus:ring-1 focus:ring-[#7A2E3A]/20 transition-all duration-300 font-light"
                  required
                />
              </div>

              {/* Input Element: Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2D211D]/60">
                  Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#2D211D]/40">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white border border-[#E4D5CC] rounded-xl pl-8 pr-4 py-3 text-sm text-[#2D211D] focus:outline-none focus:border-[#7A2E3A] focus:ring-1 focus:ring-[#7A2E3A]/20 transition-all duration-300 font-light"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Input Element: Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2D211D]/60">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-white border border-[#E4D5CC] rounded-xl px-4 py-3 text-sm text-[#2D211D] focus:outline-none focus:border-[#7A2E3A] focus:ring-1 focus:ring-[#7A2E3A]/20 transition-all duration-300 font-light resize-none"
                required
              />
            </div>

            {/* Action Footer Buttons */}
            <div className="flex items-center justify-end gap-4 mt-6 pt-4 md:mt-8 md:pt-6 border-t border-[#E4D5CC]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 md:px-6 md:py-3 text-[11px] uppercase tracking-[0.2em] font-medium text-[#2D211D]/60 hover:text-[#2D211D] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#2D211D] text-white px-6 py-3 md:px-8 md:py-3.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium shadow-md hover:bg-[#7A2E3A] transition-all duration-300 hover:shadow-xl transform active:scale-[0.98]"
              >
                Save Alterations
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}