"use client";

import React, { forwardRef, useEffect, useState } from "react";

const Hero = forwardRef<HTMLDivElement>((props, ref) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white"
    >
      {/* Main Background Image */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* subtle overlay for readability on mobile */}
      <div className="absolute inset-0 z-[5] bg-black/10 md:bg-transparent" />

      {/* ALQORA TEXT */}
      <h1
        className={`
    alqora-text
    relative
    z-10
    select-none
    uppercase
    text-center
    leading-none
    tracking-[-0.06em]
    px-4
    text-[18vw] sm:text-[16vw] md:text-[12vw]
  `}
      >
        ALQORA
      </h1>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap");

        .alqora-text {
          font-family: "Bodoni Moda", serif;
          font-weight: 700;
          position: relative;
          z-index: 50;
          will-change: transform, opacity;
        }

        /* DESKTOP: image-filled text for GSAP hero animation */
        @media (min-width: 768px) {
          .alqora-text {
            color: transparent;
            background-image: url("/hero.jpg");
            background-size: 100vw 100vh;
            background-position: center;
            background-repeat: no-repeat;
            -webkit-background-clip: text;
            background-clip: text;
            opacity: 0;
          }
        }

        /* MOBILE: keep it simple and stable */
        @media (max-width: 767px) {
  .alqora-text {
    color: rgba(255, 250, 246, 0.96);
    background: none;
    -webkit-background-clip: initial;
    background-clip: initial;
    opacity: 1;
    text-shadow:
      0 1px 2px rgba(0, 0, 0, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4vh);
  }
}
      `}</style>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;