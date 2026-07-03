import React, { forwardRef } from 'react';

const Hero = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white">
      
      {/* Main Background Image */}
      <div 
        className="hero-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      
      {/* ALQORA Text */}
      <h1 className="alqora-text relative z-10 text-[12vw] font-bold uppercase select-none leading-none tracking-tighter">
        Alqora
      </h1>

      <style jsx>{`
       @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap');
       
        .alqora-text {
          font-family: 'Bodoni Moda', serif;
          color: transparent;
          background-image: url('/hero.jpg');
          background-size: 100vw 100vh;
          background-position: center;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0; 
          position: relative;
          z-index: 50; /* Keeps text above the rising NextSection */
        }
      `}</style>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;