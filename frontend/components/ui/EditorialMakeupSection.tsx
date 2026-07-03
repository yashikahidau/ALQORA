"use client";

import Image from "next/image";

import { motion } from "framer-motion";

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

export const EditorialMakeupSection =
  () => {
    

    return (

      <section
        className="
          relative
          overflow-hidden
          bg-[#F5F1ED]
          py-32
          md:py-40
        "
      >

        {/* BACKGROUND GLOW */}
        <div
          className="
            absolute
            top-0
            left-0
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#E7D3C7]/40
            blur-[150px]
          "
        />

        {/* CONTAINER */}
        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1680px]
            px-6
            md:px-10
            lg:px-16
          "
        >

          {/* TOP SECTION */}
          <div
            className="
              flex
              flex-col
              gap-14
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            {/* LEFT */}
            <div className="max-w-[880px]">

              <span
                className="
                  inline-block
                  text-[10px]
                  uppercase
                  tracking-[0.38em]
                  text-[#A17F72]
                "
              >
                Beauty Editorial
              </span>

              <h2
                className="
                editorial-heading
                  mt-8
                  font-[family:var(--font-cormorant)]
                  text-[78px]
                  leading-[0.84]
                  tracking-[-0.08em]
                  text-[#2D211D]
                  md:text-[120px]
                  lg:text-[170px]
                "
              >
                Makeup
                <br />
                Looks & Tips
              </h2>

            </div>

            {/* RIGHT */}
            <div className="max-w-[420px]">

              <p
                className="
                  text-[16px]
                  leading-[2]
                  tracking-[-0.01em]
                  text-[#8B7568]
                  md:text-[18px]
                "
              >
                Explore elevated beauty rituals,
                cinematic makeup inspiration,
                modern softness and editorial
                luxury aesthetics curated for
                the Alqora universe.
              </p>

            </div>

          </div>

          {/* GRID */}
          <div
            className="
              mt-24
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-4
            "
          >

            {cards.map((item, index) => (

              <motion.div

                key={item.title}

                initial={{
                  opacity: 0,
                  y: 80,
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                }}

                viewport={{
                  once: true,
                  amount: 0.2,
                }}

                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}

                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[30px]
                  bg-[#EFE3DB]
                  aspect-[0.76]
                  cursor-pointer
                "

              >

                {/* IMAGE */}
                <div
                  className="
                    absolute
                    inset-0
                    overflow-hidden
                  "
                >

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    loading="lazy"
                    sizes="
    (max-width: 768px) 100vw,
    (max-width: 1280px) 50vw,
    25vw
  "
                    className="
                      object-cover
                      transition-transform
                      duration-[1800ms]
                      ease-out
                      group-hover:scale-[1.08]
                    "
                  />

                </div>

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-[linear-gradient(to_top,rgba(0,0,0,0.58),rgba(0,0,0,0.08),transparent)]
                    opacity-70
                    transition-all
                    duration-700
                    group-hover:opacity-100
                  "
                />

                {/* CONTENT */}
                <div
                  className="
    absolute
    bottom-0
    left-0
    w-full
    p-10
    translate-y-8
    opacity-0
    transition-all
    duration-700
    group-hover:translate-y-0
    group-hover:opacity-100
  "
                >

                 <span
  className="
    text-[9px]
    uppercase
    tracking-[0.45em]
    text-white/60
  "
>
  Editorial Beauty
</span>

              <h3
  className="
    mt-4
    text-[32px]
    leading-none
    tracking-[-0.04em]
    text-white
    font-light
  "
>
  {item.title}
</h3>

               <p
  className="
    mt-4
    max-w-[240px]
    text-[13px]
    leading-[1.8]
    text-white/70
  "
>
  {item.description}
</p>
                  {/* BUTTON */}
                  <div
  className="
    mt-8
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
      tracking-[0.35em]
      text-white/80
    "
  >
    Explore
  </span>

  <span
    className="
      text-[20px]
      transition-transform
      duration-500
      group-hover:translate-x-2
    "
  >
    →
  </span>
</div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

    );

  };