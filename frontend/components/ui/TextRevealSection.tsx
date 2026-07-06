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
    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 768;

      // kill any stale triggers inside this section before rebuilding
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          sectionRef.current &&
          trigger.trigger &&
          sectionRef.current.contains(trigger.trigger as Node)
        ) {
          trigger.kill();
        }
      });

      if (isDesktop) {
        const chars = gsap.utils.toArray<HTMLElement>(".compress-char");

        chars.forEach((char, i) => {
          gsap.set(char, {
            x: i * 16,
            opacity: 0.28,
          });
        });

        gsap.to(chars, {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          stagger: {
            each: 0.008,
            from: "start",
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 18%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          ".reveal-para",
          {
            y: 28,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      } else {
        gsap.fromTo(
          ".mobile-fade",
          {
            y: 24,
            opacity: 0,
          },
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
      }

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-[48svh] sm:min-h-[54svh] md:min-h-screen
        w-full
        overflow-hidden
        bg-[#ECE6E1]
        flex
        items-start
        md:items-center
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.avif"
          alt="Soft background texture"
          className="
            h-full
            w-full
            object-cover
            opacity-[0.65]
            scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(to_bottom_right,#ffd1dc,#ffe5ec)]
            mix-blend-multiply
            opacity-45
            pointer-events-none
          "
        />
      </div>

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          w-full
          px-5
          sm:px-7
          md:px-0
          pt-14
          pb-8
          sm:pt-16
          sm:pb-10
          md:pt-0
          md:pb-0
        "
      >
        {/* TOP PARAGRAPH */}
        <div
          className="
    mobile-fade
    relative
    z-20
    max-w-[220px]
    sm:max-w-[280px]
    md:absolute
    md:top-[11vh]
    md:left-[8vw]
    md:max-w-[520px]
    mb-6
    sm:mb-8
    md:mb-0
    opacity-100
  "
        >
          <p
  className="
    reveal-para
    text-left
    text-[13px]
    sm:text-[16px]
    md:text-[40px]
    leading-[1.45]
    md:leading-[1.2]
    tracking-[-0.015em]
    md:tracking-[-0.03em]
    text-white
    font-light
    opacity-100
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

        {/* MAIN TYPOGRAPHY */}
        <div
          className="
            relative
            z-10
            w-full
            md:pl-[42vw]
            md:pr-[4vw]
            md:pt-[30vh]
          "
        >
          {/* MOBILE / TABLET */}
          <div className="mobile-fade block md:hidden">
            <h2
              className="
                max-w-[260px]
                sm:max-w-[320px]
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

          {/* DESKTOP */}
          <div className="hidden md:block">
            <h2
              className="
                text-[clamp(95px,11vw,150px)]
                leading-[0.86]
                tracking-[-0.08em]
                font-extralight
                text-[#FFFDFB]
                whitespace-nowrap
              "
            >
              {lines.map((line, lineIdx) => (
                <div key={lineIdx} className="block">
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
      </div>
    </section>
  );
};