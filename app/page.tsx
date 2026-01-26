"use client";

import Hero from "./components/Hero";
import Products from "./components/Products";
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
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const hero = heroRef.current;

    // --- Implementación del Efecto de Capas "Pinned" ---
    // Usamos ScrollTrigger para 'pinear' el Hero mientras el contenido sube.

    const pin = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false, // CLAVE: Permite que el contenido (Products) suba SOBRE el Hero
      scrub: true
    });

    // Escala y oscurecimiento progresivo del Hero al hacer scroll
    gsap.to(hero, {
      scale: 0.95, // Se aleja ligeramente
      opacity: 0.6, // Se oscurece para dar foco al contenido nuevo
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top", // Dura toda la altura del viewport
        scrub: true
      }
    });

    return () => {
      pin.kill();
    };

  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="relative w-full bg-dipiu-black">

      {/* 
        CAPA INF: Hero (Pinned via GSAP) 
        Ya no usamos position: fixed CSS. GSAP se encarga del pinning.
        z-0 para estar al fondo.
      */}
      <div ref={heroRef} className="w-full h-[100svh] z-0 will-change-transform">
        <Hero />
      </div>

      {/* 
        CAPA SUP: Contenido (Products + Footer)
        z-10 y background sólido para tapar al Hero mientras sube.
        No necesitamos margins raros, el flujo normal del DOM hará que esto empiece debajo del Hero,
        pero como el Hero está 'pinned' (fixed por GSAP), esto subirá visualmente.
      */}
      <div ref={contentRef} className="relative z-10 w-full bg-dipiu-black shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        <Products />
        <Footer />
      </div>

    </main>
  );
}
