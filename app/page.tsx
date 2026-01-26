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
    <main className="relative w-full min-h-screen bg-dipiu-black">
      {/* 
        Fix for Mobile "Sticky" Jitter:
        Instead of position: sticky, we use position: fixed for the Hero 
        and a transparent spacer in the normal flow.
        
        1. Hero is FIXED at the back (z-0).
        2. Content wrapper is RELATIVE (z-10) and scrolls over it.
        3. The first element in content wrapper is a TRANSPARENT SPACER equal to Hero height.
      */}

      {/* Hero Layer (Fixed) */}
      <div className="fixed top-0 left-0 w-full h-[100svh] z-0">
        <Hero />
      </div>

      {/* Scrollable Content Layer (Relative) */}
      <div className="relative z-10 w-full flex flex-col">

        {/* Transparent Spacer (Reveals Hero) */}
        <div className="w-full h-[100svh] bg-transparent pointer-events-none" />

        {/* Solid Content (Covers Hero) */}
        <div className="w-full bg-dipiu-black">
          <Products />
        </div>

        {/* Footer */}
        <footer id="contact" className="w-full py-8 bg-dipiu-red text-center text-dipiu-beige font-light text-sm uppercase tracking-widest">
          &copy; {new Date().getFullYear()} DiPiù. All Rights Reserved.
        </footer>

      </div>
    </main>
  );
}
