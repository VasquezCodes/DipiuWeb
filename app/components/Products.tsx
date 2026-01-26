"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
    { id: 1, name: "Il Classico", image: "classic.jpg" },
    { id: 2, name: "Pistacchio Siciliano", image: "pistacchio.jpg" },
    { id: 3, name: "Biscoff Crunch", image: "biscoff.jpg" },
    { id: 4, name: "Nutella & Hazelnut", image: "nutella.jpg" },
    { id: 5, name: "Limone Fresco", image: "limone.jpg" },
];

const heroSlides = [
    "heroProducts.jpg",
    "heroProducts2.jpg",
    "heroProducts3.jpg"
];

export default function Products() {
    const sectionRef = useRef<HTMLElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Carousel Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Hero Text Animation
        const tl = gsap.timeline();
        tl.from(".hero-subtitle", {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out"
        })
            .from(".hero-title", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5");

        // Title/Intro Animation
        gsap.from(".product-intro", {
            scrollTrigger: {
                trigger: ".product-content",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Grid Stagger Animation
        gsap.from(".product-card", {
            scrollTrigger: {
                trigger: ".product-grid",
                start: "top 85%",
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

    }, { scope: sectionRef });

    return (
        <section
            id="products"
            ref={sectionRef}
            className="relative w-full bg-dipiu-black text-dipiu-beige overflow-hidden"
        >
            {/* 3-Image Carousel with Ken Burns Effect */}
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[70vh] overflow-hidden bg-dipiu-black">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {/* Scale Wrapper for Ken Burns */}
                        <div className={`w-full h-full transition-transform duration-[6000ms] ease-out ${index === currentSlide ? "scale-105" : "scale-100"
                            }`}>
                            <Image
                                src={`/DipiuFotos/${slide}`}
                                alt="Made from Scratch"
                                fill
                                quality={100}
                                unoptimized
                                className="object-cover"
                            />
                        </div>
                        {/* Dark Overlay per slide to ensure consistent contrast */}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                ))}

                {/* Hero Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end items-start md:justify-center md:items-center z-20 text-left md:text-center p-6 md:p-0">
                    <span className="hero-subtitle font-sans text-[10px] md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-4 text-dipiu-beige/80">
                        Local Fresh • With Love
                    </span>
                    <h2 className="hero-title font-sans text-2xl md:text-6xl text-dipiu-beige tracking-tighter drop-shadow-2xl">
                        Made from Scratch.
                    </h2>
                </div>

                {/* Texture Overlay (Grain) - Optional for that "Film/Editorial" look */}
                <div className="absolute inset-0 z-30 pointer-events-none opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
            </div>

            <div className="product-content container mx-auto px-6 md:px-12 py-24">
                {/* Intro Text */}
                <div className="product-intro mb-20 text-center md:text-left max-w-2xl">
                    <p className="font-sans text-xl md:text-2xl leading-relaxed opacity-90 text-dipiu-beige/90">
                        Handcrafted locally in Brisbane. A tribute to authentic Italian tradition, elevated with modern flavors.
                    </p>
                    <div className="w-24 h-[1px] bg-dipiu-red mt-8 mx-auto md:mx-0" />
                </div>

                {/* Grid */}
                <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <div key={product.id} className="product-card group cursor-pointer">
                            {/* Image Wrapper */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg mb-6 shadow-2xl bg-dipiu-black/50">
                                <Image
                                    src={`/DipiuFotos/${product.image}`}
                                    alt={product.name}
                                    fill
                                    quality={100}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    unoptimized
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    suppressHydrationWarning
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>

                            {/* Info */}
                            <div className="flex justify-between items-baseline border-b border-dipiu-beige/20 pb-4">
                                <h3 className="text-xl md:text-2xl font-sans tracking-wide">{product.name}</h3>
                                <div className="overflow-hidden">
                                    <span className="text-xs md:text-sm opacity-60 font-sans tracking-[0.2em] block transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">SCOPRI</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
