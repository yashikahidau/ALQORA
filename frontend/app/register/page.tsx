"use client";

import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="h-screen w-full bg-[#F6F1EB] text-[#2D211D] relative overflow-hidden select-none flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-[1400px] h-full grid grid-cols-1 lg:grid-cols-2 items-center">
        
        {/* Left Editorial Visual Panel */}
        <section className="hidden lg:block h-[92vh] pr-4 xl:pr-8 relative">
          <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(45,33,29,0.03)]">
            <Image
              src="/login-cover.png"
              alt="ALQORA Editorial Content Representation"
              fill
              sizes="50vw"
              priority
              className="object-cover object-top brightness-[0.92] contrast-[98%] "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D211D]/45 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white max-w-md">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-80 block mb-2">THE COMMUNITY</span>
              <h2 className="text-[44px] xl:text-[48px] leading-[1.1] tracking-tight font-serif mb-3">Bespoke Rituals.</h2>
              <p className="text-[13px] leading-relaxed font-light opacity-90">
                Discover customized skincare elixirs and carefully curated holistic wellness regimens.
              </p>
            </div>
          </div>
        </section>

        {/* Right Form Workspace Content Column */}
        <section className="flex flex-col justify-center h-[92vh] pl-4 sm:pl-8 md:pl-12 lg:pl-10 xl:pl-20 pr-4 sm:pr-8 md:pr-12 lg:pr-4 xl:pr-8 relative">
          <div className="w-full max-w-[400px] mx-auto flex flex-col">
            
            {/* Logo aligned with the text anchor */}
           <div className="mb-10 lg:mb-6 flex justify-center lg:justify-start mx-auto lg:mx-0 relative w-[110px] h-[46px] transition-opacity duration-300 hover:opacity-75">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="ALQORA Brand Signature"
                  fill
                  sizes="110px"
                  priority
                  className="
                    object-contain
                   brightness-0
  drop-shadow-[0_4px_16px_rgba(45,33,29,0.08)]
                    transition-all
                    duration-700
                    hover:scale-[1.03]
                    
                  " 
                />
              </Link>
            </div>

            <RegisterForm />
          </div>
        </section>
      </div>

      {/* Floating Decorative Brand Accent Icon */}
      <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-[#2D211D] flex items-center justify-center text-white text-[12px] font-serif shadow-md pointer-events-none">N</div>
    </main>
  );
}