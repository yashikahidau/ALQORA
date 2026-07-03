"use client";

import React, {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TextRevealSection =
  () => {

    const sectionRef =
      useRef<HTMLDivElement>(null);

    const lines = [
      "modern softness",
      "crafted through",
      "editorial luxury",
    ];

    useEffect(() => {

      const ctx = gsap.context(() => {

        const chars =
          gsap.utils.toArray(
            ".compress-char"
          );

        chars.forEach(
          (char: any, i) => {

            const offset =
              i * 18;

            gsap.set(char, {
              x: offset,
              opacity: 0.3,
            });

          }
        );

        gsap.to(".compress-char", {

          x: 0,

          opacity: 1,

          ease: "power2.out",

          stagger: {
            each: 0.008,
            from: "start",
          },

          scrollTrigger: {

            trigger:
              sectionRef.current,

            start: "top 75%",

            end: "top 10%",

            scrub: 1.4,

          },

        });

      }, sectionRef);

      return () => ctx.revert();

    }, []);

    

    return (
  <section
    ref={sectionRef}
    className="
      relative
      min-h-[100svh]
      md:h-screen
      w-full
      overflow-hidden
      bg-[#ECE6E1]
      flex
      items-center
    "
  >
    {/* BACKGROUND */}
    <div className="absolute inset-0 z-0">
      <img
        src="/bg.avif"
        alt="Soft background texture"
        className="
          w-full
          h-full
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

    {/* MOBILE + DESKTOP CONTENT WRAPPER */}
    <div
      className="
        relative
        z-10
        w-full
        px-5
        sm:px-7
        md:px-0
        pt-20
        pb-12
        md:pt-0
        md:pb-0
      "
    >
      {/* TOP PARAGRAPH */}
      <div
        className="
          relative
          z-20
          max-w-[320px]
          sm:max-w-[420px]
          md:absolute
          md:top-[10vh]
          md:left-[8vw]
          md:max-w-[550px]
          mb-10
          md:mb-0
        "
      >
        <p
          className="
            reveal-para
            text-[16px]
            sm:text-[18px]
            md:text-[40px]
            tracking-[-0.03em]
            leading-[1.3]
            md:leading-tight
            text-white
            font-light
          "
        >
          .embrace softness
          <br />
          trust your aura and feel
          <br />
          elevated through modern
          <br />
          beauty rituals+
        </p>
      </div>

      {/* MAIN TYPOGRAPHY */}
      <div
        className="
          relative
          z-10
          w-full

          pl-0
          pr-0
          pt-0

          md:pl-[42vw]
          md:pr-[4vw]
          md:pt-[30vh]
        "
      >
        <h2
          className="
            text-[clamp(42px,13vw,68px)]
            sm:text-[clamp(52px,12vw,82px)]
            md:text-[clamp(95px,11vw,150px)]
            leading-[0.9]
            md:leading-[0.86]
            tracking-[-0.06em]
            md:tracking-[-0.08em]
            font-extralight
            text-[#FFFDFB]
            whitespace-normal
            md:whitespace-nowrap
            max-w-[95%]
            md:max-w-none
          "
        >
          {lines.map((line, lineIdx) => (
            <div key={lineIdx} className="block">
              {line.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="
                    compress-char
                    inline-block
                    will-change-transform
                  "
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
