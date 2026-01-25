"use client";

import Hero from "./components/Hero";
import Products from "./components/Products";
import { useEffect } from "react";
import Lenis from "lenis";

export default function Home() {

  useEffect(() => {
    // Lenis is already initiated in layout/SmoothScroll? 
    // If layout handles it, we don't need to do it here.
    // Based on previous files, layout.tsx uses <SmoothScroll>.
  }, []);

  return (
    <main className="relative w-full bg-dipiu-beige min-h-[100svh]">

      {/* 
        Layered Pinning Logic:
        1. Hero is STICKY at top (z-0). It stays put while we scroll down.
        2. Products is RELATIVE (z-10) with solid background. It scrolls OVER the Hero.
        3. Footer is RELATIVE (z-20). It scrolls normally after Products.
      */}

      {/* Layer 1: Hero (Sticky) */}
      {/* Height must be explicitly 100svh for sticky to work nicely as a full-screen panel, 
          but Hero component handles its own height. We just wrap it or let it be.
          Hero has 'min-h-[100svh]'. We add 'sticky top-0' to it.
      */}
      <div className="sticky top-0 left-0 w-full h-[100svh] z-0">
        <Hero />
      </div>

      {/* Layer 2: Products (Scrolls over Hero) */}
      <div className="relative z-10 w-full bg-dipiu-black">
        <Products />
      </div>

      {/* Layer 3: Footer */}
      <footer className="relative z-20 py-8 bg-dipiu-red text-center text-dipiu-beige font-light text-sm uppercase tracking-widest">
        &copy; {new Date().getFullYear()} DiPiù. All Rights Reserved.
      </footer>
    </main>
  );
}
