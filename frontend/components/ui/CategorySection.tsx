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
    gsap.set(".gallery-wrap", { opacity: 0 });
    gsap.set(".intro-overlay", { opacity: 1 });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      onEnter: () => {
        const tl = gsap.timeline();

        tl.to(".gallery-wrap", {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
        });

        tl.to(
          ".intro-overlay",
          {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.15"
        );
      },
    });

    return () => trigger.kill();
  }, []);

  // =========================
  // MOUSE MOVE DESKTOP ONLY
  // =========================
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;

    // Get the element's position relative to the viewport
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate position exactly relative to the top-left of this section
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setMouseSide(e.clientX < window.innerWidth / 2 ? "left" : "right");
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
        duration: 1.2,
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
        duration: 1.2,
        ease: "power3.out",
      }
    );

    setCurrentIndex(prevIndex);
  };

  const handleNavigation = () => {
    if (isMobile) return;
    if (mouseSide === "right") {
      goToNext();
    } else {
      goToPrev();
    }
  };

  // =========================
  // RESPONSIVE GALLERY POSITION
  // =========================
  const getTranslateX = () => {
    if (isMobile) {
      // Each slide is 82vw wide with 6vw gap -> move by ~88vw
      return `translateX(calc(9vw - ${currentIndex * 88}vw))`;
    }

    // Desktop / tablet
    return `translateX(calc(24vw - ${currentIndex * 55}vw))`;
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={!isMobile ? handleNavigation : undefined}
      className="
    relative
    w-full
    overflow-hidden
    bg-[#F5F1ED]
    min-h-[840px]
    sm:min-h-[700px]
    md:min-h-[820px]
    md:h-[125vh]
    md:cursor-none
  "
    >
      {/* =========================
          DESKTOP INTERACTIVE CURSOR
      ========================== */}
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
          style={{
            left: 0,
            top: 0,
          }}
        >
          <div
            className={`relative flex items-center -translate-y-1/2 ${mouseSide === "right" ? "flex-row" : "flex-row-reverse"
              }`}
            style={{
              // Adjust alignment anchor dynamically depending on orientation
              transform: mouseSide === "right" ? "translateX(-100%)" : "translateX(0)",
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

      {/* =========================
          HEADING
      ========================== */}
      <div className="absolute top-4 md:top-[2vh] left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none whitespace-nowrap">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-2">
          <div className="h-px w-8 md:w-14 bg-[#B99988]/50" />
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.55em] text-[#9A7869]">
            Discover Categories
          </span>
          <div />
        </div>

        <h2
          className="
  text-[40px]
  sm:text-[52px]
  md:text-[88px]
  lg:text-[108px]
  leading-[0.8]
  tracking-[-0.08em]
  text-[#2B201C]
  font-[350]
"
        >
          Curated
          <br className="md:hidden" />
          <span className="md:ml-4">Beauty</span>
        </h2>
      </div>

      {/* =========================
          INTRO OVERLAY
      ========================== */}
      <div className="intro-overlay fixed inset-0 z-[90] overflow-hidden pointer-events-none">
        <img
          src={CATEGORIES[currentIndex].img}
          alt=""
          className="intro-fullscreen-image absolute inset-0 w-full h-full object-cover will-change-transform"
        />
      </div>

      {/* =========================
          MAIN GALLERY
      ========================== */}
      <div
        className="
    gallery-wrap
    absolute
    inset-x-0
    bottom-0
    w-full
    overflow-hidden
    h-full
    pt-[180px]
    md:pt-[220px]
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
    duration-[1400ms]
    md:duration-[1800ms]
    ease-[cubic-bezier(0.16,1,0.3,1)]
    will-change-transform
    gap-[6vw]
    md:gap-[19vw]
  "
          style={{
            transform: getTranslateX(),
          }}
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

    w-[82vw]
    min-w-[82vw]
    h-[68vh]
    min-h-[500px]

    md:w-[38vw]
    md:min-w-[38vw]
    md:h-[88vh]
    md:min-h-[780px]
  "
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className={`
                    gallery-image-${i}
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-[1400ms]
                    md:duration-[1800ms]
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isActive ? "scale-[1.06]" : "scale-100"}
                  `}
                />

                {/* Mobile image overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent md:hidden" />
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          GLASS INFO BOX
      ========================== */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div
          className="
            absolute
            pointer-events-auto
            overflow-hidden
            border
            border-white/20
            shadow-[0_20px_80px_rgba(0,0,0,0.18)]
            backdrop-blur-[14px]

            left-1/2
            -translate-x-1/2
            bottom-6
            w-[88vw]
            max-w-[420px]

            md:left-auto
            md:translate-x-0
            md:right-[5vw]
            md:bottom-[5vh]
            md:w-[32vw]
            md:min-w-[360px]
            md:max-w-none
          "
        >
          <div className="absolute inset-0 pointer-events-none bg-[#F5F1ED]/84 md:bg-[#F5F1ED]/88" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-black/5" />
          <div className="absolute inset-0 pointer-events-none bg-black/[0.03]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="
                relative z-10
                px-6 pt-6 pb-5
                sm:px-7 sm:pt-7 sm:pb-6
                md:px-14 md:pt-14 md:pb-12
              "
            >
              {/* Number */}
              <div
                className="
                  text-[4.8rem]
                  sm:text-[5.6rem]
                  md:text-[9rem]
                  leading-none
                  font-extralight
                  tracking-[-0.06em]
                  text-[#161311]/85
                  mb-3
                  md:mb-6
                  select-none
                "
              >
                0{currentIndex + 1}
              </div>

              {/* Title */}
              <h3
                className="
                  text-[24px]
                  sm:text-[28px]
                  md:text-[32px]
                  uppercase
                  tracking-[-0.03em]
                  leading-[1]
                  text-[#161311]
                  mb-4
                  md:mb-7
                  font-semibold
                "
              >
                {CATEGORIES[currentIndex].title}
              </h3>

              {/* Description */}
              <p
                className="
                  text-[13px]
                  sm:text-[14px]
                  md:text-[15px]
                  leading-[1.8]
                  md:leading-[2]
                  tracking-[0.01em]
                  text-[#2A2623]
                  max-w-full
                  md:max-w-[92%]
                  font-medium
                "
              >
                {CATEGORIES[currentIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
          {/* Bottom CTA */}
          <div className="relative z-10 border-t border-black/10">
            {/* MOBILE FOOTER */}
            <div className="md:hidden px-5 py-4">
  <div className="flex items-center justify-between gap-4">
    {/* arrows */}
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

    {/* CTA */}
    <Link
      href={CATEGORIES[currentIndex].href}
      onClick={(e) => e.stopPropagation()}
      className="
        shrink-0
        whitespace-nowrap
        text-right
        uppercase
        tracking-[0.18em]
        text-[11px]
        text-[#161311]
      "
    >
      Explore Collection
    </Link>
  </div>
</div>
            {/* DESKTOP FOOTER */}
            <div className="hidden md:flex items-center justify-end px-14 py-5">
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
          absolute
          inset-0
          bg-[#161311]
          translate-y-full
          group-hover:translate-y-0
          transition-transform
          duration-500
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
    </section>
  );
};