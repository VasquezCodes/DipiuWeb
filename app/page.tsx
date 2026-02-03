"use client";

import Hero from "./components/Hero";
import Products from "./components/Products";
import FruitBanner from "./components/FruitBanner";
import FruitSorbets from "./components/FruitSorbets";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Importante: Registrar el plugin fuera del componente
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const hero = heroRef.current;
    const products = productsRef.current;

    // 1. Hero Pin Logic
    // Using CSS Sticky for positioning, GSAP for animation

    const mm = gsap.matchMedia();

    // Setup animations based on screen size
    mm.add({
      // Desktop: Scale + Opacity
      isDesktop: "(min-width: 769px)",
      // Mobile: Opacity only (Scaling causes jitter on mobile)
      isMobile: "(max-width: 768px)",
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

      gsap.to(hero, {
        scale: isDesktop ? 0.95 : 1, // Only scale on desktop
        opacity: 0.6,
        rotation: 0.01,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true
        }
      });
    });

    // Oscurecer Products mientras Contact sube
    if (products && contactRef.current) {
      gsap.fromTo(products,
        { filter: "brightness(1)" },
        {
          filter: "brightness(0.2)",
          ease: "none",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true
          }
        }
      );
    }


    // 2. Products -> Contact Logic
    // We want Products to hold still while Contact slides over.
    // Trigger when the BOTTOM of products hits the BOTTOM of viewport
    if (products) {
      ScrollTrigger.create({
        trigger: products,
        start: "bottom bottom",
        end: "+=100%", // Pin for screen height
        pin: true,
        pinSpacing: false,
        scrub: true
      });
    }

  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="relative w-full bg-dipiu-black">

      {/* LAYER 0: Hero (Sticky) */}
      {/* 
        Fix: Separate sticky container from animated container to prevent mobile jitter.
        The outer div handles position: sticky.
        The inner div handles scale/opacity transforms.
      */}
      <div className="sticky top-0 w-full h-[100svh] z-0 overflow-hidden">
        <div
          ref={heroRef}
          className="w-full h-full will-change-transform"
        >
          <Hero />
        </div>
      </div>

      {/* LAYER 1: Products */}
      {/* 
        Standard flow. Hero stays sticky at top, Products scrolls over it.
      */}
      <div ref={productsRef} className="relative z-10 w-full bg-dipiu-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Products />
      </div>

      {/* LAYER 2: Fruit Banner */}
      <div className="relative z-15 w-full bg-dipiu-red">
        <FruitBanner />
      </div>

      {/* LAYER 3: Fruit Sorbets (Horizontal Scroll) */}
      <div className="relative z-20 w-full bg-dipiu-beige">
        <FruitSorbets />
      </div>

      {/* LAYER 4: Contact + Footer */}
      <div ref={contactRef} className="relative z-30 w-full bg-dipiu-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Contact />
        <Footer />
      </div>

    </main>
  );
}
