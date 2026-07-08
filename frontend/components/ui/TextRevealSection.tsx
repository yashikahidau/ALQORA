"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TextRevealSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const lines = [
    "modern softness",
    "crafted through",
    "editorial luxury",
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // DESKTOP: Initialization styles for the master timeline inside page.tsx
      mm.add("(min-width: 768px)", () => {
        const chars = gsap.utils.toArray<HTMLElement>(
          sectionRef.current!.querySelectorAll(".compress-char")
        );

        gsap.set(chars, {
          x: 16,
          opacity: 0.28,
        });

        // Setup the initial hidden state for the paragraph
        gsap.set(sectionRef.current!.querySelector(".reveal-para"), {
          y: 24,
          opacity: 0,
        });
      });

      // MOBILE: Normal independent scroll triggers (No changes here)
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          sectionRef.current!.querySelectorAll(".mobile-fade"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-[#ECE6E1]
        min-h-[58svh]
        md:min-h-screen
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.avif"
          alt="Soft background texture"
          className="h-full w-full object-cover opacity-[0.65] scale-105"
        />

        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_bottom_right,#ffd1dc,#ffe5ec)]
            mix-blend-multiply
            opacity-45
            pointer-events-none
          "
        />
      </div>

      {/* MOBILE / TABLET */}
      <div
        className="
          relative z-10
          block md:hidden
          px-5 sm:px-7
          pt-14 pb-10
        "
      >
        <div className="mobile-fade max-w-[300px] sm:max-w-[360px] mb-8">
          <p
            className="
              text-left
              text-[14px]
              sm:text-[16px]
              leading-[1.45]
              tracking-[-0.015em]
              text-white
              font-light
            "
          >
            embrace softness,
            <br />
            trust your aura and feel
            <br />
            elevated through modern
            <br />
            beauty rituals.
          </p>
        </div>

        <div className="mobile-fade">
          <h2
            className="
              max-w-[280px]
              sm:max-w-[340px]
              text-left
              text-[clamp(24px,8.6vw,38px)]
              leading-[0.95]
              tracking-[-0.05em]
              font-extralight
              text-[#FFFDFB]
            "
          >
            {lines.map((line, lineIdx) => (
              <div key={lineIdx} className="block">
                {line}
              </div>
            ))}
          </h2>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative z-10 hidden md:block h-screen w-full">
        {/* LEFT PARAGRAPH */}
        <div
          className="
            absolute
            top-[12vh]
            left-[5.5vw]
            z-20
            max-w-[420px]
            lg:max-w-[500px]
          "
        >
          <p
            className="
              reveal-para
              text-left
              text-[30px]
              lg:text-[38px]
              leading-[1.18]
              tracking-[-0.03em]
              text-white
              font-light
            "
          >
            embrace softness,
            <br />
            trust your aura and feel
            <br />
            elevated through modern
            <br />
            beauty rituals.
          </p>
        </div>

        {/* RIGHT TYPOGRAPHY */}
        <div
          className="
            absolute
            right-[2.8vw]
            bottom-[6vh]
            z-10
            flex
            justify-end
          "
        >
          <h2
            className="
              text-right
              text-[clamp(72px,8.4vw,128px)]
              leading-[0.82]
              tracking-[-0.075em]
              font-extralight
              text-[#FFFDFB]
              max-w-[920px]
            "
          >
            {lines.map((line, lineIdx) => (
              <div
                key={lineIdx}
                className="block whitespace-nowrap w-full text-right"
              >
                {line.split("").map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="compress-char inline-block will-change-transform"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
};