"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  
  // State for form management
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "+1 (555) 019-2834", // Premium placeholder format
    country: "United States",
    city: "New York",
    address: "742 Evergreen Terrace",
    postalCode: "10001",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, name: value }));
  };

  return (
    <div className="max-w-[1200px] w-full mix-blend-multiply animate-fade-in pb-16">
      
      {/* HEADER SECTION */}
      <header className="border-b border-[#2D211D]/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[13px] font-bold uppercase tracking-[0.45em] text-[#A17F72]">
            Identity Parameters
          </span>
          <h1 className="mt-4 font-[family:var(--font-cormorant)] text-[56px] md:text-[72px] font-light leading-none tracking-[-0.02em] text-[#2D211D]">
            Profile Settings
          </h1>
        </div>
        <div>
          <span className="text-[14px] uppercase tracking-[0.2em] text-[#8E7468] font-semibold block sm:inline">
            Secure Encryption Active
          </span>
        </div>
      </header>

      {/* FORM STACK */}
      <form className="mt-14 flex flex-col gap-16" onSubmit={(e) => e.preventDefault()}>
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#2D211D]/30 block mb-2">01 //</span>
            <h3 className="text-2xl font-[family:var(--font-cormorant)] text-[#2D211D] font-medium tracking-wide">
              Personal Information
            </h3>
            <p className="text-[14px] text-[#8E7468] mt-2 font-light leading-relaxed">
              Update your digital identity credentials used across our global storefronts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-white/50 backdrop-blur-xs p-8 md:p-10 rounded-[24px] border border-[#2D211D]/[0.06]">
            {/* First Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>

            {/* Last Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">Private Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONCIERGE SHIPPING */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 border-t border-[#2D211D]/10 pt-14">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#2D211D]/30 block mb-2">02 //</span>
            <h3 className="text-2xl font-[family:var(--font-cormorant)] text-[#2D211D] font-medium tracking-wide">
              Shipping Concierge
            </h3>
            <p className="text-[14px] text-[#8E7468] mt-2 font-light leading-relaxed">
              Your default localization parameters for bespoke courier routing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-white/50 backdrop-blur-xs p-8 md:p-10 rounded-[24px] border border-[#2D211D]/[0.06]">
            {/* Address Input */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">Street Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>

            {/* City Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>

            {/* Postal Code Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72]">Postal / ZIP Code</label>
              <input 
                type="text" 
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full border-b border-[#2D211D]/20 focus:border-[#6B3037] focus:outline-none bg-transparent pt-2 pb-1 text-[16px] font-medium text-[#2D211D] transition-colors rounded-none"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM FORM BUTTON ACTION PANEL */}
        <div className="border-t border-[#2D211D]/10 pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-[13px] font-light text-[#8E7468] tracking-wide">
            Any alterations will immediately cascade to active packaging fulfillment files.
          </p>
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              className="px-8 py-4 border border-[#2D211D]/20 text-[#2D211D] font-bold text-[12px] uppercase tracking-[0.25em] rounded-full hover:bg-white/40 transition-all duration-300 cursor-pointer"
            >
              Reset Changes
            </button>
            <button 
              type="submit" 
              className="px-10 py-4 bg-[#6B3037] hover:bg-[#5A262C] text-white font-bold text-[12px] uppercase tracking-[0.25em] rounded-full shadow-xs hover:shadow-md transform hover:-translate-y-[1px] transition-all duration-300 cursor-pointer"
            >
              Save Parameters
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}