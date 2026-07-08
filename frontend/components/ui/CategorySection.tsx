"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    id: 1,
    title: "FACE & BASE",
    desc: "Flawless foundations for every skin tone. Alqora brings a touch of cinematic elegance to your daily routine.",
    img: "/face-category.png",
    href: "/face",
  },
  {
    id: 2,
    title: "LIPS & CHEEKS",
    desc: "Rich pigments that blend seamlessly for a natural, high-fashion glow that lasts all day.",
    img: "/lips-category.png",
    href: "/lips",
  },
  {
    id: 3,
    title: "EYE ARTISTRY",
    desc: "Define your gaze with precision. Professional-grade formulas designed for the modern aesthetic.",
    img: "/eyes-category.png",
    href: "/eyes",
  },
  {
    id: 4,
    title: "BEST SELLERS",
    desc: "The community's favorite enhancers. Tried, tested, and loved by the Alqora family.",
    img: "/bestsellers-category.png",
    href: "/bestsellers",
  },
  {
    id: 5,
    title: "NEW ARRIVALS",
    desc: "The latest drops in modern beauty. Stay ahead of the curve with our newest architectural formulas.",
    img: "/new-category.png",
    href: "/new",
  },
  {
    id: 6,
    title: "SKINCARE",
    desc: "Nutrient-rich prep for a perfect canvas. Because the best makeup starts with a healthy glow.",
    img: "/skincare-category.png",
    href: "/skincare",
  },
];

export const CategorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [mouseSide, setMouseSide] = useState<"left" | "right">("right");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // =========================
  // SCREEN SIZE DETECTION
  // =========================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // =========================
  // INTRO ANIMATION
  // =========================
 useEffect(() => {
  if (!containerRef.current) return;

  const ctx = gsap.context(() => {
    gsap.set(".gallery-wrap", { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(".gallery-wrap", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      },
    });

    return () => trigger.kill();
  }, containerRef);

  return () => ctx.revert();
}, []);
  // =========================
  // DESKTOP MOUSE MOVE
  // =========================
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setMouseSide(e.clientX < rect.left + rect.width / 2 ? "left" : "right");
  };

  // =========================
  // NAVIGATION
  // =========================
  const goToNext = () => {
    const nextIndex =
      currentIndex >= CATEGORIES.length - 1 ? 0 : currentIndex + 1;

    gsap.fromTo(
      `.gallery-image-${nextIndex}`,
      { scale: 1.12 },
      {
        scale: 1.06,
        duration: 1.15,
        ease: "power3.out",
      }
    );

    setCurrentIndex(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex =
      currentIndex <= 0 ? CATEGORIES.length - 1 : currentIndex - 1;

    gsap.fromTo(
      `.gallery-image-${prevIndex}`,
      { scale: 1.12 },
      {
        scale: 1.06,
        duration: 1.15,
        ease: "power3.out",
      }
    );

    setCurrentIndex(prevIndex);
  };

  const handleDesktopNavigation = () => {
    if (isMobile) return;
    if (mouseSide === "right") {
      goToNext();
    } else {
      goToPrev();
    }
  };

  // =========================
  // MOBILE TAP / SWIPE
  // =========================
  const handleSectionTap = (e: React.MouseEvent) => {
    if (!isMobile) return;

    const target = e.target as HTMLElement;
    if (target.closest("[data-category-controls]")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;

    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current === null || touchEndX.current === null) return;

    const delta = touchStartX.current - touchEndX.current;

    if (Math.abs(delta) < 40) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    if (delta > 0) {
      goToNext();
    } else {
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // =========================
  // GALLERY POSITION
  // =========================
  const getTranslateX = () => {
    if (isMobile) {
      return `translateX(calc(7vw - ${currentIndex * 88}vw))`;
    }

    return `translateX(calc(24vw - ${currentIndex * 55}vw))`;
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={isMobile ? handleSectionTap : handleDesktopNavigation}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="
        relative
        w-full
        overflow-hidden
        bg-[#F5F1ED]

        min-h-[760px]
        sm:min-h-[820px]

        md:min-h-[820px]
        md:h-[125vh]
        md:cursor-none
      "
    >
      {/* =========================
          DESKTOP INTERACTIVE CURSOR
      ========================= */}
      {!isMobile && (
        <motion.div
          className="absolute z-[120] pointer-events-none"
          animate={{
            x: mousePos.x,
            y: mousePos.y,
          }}
          transition={{
            type: "tween",
            ease: [0.22, 1, 0.36, 1],
            duration: 0.06,
          }}
          style={{ left: 0, top: 0 }}
        >
          <div
            className={`relative flex items-center -translate-y-1/2 ${
              mouseSide === "right" ? "flex-row" : "flex-row-reverse"
            }`}
            style={{
              transform:
                mouseSide === "right"
                  ? "translateX(-100%)"
                  : "translateX(0)",
            }}
          >
            <div className="w-[140px] h-[1px] bg-[#1E1B18]" />
            <div className="flex items-center justify-center text-[#1E1B18] -mx-1">
              {mouseSide === "right" ? (
                <MoveRight size={22} strokeWidth={0.9} />
              ) : (
                <MoveLeft size={22} strokeWidth={0.9} />
              )}
            </div>
          </div>
        </motion.div>
      )}

    
      {/* =========================================================
          MOBILE LAYOUT
          heading -> gallery -> glass card
      ========================================================= */}
      <div className="relative z-20 flex flex-col md:hidden">
        {/* HEADING */}
        <div className="px-5 pt-8 pb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3 whitespace-nowrap">
            <div className="h-px w-8 bg-[#B99988]/50" />
            <span className="text-[9px] uppercase tracking-[0.38em] text-[#9A7869]">
              Discover Categories
            </span>
            <div className="h-px w-8 bg-[#B99988]/50" />
          </div>

          <h2
            className="
              text-[40px]
              sm:text-[52px]
              leading-[0.82]
              tracking-[-0.08em]
              text-[#2B201C]
              font-[350]
            "
          >
            Curated
            <br />
            Beauty
          </h2>
        </div>

        {/* GALLERY */}
        <div className="gallery-wrap relative w-full overflow-hidden">
          <div
            className="
              flex
              items-start
              gap-[6vw]
              transition-transform
              duration-[1200ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              will-change-transform
              px-0
            "
            style={{ transform: getTranslateX() }}
          >
            {CATEGORIES.map((cat, i) => {
              const isActive = i === currentIndex;

              return (
                <div
                  key={cat.id}
                  className="
                    relative
                    shrink-0
                    overflow-hidden

                    w-[82vw]
                    min-w-[82vw]
                    h-[46vh]
                    min-h-[320px]
                    max-h-[430px]
                  "
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className={`
                      gallery-image-${i}
                      absolute inset-0 w-full h-full object-cover
                      transition-transform duration-[1200ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${isActive ? "scale-[1.06]" : "scale-100"}
                    `}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                </div>
              );
            })}
          </div>
        </div>

        {/* GLASS CARD */}
        <div className="relative z-30 px-4 -mt-12 pb-6">
          <div
            data-category-controls
            className="
              relative
              mx-auto
              w-full
              max-w-[420px]
              overflow-hidden
              border border-white/20
              shadow-[0_20px_80px_rgba(0,0,0,0.16)]
              backdrop-blur-[14px]
            "
          >
            <div className="absolute inset-0 bg-[#F5F1ED]/88" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5" />
            <div className="absolute inset-0 bg-black/[0.03]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative z-10 px-6 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-6"
              >
                <div
                  className="
                    text-[4.8rem]
                    sm:text-[5.6rem]
                    leading-none
                    font-extralight
                    tracking-[-0.06em]
                    text-[#161311]/85
                    mb-3
                    select-none
                  "
                >
                  0{currentIndex + 1}
                </div>

                <h3
                  className="
                    text-[24px]
                    sm:text-[28px]
                    uppercase
                    tracking-[-0.03em]
                    leading-[1]
                    text-[#161311]
                    mb-4
                    font-semibold
                  "
                >
                  {CATEGORIES[currentIndex].title}
                </h3>

                <p
                  className="
                    text-[13px]
                    sm:text-[14px]
                    leading-[1.75]
                    tracking-[0.01em]
                    text-[#2A2623]
                    font-medium
                  "
                >
                  {CATEGORIES[currentIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 border-t border-black/10 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="h-11 w-11 shrink-0 rounded-full border border-black/10 bg-white/70 flex items-center justify-center text-[#161311] active:scale-95 transition"
                    aria-label="Previous category"
                  >
                    <MoveLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="h-11 w-11 shrink-0 rounded-full border border-black/10 bg-white/70 flex items-center justify-center text-[#161311] active:scale-95 transition"
                    aria-label="Next category"
                  >
                    <MoveRight size={18} />
                  </button>
                </div>

                <Link
                  href={CATEGORIES[currentIndex].href}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    shrink-0
                    whitespace-nowrap
                    text-right
                    uppercase
                    tracking-[0.18em]
                    text-[10px]
                    text-[#161311]
                  "
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          DESKTOP LAYOUT
          keep cinematic editorial composition
      ========================================================= */}
      <div className="hidden md:block h-full">
        {/* HEADING */}
        <div className="absolute top-[2vh] left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none whitespace-nowrap">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-14 bg-[#B99988]/50" />
            <span className="text-[10px] uppercase tracking-[0.55em] text-[#9A7869]">
              Discover Categories
            </span>
            <div />
          </div>

          <h2
            className="
              text-[88px]
              lg:text-[108px]
              leading-[0.8]
              tracking-[-0.08em]
              text-[#2B201C]
              font-[350]
            "
          >
            Curated <span className="ml-4">Beauty</span>
          </h2>
        </div>

        {/* MAIN GALLERY */}
        <div
          className="
            gallery-wrap
            absolute
            inset-x-0
            bottom-0
            w-full
            overflow-hidden
            h-full
            pt-[220px]
          "
        >
          <div
            className="
              absolute
              left-0
              right-0
              top-0
              bottom-0
              flex
              items-end
              transition-transform
              duration-[1800ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              will-change-transform
              gap-[19vw]
            "
            style={{ transform: getTranslateX() }}
          >
            {CATEGORIES.map((cat, i) => {
              const isActive = i === currentIndex;

              return (
                <div
                  key={cat.id}
                  className="
                    relative
                    shrink-0
                    overflow-hidden
                    rounded-none
                    w-[38vw]
                    min-w-[38vw]
                    h-[88vh]
                    min-h-[780px]
                  "
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className={`
                      gallery-image-${i}
                      absolute inset-0 w-full h-full object-cover
                      transition-transform duration-[1800ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${isActive ? "scale-[1.06]" : "scale-100"}
                    `}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* GLASS INFO BOX */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div
            data-category-controls
            className="
              absolute
              pointer-events-auto
              overflow-hidden
              border border-white/20
              shadow-[0_20px_80px_rgba(0,0,0,0.18)]
              backdrop-blur-[14px]
              right-[5vw]
              bottom-[5vh]
              w-[32vw]
              min-w-[360px]
              max-w-none
            "
          >
            <div className="absolute inset-0 pointer-events-none bg-[#F5F1ED]/88" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-black/5" />
            <div className="absolute inset-0 pointer-events-none bg-black/[0.03]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative z-10 px-14 pt-14 pb-12"
              >
                <div
                  className="
                    text-[9rem]
                    leading-none
                    font-extralight
                    tracking-[-0.06em]
                    text-[#161311]/85
                    mb-6
                    select-none
                  "
                >
                  0{currentIndex + 1}
                </div>

                <h3
                  className="
                    text-[32px]
                    uppercase
                    tracking-[-0.03em]
                    leading-[1]
                    text-[#161311]
                    mb-7
                    font-semibold
                  "
                >
                  {CATEGORIES[currentIndex].title}
                </h3>

                <p
                  className="
                    text-[15px]
                    leading-[2]
                    tracking-[0.01em]
                    text-[#2A2623]
                    max-w-[92%]
                    font-medium
                  "
                >
                  {CATEGORIES[currentIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 border-t border-black/10">
              <div className="flex items-center justify-end px-14 py-5">
                <Link
                  href={CATEGORIES[currentIndex].href}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    group
                    relative
                    overflow-hidden
                    uppercase
                    tracking-[0.22em]
                    text-[13px]
                    text-[#161311]
                    transition-all
                    duration-500
                    px-4
                    py-2
                  "
                >
                  <span
                    className="
                      absolute inset-0 bg-[#161311]
                      translate-y-full
                      group-hover:translate-y-0
                      transition-transform duration-500
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                    "
                  />
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-[#F5F1ED]">
                    Explore Collection
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};