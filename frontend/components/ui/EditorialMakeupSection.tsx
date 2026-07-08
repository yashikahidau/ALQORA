"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Eye Makeup",
    description:
      "Discover soft editorial eye looks crafted for modern femininity and cinematic elegance.",
    image: "/editorial1.png",
  },
  {
    title: "Face Makeup",
    description:
      "Glass skin rituals and luminous complexion essentials inspired by luxury beauty editorials.",
    image: "/editorial2.png",
  },
  {
    title: "Lip Makeup",
    description:
      "Velvet lips, blurred textures and timeless nude tones designed for modern softness.",
    image: "/editorial3.png",
  },
  {
    title: "Featured Beauty",
    description:
      "Curated luxury makeup aesthetics inspired by runway campaigns and contemporary femininity.",
    image: "/editorial4.png",
  },
];

export const EditorialMakeupSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const initTimeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        
        // 1. Heading Entrance
        gsap.fromTo(
          ".editorial-heading",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );

        // 2. Image Cards Entrance (with clean transform clearing)
        gsap.fromTo(
          ".editorial-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            // Clears inline transforms so Tailwind hover scales don't fight with GSAP
            onComplete: () => {
              gsap.set(".editorial-card", { clearProps: "transform" });
            },
           ScrollTrigger: {
              trigger: ".editorial-grid",
              start: "top 90%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }, sectionRef);

      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(initTimeout);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-[#F5F1ED]
        pt-24
        pb-16
        sm:pt-28
        sm:pb-20
        md:pt-32
        md:pb-24
        lg:pt-36
        lg:pb-28
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          top-0
          left-0
          h-[320px]
          w-[320px]
          rounded-full
          bg-[#E7D3C7]/45
          blur-[110px]
          md:h-[520px]
          md:w-[520px]
          md:blur-[150px]
        "
      />

      {/* CONTAINER */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1680px]
          px-5
          sm:px-6
          md:px-10
          lg:px-16
        "
      >
        {/* TOP SECTION */}
        <div
          className="
            flex
            flex-col
            gap-10
            md:gap-12
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* LEFT */}
          <div className="max-w-[920px]">
            <span
              className="
                inline-block
                text-[9px]
                sm:text-[10px]
                uppercase
                tracking-[0.32em]
                sm:tracking-[0.38em]
                text-[#A17F72]
              "
            >
              Beauty Editorial
            </span>

            <h2
              className="
                editorial-heading
                mt-4
                sm:mt-5
                font-[family:var(--font-cormorant)]
                text-[42px]
                leading-[0.92]
                tracking-[-0.05em]
                text-[#2D211D]
                sm:text-[56px]
                md:mt-6
                md:text-[92px]
                md:leading-[0.88]
                lg:text-[150px]
                lg:leading-[0.84]
                lg:tracking-[-0.08em]
              "
            >
              Makeup
              <br />
              Looks & Tips
            </h2>
          </div>

          {/* RIGHT */}
          <div className="max-w-[440px] lg:pb-4">
            <p
              className="
                text-[14px]
                leading-[1.9]
                tracking-[-0.01em]
                text-[#8B7568]
                sm:text-[15px]
                md:text-[17px]
                md:leading-[2]
              "
            >
              Explore elevated beauty rituals, cinematic makeup inspiration,
              modern softness and editorial luxury aesthetics curated for the
              Alqora universe.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div
          className="
            editorial-grid
            mt-12
            grid
            grid-cols-1
            gap-5
            sm:mt-14
            sm:gap-6
            md:mt-16
            md:grid-cols-2
            xl:mt-20
            xl:grid-cols-4
          "
        >
          {cards.map((item) => (
            <div
              key={item.title}
              className="
                editorial-card
                group
                relative
                overflow-hidden
                rounded-[24px]
                bg-[#EFE3DB]
                aspect-[0.82]
                sm:aspect-[0.78]
                md:rounded-[28px]
                xl:aspect-[0.76]
                will-change-transform
              "
            >
              {/* IMAGE */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="
                    object-cover
                    transition-transform
                    duration-[1200ms]
                    ease-out
                    md:group-hover:scale-[1.06]
                  "
                />
              </div>

              {/* OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(to_top,rgba(0,0,0,0.65),rgba(0,0,0,0.15),transparent)]
                  opacity-100
                  md:opacity-70
                  transition-all
                  duration-500
                  md:group-hover:opacity-100
                "
              />

              {/* CONTENT */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  w-full
                  p-6
                  sm:p-7
                  md:p-8
                  xl:p-10
                  opacity-100
                  translate-y-0
                  md:translate-y-4
                  md:opacity-0
                  transition-all
                  duration-500
                  md:group-hover:translate-y-0
                  md:group-hover:opacity-100
                "
              >
                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.35em]
                    text-white/65
                  "
                >
                  Editorial Beauty
                </span>

                <h3
                  className="
                    mt-3
                    text-[24px]
                    sm:text-[28px]
                    md:text-[30px]
                    xl:text-[32px]
                    leading-[0.98]
                    tracking-[-0.04em]
                    text-white
                    font-light
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-3
                    max-w-[260px]
                    text-[13px]
                    leading-[1.7]
                    text-white/75
                  "
                >
                  {item.description}
                </p>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    text-white
                  "
                >
                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.32em]
                      text-white/80
                    "
                  >
                    Explore
                  </span>

                  <span
                    className="
                      text-[18px]
                      transition-transform
                      duration-300
                      md:group-hover:translate-x-1.5
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};