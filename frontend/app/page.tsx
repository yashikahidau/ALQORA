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

  // IMPORTANT:
  // don't assume desktop first. wait until device size is known.
  const [isMobile, setIsMobile] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  // =========================
  // MOBILE DETECTION
  // =========================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setDeviceReady(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // =========================
  // LOGIN SUCCESS TOAST CHECK
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkLoginStatus = () => {
      const loginFlag = localStorage.getItem("alqora_login_success");

      if (loginFlag === "true") {
        setShowToast(true);
        localStorage.removeItem("alqora_login_success");
        localStorage.removeItem("alqora_username");
      }
    };

    checkLoginStatus();
    const timeoutId = setTimeout(checkLoginStatus, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  // =========================
  // MAIN PAGE ANIMATION
  // =========================
  useEffect(() => {
    if (!containerRef.current || !deviceReady) return;

    // kill old triggers before rebuilding
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // -----------------------------
    // 1) HERO / CATEGORY / DESKTOP TEXT STACK
    // scoped only to containerRef
    // -----------------------------
    const heroCtx = gsap.context(() => {
      setIsReady(true);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=165%" : "+=600%",
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

      // STAGE 2 — CATEGORY
      tl.to(".category-block", {
        y: isMobile ? "-100vh" : "-125vh",
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

      // STAGE 3 — DESKTOP ONLY TEXT REVEAL IN PINNED STACK
      if (!isMobile) {
        tl.to(".text-reveal-block", {
          y: "-100vh",
          duration: 3,
          ease: "power2.inOut",
        }).fromTo(
          ".compress-char",
          {
            y: 120,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.018,
            duration: 1.8,
            ease: "power3.out",
          },
          "-=1.2"
        );
      }
    }, containerRef);

    // -----------------------------
    // 2) MOBILE RESET
    // very important:
    // if mobile, force editorial/footer elements visible and clear
    // any stale inline GSAP styles from previous desktop setup.
    // -----------------------------
    if (isMobile) {
      gsap.set(
        [
          ".editorial-card",
          ".editorial-heading",
          ".footer-cta",
          ".footer-column",
          ".footer-brand-wrapper",
        ],
        {
          clearProps: "all",
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
        }
      );
    }

    // -----------------------------
    // 3) EDITORIAL + FOOTER ANIMS
    // DESKTOP ONLY
    // -----------------------------
    let editorialTween: gsap.core.Tween | null = null;
    let editorialHeadingTween: gsap.core.Tween | null = null;
    let footerCtaTween: gsap.core.Tween | null = null;
    let footerColumnsTween: gsap.core.Tween | null = null;
    let footerBrandTween: gsap.core.Tween | null = null;

    if (!isMobile) {
      if (document.querySelector(".editorial-card")) {
        editorialTween = gsap.from(".editorial-card", {
          scrollTrigger: {
            trigger: ".editorial-block",
            start: "top 75%",
            invalidateOnRefresh: true,
          },
          y: 120,
          opacity: 0,
          duration: 1.4,
          stagger: 0.2,
          ease: "power3.out",
        });
      }

      if (document.querySelector(".editorial-heading")) {
        editorialHeadingTween = gsap.from(".editorial-heading", {
          scrollTrigger: {
            trigger: ".editorial-heading",
            start: "top 85%",
            invalidateOnRefresh: true,
          },
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      if (document.querySelector(".footer-cta")) {
        footerCtaTween = gsap.from(".footer-cta", {
          scrollTrigger: {
            trigger: ".footer-cta",
            start: "top 80%",
            invalidateOnRefresh: true,
          },
          scale: 0.92,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
        });
      }

      if (document.querySelector(".footer-column")) {
        footerColumnsTween = gsap.from(".footer-column", {
          scrollTrigger: {
            trigger: ".footer-columns",
            start: "top 85%",
            invalidateOnRefresh: true,
          },
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
        });
      }

      if (document.querySelector(".footer-brand-wrapper")) {
        footerBrandTween = gsap.fromTo(
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
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      heroCtx.revert();
      editorialTween?.kill();
      editorialHeadingTween?.kill();
      footerCtaTween?.kill();
      footerColumnsTween?.kill();
      footerBrandTween?.kill();
    };
  }, [isMobile, deviceReady]);

  // =========================
  // TOAST ANIMATION
  // =========================
  useEffect(() => {
    if (!showToast || !toastRef.current) return;

    const toastCtx = gsap.context(() => {
      const toastTl = gsap.timeline();

      toastTl.fromTo(
        toastRef.current,
        { x: 80, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.4,
        }
      );

      toastTl.fromTo(
        ".toast-accent-bar",
        { height: "30%" },
        {
          height: "70%",
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

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
    <main className="relative overflow-hidden bg-[#F5F1ED]">
      {/* =========================
          TOAST
      ========================= */}
      <div
        className={`hidden md:flex fixed bottom-8 right-8 z-[9999] justify-end pointer-events-none px-4 transition-all duration-300 ${
          showToast
            ? "opacity-100"
            : "opacity-0 select-none pointer-events-none"
        }`}
      >
        <div
          ref={toastRef}
          className="pointer-events-auto relative flex items-center gap-4 bg-white/70 backdrop-blur-xl border border-[#2D211D]/10 pl-6 pr-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(45,33,29,0.08)] max-w-[360px] w-full"
        >
          <div className="toast-accent-bar absolute left-0 top-[15%] w-[3px] bg-[#7A2E3A] rounded-r-md transition-all duration-500" />

          <div className="flex items-center justify-center text-[#7A2E3A] bg-[#7A2E3A]/5 h-9 w-9 rounded-xl shrink-0">
            <Sparkles size={14} strokeWidth={1.5} className="animate-pulse" />
          </div>

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

      {/* =========================
          PINNED HERO / CATEGORY / DESKTOP TEXT STACK
      ========================= */}
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

        {/* CATEGORY */}
        <div className="category-block absolute top-full left-0 w-full z-20">
          <CategorySection />
        </div>

        {/* DESKTOP ONLY TEXT REVEAL INSIDE PINNED STACK */}
        {!isMobile && (
          <div className="text-reveal-block absolute top-[100vh] left-0 w-full z-30">
            <TextRevealSection />
          </div>
        )}
      </div>

      {/* =========================
          MOBILE ONLY TEXT REVEAL
          NORMAL FLOW AFTER CATEGORY
      ========================= */}
      {isMobile && (
        <div className="relative z-30">
          <TextRevealSection />
        </div>
      )}

      {/* =========================
          EDITORIAL
      ========================= */}
      <div className="editorial-block relative w-full z-40">
        <EditorialMakeupSection />
      </div>

      {/* =========================
          FOOTER
      ========================= */}
      <Footer />
    </main>
  );
}