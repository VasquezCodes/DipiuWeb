"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const products = [
    {
        id: 1,
        name: "Il Classico",
        image: "classic.jpg",
        description: "The timeless Italian icon. Authentic Savoiardi fingers soaked in rich espresso, layered with velvety mascarpone cream and dusted with premium cocoa powder."
    },
    {
        id: 2,
        name: "Pistacchio Siciliano",
        image: "pistacchio.jpg",
        description: "A luxurious Sicilian twist. Espresso-infused Savoiardi and creamy mascarpone blended with pure pistachio paste, finished with a crunch of crushed pistachios."
    },
    {
        id: 3,
        name: "Biscoff Crunch",
        image: "biscoff.jpg",
        description: "Caramelised perfection. A warming touch of cinnamon elevates the espresso-soaked Savoiardi and mascarpone cream, finished with a crunch of Biscoff cookies."
    },
    {
        id: 4,
        name: "Nutella & Hazelnut",
        image: "nutella.jpg",
        description: "Pure indulgence. Espresso-soaked Savoiardi met with smooth mascarpone and generous ribbons of rich Nutella, finished with crushed hazelnuts."
    },
    {
        id: 5,
        name: "Limone Fresco",
        image: "limone.jpg",
        description: "A bold, refreshing contrast. Zesty homemade lemon curd swirls through creamy mascarpone and espresso-kissed Savoiardi."
    },
];

const heroSlides = [
    "heroProducts.jpg",
    "heroProducts2.jpg",
    "heroProducts3.jpg"
];

export default function Products() {
    const sectionRef = useRef<HTMLElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Lógica del Carrusel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Animación del Texto Hero
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
            }, "-=0.5")
            .to(".hero-cta", {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5");

        // Animación Título/Intro
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

        // Animación Escalonada del Grid
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
            {/* Carrusel de 3 imágenes con efecto Ken Burns */}
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[70vh] overflow-hidden bg-dipiu-black">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {/* Wrapper para escala (Ken Burns) */}
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
                        {/* Capa oscura para contraste */}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                ))}

                {/* Superposición de Contenido Hero */}
                <div className="absolute inset-0 flex flex-col justify-end items-start md:justify-center md:items-center z-20 text-left md:text-center p-6 md:p-0">
                    <span className="hero-subtitle font-sans text-[10px] md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-4 text-dipiu-beige/80">
                        Local Fresh • With Love
                    </span>
                    <h2 className="hero-title font-sans text-2xl md:text-6xl text-dipiu-beige tracking-tighter drop-shadow-2xl mb-8">
                        Made from Scratch.
                    </h2>

                    {/* CTA Button */}
                    <button
                        onClick={() => {
                            const grid = document.querySelector(".product-content");
                            if (grid) {
                                gsap.to(window, { duration: 1.5, scrollTo: { y: grid, offsetY: 100 }, ease: "power3.inOut" });
                            }
                        }}
                        className="hero-cta group relative px-6 py-2 overflow-hidden rounded-full border border-dipiu-beige/30 bg-dipiu-black/20 backdrop-blur-sm transition-all duration-500 hover:bg-dipiu-beige hover:border-dipiu-beige opacity-0 translate-y-4"
                    >
                        <span className="relative z-10 font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-dipiu-beige group-hover:text-dipiu-black transition-colors duration-500 flex items-center gap-2">
                            Discover our flavours
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 transform group-hover:translate-y-0.5 transition-transform duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Superposición de Textura (Grano) */}
                <div className="absolute inset-0 z-30 pointer-events-none opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
            </div>

            <div className="product-content container mx-auto px-6 md:px-12 py-24">
                {/* Intro Text */}
                <div className="product-intro mb-20 text-center md:text-left max-w-2xl">
                    <p className="font-sans text-xl md:text-2xl leading-relaxed opacity-90 text-dipiu-beige/90">
                        Handcrafted locally in Brisbane. A tribute to authentic Italian tradition, elevated with modern flavours.
                    </p>
                    <div className="w-24 h-[1px] bg-dipiu-red mt-8 mx-auto md:mx-0" />
                </div>

                {/* Grid (Flex para centrar elementos impares) */}
                <div className="product-grid flex flex-wrap justify-center gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="product-card group cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]" // Flex widths: Mobile 100%, MD 2-col, LG 3-col
                        >
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
                            <div className="flex flex-col border-b border-dipiu-beige/20 pb-4">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl md:text-2xl font-sans tracking-wide">{product.name}</h3>
                                    {/* Arrow icon instead of text */}
                                    <span className="opacity-60 transform group-hover:translate-x-1 transition-transform duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                        </svg>
                                    </span>
                                </div>
                                <p className="text-sm opacity-70 font-sans font-light leading-relaxed max-w-[90%] group-hover:opacity-100 transition-opacity duration-300">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
