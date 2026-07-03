     "use client";

     import Link from "next/link";
     import Image from "next/image";

     import {
          Mail,
          Phone,
     } from "lucide-react";

     import {
          FaInstagram,
          FaPinterestP,
     } from "react-icons/fa";

     import { FaXTwitter } from "react-icons/fa6";

     export function Footer() {
          return (
               <footer className="bg-[#F8F1EB]">

                    {/* ================= CTA ================= */}

                    <section className="px-6 md:px-12 lg:px-20">

                         <div
                              className="
     footer-cta
     max-w-[1700px]
     mx-auto
     rounded-[26px]
     border
     border-[#E6DDD7]
     bg-white
     px-6
     sm:px-8
     py-16
     sm:py-20
     md:py-36
     text-center
     shadow-[0_30px_80px_rgba(45,33,29,0.04)]
     "
                         >

                              <span
                                   className="
               text-[10px]
               uppercase
               tracking-[0.4em]
               text-[#A17F72]
               "
                              >
                                   ALQORA BEAUTY
                              </span>

                              <h2
                                   className="
     mt-6
     font-[family:var(--font-cormorant)]
     text-[38px]
     sm:text-[48px]
     md:text-[88px]
     leading-[0.92]
     md:leading-[0.88]
     tracking-[-0.05em]
     md:tracking-[-0.06em]
     text-[#2D211D]
     "
                              >
                                   The Art Of
                                   <br />
                                   Modern Beauty
                              </h2>

                              <p
                                   className="
     mt-5
     max-w-[700px]
     mx-auto
     text-[#8E7468]
     text-[14px]
     sm:text-[15px]
     md:text-base
     leading-[1.8]
     md:leading-[2]
     "
                              >
                                   Explore curated beauty collections,
                                   editorial inspiration and luxury
                                   rituals crafted for the Alqora universe.
                              </p>

                              <Link
                                   href="/shop"
                                   className="
               inline-flex
               items-center
               justify-center
               mt-10
               h-[58px]
               px-10
               rounded-full
               bg-[#7A2E3A]
               text-white
               uppercase
               tracking-[0.35em]
               text-[10px]
               transition-all
               duration-500
               hover:scale-[1.03]
               "
                              >
                                   Explore Collection
                              </Link>

                         </div>

                    </section>

                    {/* ================= FOOTER ================= */}

                    <section
                         className="
               relative
               overflow-hidden
               mt-12
               bg-[#0D0504]
          "
                    >

                         <div
                              className="
               relative
               z-10
               max-w-[1700px]
               mx-auto
               px-6
               md:px-12
               lg:px-20
               pt-16
               pb-72
               "
                         >

                              {/* TOP */}

                              <div
                                   className="
     footer-columns
     grid
     grid-cols-2
     md:grid-cols-2
     xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]
     gap-x-8
     gap-y-10
     "
                              >

                                   {/* BRAND */}

                                   <div className="footer-column col-span-2 xl:col-span-1">

                                        <Link
                                             href="/"
                                             className="
     inline-block
     transition-transform
     duration-500
     hover:scale-[1.03]
     "
                                        >

                                             <div
                                                  className="
          relative
          w-[170px]
          h-[55px]
     "
                                             >

                                                  <Image
                                                       src="/logo.png"
                                                       alt="ALQORA"
                                                       fill
                                                       sizes="170px"
                                                       className="object-contain brightness-0 invert"
                                                  />

                                             </div>

                                        </Link>

                                        <div className="mt-8 space-y-4">

                                             <div
                                                  className="
                         flex
                         items-center
                         gap-3
                         text-[#C7AAA0]
                    "
                                             >

                                                  <Mail size={16} />

                                                  <span>
                                                       hello@alqora.com
                                                  </span>

                                             </div>

                                             <div
                                                  className="
                         flex
                         items-center
                         gap-3
                         text-[#C7AAA0]
                    "
                                             >

                                                  <Phone size={16} />

                                                  <span>
                                                       +91 98765 43210
                                                  </span>

                                             </div>

                                        </div>

                                   </div>


                                   {/* SHOP */}
                                   <div className="footer-column">

                                        <h4
                                             className="
                    text-[#D8A88F]
                    uppercase
                    tracking-[0.3em]
                    text-xs
                    "
                                        >
                                             Shop
                                        </h4>

                                        <div
                                             className="
                    mt-6
                    flex
                    flex-col
                    gap-3
                    text-[#E7D7D1]
                    "
                                        >

                                             <Link href="/shop">Products</Link>
                                             <Link href="/shop">New Arrivals</Link>
                                             <Link href="/wishlist">Wishlist</Link>
                                             <Link href="/cart">Cart</Link>

                                        </div>

                                   </div>

                                   {/* COMPANY */}

                                   {/* COMPANY */}
                                   <div className="footer-column">

                                        <h4
                                             className="
                    text-[#D8A88F]
                    uppercase
                    tracking-[0.3em]
                    text-xs
                    "
                                        >
                                             Company
                                        </h4>

                                        <div
                                             className="
     mt-4
     md:mt-6
     flex
     flex-col
     gap-2.5
     md:gap-3
     text-[#E7D7D1]
     text-[14px]
     md:text-base
     "
                                        >

                                             <Link href="/">About Us</Link>
                                             <Link href="/">Editorial</Link>
                                             <Link href="/">Collections</Link>
                                             <Link href="/">Journal</Link>

                                        </div>

                                   </div>

                                   {/* SUPPORT */}

                                   {/* COMPANY */}
                                   <div className="footer-column">

                                        <h4
                                             className="
                    text-[#D8A88F]
                    uppercase
                    tracking-[0.3em]
                    text-xs
                    "
                                        >
                                             Support
                                        </h4>

                                        <div
                                             className="
                    mt-6
                    flex
                    flex-col
                    gap-3
                    text-[#E7D7D1]
                    "
                                        >

                                             <Link href="/">FAQ</Link>
                                             <Link href="/">Contact</Link>
                                             <Link href="/">Privacy</Link>
                                             <Link href="/">Terms</Link>

                                        </div>

                                   </div>

                                   {/* FOLLOW */}

                                   {/* COMPANY */}
                                   <div className="footer-column">

                                        <h4
                                             className="
                    text-[#D8A88F]
                    uppercase
                    tracking-[0.3em]
                    text-xs
                    "
                                        >
                                             Follow Us
                                        </h4>

                                        <div
                                             className="
     mt-4
     md:mt-6
     flex
     flex-wrap
     gap-3
     "
                                        >

                                             {[
                                                  <FaInstagram />,
                                                  <FaPinterestP />,
                                                  <FaXTwitter />,
                                             ].map((icon, index) => (

                                                  <button
                                                       key={index}
                                                       className="
                         h-11
                         w-11
                         rounded-full
                         border
                         border-[#4A2922]
                         flex
                         items-center
                         justify-center
                         text-[#D8A88F]
                         transition-all
                         duration-500
                         hover:bg-[#7A2E3A]
                         hover:border-[#7A2E3A]
                         hover:text-white
                         "
                                                  >
                                                       {icon}
                                                  </button>

                                             ))}

                                        </div>

                                   </div>

                              </div>

                              {/* COPYRIGHT */}

                              <div
                                   className="
     mt-16
     md:mt-24
     flex
     flex-col
     md:flex-row
     justify-between
     items-center
     gap-3
     text-[#C7AAA0]
     text-center
     md:text-left
     "
                              >

                                   <p>
                                        Privacy & Policy
                                   </p>

                                   <p>
                                        © 2026 ALQORA. All Rights Reserved
                                   </p>

                              </div>

                              {/* DIVIDER */}

                              <div
                                   className="
               mt-6
               h-px
               bg-[#4A2821]
               "
                              />

                         </div>

                         {/* HUGE TYPOGRAPHY */}

                         <div
                              className="
     footer-brand-wrapper
     absolute
     left-[-10px]
     md:left-[-50px]
     bottom-[-40px]
     md:bottom-[-150px]
     w-full
     pointer-events-none
     "
                         >

                              <h2
                                   className="
     whitespace-nowrap
     font-[family:var(--font-cormorant)]
     text-[150px]
     sm:text-[200px]
     md:text-[450px]
     leading-none
     tracking-[-0.08em]
     text-[#7A2E3A]/12
     select-none
     "
                              >  ALQORA
                              </h2>

                         </div>
                    </section>

               </footer>
          );
     }