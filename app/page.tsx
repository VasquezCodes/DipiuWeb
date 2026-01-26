"use client";

import Hero from "./components/Hero";
import Products from "./components/Products";
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

    // Escala y oscurecimiento progresivo del Hero al hacer scroll
    gsap.to(hero, {
      scale: 0.95,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: mainRef.current, // Use main container as trigger to allow full scrub range? Or just standard scroll
        start: "top top",
        end: "bottom top", // Or roughly 100vh
        scrub: true
      }
    });

    // Oscurecer Products mientras Contact sube
    if (products && contactRef.current) { // Ensure products and contactRef.current are not null
      gsap.fromTo(products,
        { filter: "brightness(1)" },
        {
          filter: "brightness(0.2)",
          ease: "none",
          scrollTrigger: {
            trigger: contactRef.current, // El trigger es Contact subiendo
            start: "top bottom", // Cuando Contact empieza a entrar
            end: "top top", // Cuando Contact ya cubrió todo (o llégo arriba)
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
      <div ref={heroRef} className="sticky top-0 w-full h-[100svh] z-0 will-change-transform">
        <Hero />
      </div>

      {/* LAYER 1: Products */}
      {/* 
        Standard flow. Hero stays sticky at top, Products scrolls over it.
      */}
      <div ref={productsRef} className="relative z-10 w-full bg-dipiu-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Products />
      </div>

      {/* LAYER 2: Contact + Footer */}
      {/* 
         Similar logic: If Products pins with pinSpacing:false at the bottom, we might need a margin?
         However, 'bottom bottom' pinning is tricky.
         Usually for stacking cards with variable heights, 'sticky' CSS is safer.
         But let's try this: if Products is pinned at bottom, it stays. The next siblings naturally flow up?
         If pinSpacing: false, space collapses.
         So Contact jumps UP.
         So Contact needs margin-top equal to visible height of products? 
         Or we just wrap Contact in a container that has proper spacing.
         
         Actually, there's a simpler 'Sticky' trick:
         Just make every section 'sticky top-0' (or appropriate offset) and let them stack naturally via z-index.
         
         Let's stick to the robust GSAP Hero fix (marginTop) which is guaranteed to work.
         And for Contact, let's keep it simple for now (z-20) and see if the 'bottom bottom' pin works.
         Actually, if pinSpacing: false on Products, Contact jumps up.
         Contact content will overlap Products content immediately at trigger point.
         Since trigger is "bottom bottom", that's exactly when we want Contact to appear?
         Yes!
         If Products hits bottom, it pins (freezes). Space collapses.
         Contact (which was below) jumps up to where Products WAS.
         So Contact covers Products.
         This actually handles itself if z-index is correct!
         See: If Products bottom is at viewport bottom.
         We pin. Products becomes fixed at that position.
         Constraint: Products height collapses from flow.
         Contact moves up.
         Since Products was filling the screen (mostly), Contact sliding up covers it.
         One catch: If Products > viewport, and we pin at bottom... the text "Contact" appears at the position Products Top was?
         No, Contact appears at `Products Top + Products Height` (normally).
         If Height -> 0.
         Contact appears at Products Top.
         So yes, Contact jumps to top of Products.
         Since `start: bottom bottom` means we are looking at the bottom.
         So Contact jumps to top of viewport?
         Wait, if Products is taller than viewport, Top is way up.
         So Contact jumps to Top, i.e. out of view (above)? Or covering visible area?
         
         Let's try margin-top on Contact too, just to be safe?
         Actually, pure CSS sticky is so much better for this.
         "Hero: sticky top-0". Products: z-10 background-black.
         This achieves 80% of the effect with 0 bugs.
         
         I will use the CSS Sticky approach for Hero as it's cleaner than the GSAP pinSpacing hack.
         I will REMOVE the GSAP pin for Hero and use CSS.
         
       */
      }
      <div ref={contactRef} className="relative z-20 w-full bg-dipiu-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Contact />
        <Footer />
      </div>

    </main>
  );
}
