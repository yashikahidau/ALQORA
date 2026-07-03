"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/ui/Hero";
import { CategorySection } from "@/components/ui/CategorySection";
import { TextRevealSection } from "@/components/ui/TextRevealSection";
import { EditorialMakeupSection } from "@/components/ui/EditorialMakeupSection";
import { Footer } from "@/components/ui/Footer";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  const { user } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userName, setUserName] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  // 1. Safe Client-Side Storage Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkLoginStatus = () => {
        const loginFlag = localStorage.getItem("alqora_login_success");
        const storedName = localStorage.getItem("alqora_username");

        if (loginFlag === "true") {
          if (storedName) {
            // Capitalize the first letter for editorial neatness
            setUserName(storedName.charAt(0).toUpperCase() + storedName.slice(1));
          }
          setShowToast(true);
          localStorage.removeItem("alqora_login_success");
          localStorage.removeItem("alqora_username");
        }
      };

      checkLoginStatus();
      const timeoutId = setTimeout(checkLoginStatus, 50);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // 2. Main Page Animations Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      setIsReady(true);

      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=280%" : "+=600%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // STAGE 1 — HERO
      tl.to(".alqora-text", {
        scale: isMobile ? 1.55 : 2.2,
        opacity: 1,
        duration: 2,
        backgroundPosition: "50% 20%",
        ease: "none",
      }).to(
        ".hero-bg",
        {
          opacity: 0.3,
          duration: 2,
          ease: "none",
        },
        0
      );

      // STAGE 2 — CATEGORY SECTION
      tl.to(".category-block", {
        y: isMobile ? "-92vh" : "-125vh",
        duration: 3,
        ease: "power2.inOut",
      }).to(
        ".alqora-text",
        {
          y: isMobile ? -220 : -500,
          duration: 3,
          ease: "power2.inOut",
        },
        "<"
      );

      // pause
      // tl.to({}, { duration: isMobile ? 0.35 : 1.4 });

      // STAGE 3 — TEXT REVEAL
      tl.to(".text-reveal-block", {
        y: isMobile ? "-84vh" : "-100vh",
        duration: 3,
        ease: "power2.inOut",
      }).fromTo(
        ".compress-char",
        {
          y: isMobile ? 50 : 120,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: isMobile ? 0.01 : 0.018,
          duration: 1.8,
          ease: "power3.out",
        },
        "-=1.2"
      );
    }, containerRef);

    if (document.querySelector(".editorial-card")) {
      gsap.from(".editorial-card", {
        scrollTrigger: { trigger: ".editorial-block", start: "top 75%" },
        y: 120,
        opacity: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: "power3.out",
      });
    }

    if (document.querySelector(".editorial-heading")) {
      gsap.from(".editorial-heading", {
        scrollTrigger: { trigger: ".editorial-heading", start: "top 85%" },
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    }

    if (document.querySelector(".footer-cta")) {
      gsap.from(".footer-cta", {
        scrollTrigger: { trigger: ".footer-cta", start: "top 80%" },
        scale: 0.92,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
      });
    }

    if (document.querySelector(".footer-column")) {
      gsap.from(".footer-column", {
        scrollTrigger: { trigger: ".footer-columns", start: "top 85%" },
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
      });
    }

    if (document.querySelector(".footer-brand-wrapper")) {
      gsap.fromTo(
        ".footer-brand-wrapper",
        { scale: 0.9, opacity: 0.05 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: ".footer-brand-wrapper",
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        }
      );
    }

    return () => ctx.revert();
  }, []);

  // 3. Editorial Toaster GSAP Animation Pipeline
  useEffect(() => {
    if (!showToast || !toastRef.current) return;

    const toastCtx = gsap.context(() => {
      const toastTl = gsap.timeline();

      // Premium Slide-in from bottom right
      toastTl.fromTo(
        toastRef.current,
        { x: 80, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out", delay: 0.4 }
      );

      // Subtle pulse on the accent bar when loaded
      toastTl.fromTo(
        ".toast-accent-bar",
        { height: "30%" },
        { height: "70%", duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );

      // Graceful fade away exit
      toastTl.to(
        toastRef.current,
        {
          x: 20,
          opacity: 0,
          scale: 0.98,
          duration: 0.8,
          ease: "power3.in",
          onComplete: () => setShowToast(false),
        },
        "+=4.5"
      );
    });

    return () => toastCtx.revert();
  }, [showToast]);

  return (
    <main className="bg-[#F5F1ED] overflow-hidden relative">

      {/* INDUSTRY STANDARD PREMIUM TOASTER CONTAINER */}
      <div
        className={`hidden md:flex fixed bottom-8 right-8 z-[9999] justify-end pointer-events-none px-4 transition-all duration-300 ${showToast ? "opacity-100" : "opacity-0 select-none pointer-events-none"
          }`}
      >
        <div
          ref={toastRef}
          className="pointer-events-auto relative flex items-center gap-4 bg-white/70 backdrop-blur-xl border border-[#2D211D]/10 pl-6 pr-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(45,33,29,0.08)] max-w-[360px] w-full"
        >
          {/* Decorative left accent line representing luxury retail branding */}
          <div className="toast-accent-bar absolute left-0 top-[15%] w-[3px] bg-[#7A2E3A] rounded-r-md transition-all duration-500" />

          {/* Minimalist Icon Background Box */}
          <div className="flex items-center justify-center text-[#7A2E3A] bg-[#7A2E3A]/5 h-9 w-9 rounded-xl shrink-0">
            <Sparkles size={14} strokeWidth={1.5} className="animate-pulse" />
          </div>

          {/* Editorial Label Space */}
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2D211D]/40">
              Authentication Success
            </p>
            <h4 className="text-[14px] font-serif font-medium text-[#2D211D] tracking-tight leading-tight">
              Welcome back, {user?.name}
            </h4>
            <p className="text-[11px] text-[#8E7468] font-light italic mt-0.5">
              unveiling your curated collection
            </p>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`
    relative h-screen w-full overflow-hidden transition-opacity duration-700
    ${isReady ? "opacity-100" : "opacity-0"}
  `}
      >
        {/* HERO */}
        <div className="relative z-10 h-screen w-full">
          <Hero />
        </div>

        {/* CATEGORY SECTION */}
        <div className="category-block absolute top-full left-0 w-full z-20">
          <CategorySection />
        </div>

        <div className="text-reveal-block absolute top-[100vh] left-0 w-full z-30">
          <TextRevealSection />
        </div>
      </div>

      {/* EDITORIAL MAKEUP SECTION */}
      <div className="editorial-block top-[330vh] left-0 w-full z-40">
        <EditorialMakeupSection />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}