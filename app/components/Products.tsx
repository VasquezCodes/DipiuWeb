"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
    { id: 1, name: "Classico Cup", image: "DIPIU-02.jpg" },
    { id: 2, name: "Pistachio Dream", image: "DIPIU-04.jpg" },
    { id: 3, name: "Hazelnut Textures", image: "DIPIU-11.jpg" },
    { id: 4, name: "Events Tray", image: "DIPIU-13.jpg" },
    { id: 5, name: "The Gift Set", image: "DIPIU-27.jpg" },
];

export default function Products() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Title Animation
        gsap.from(".product-title", {
            scrollTrigger: {
                trigger: section,
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
            className="relative w-full py-24 bg-dipiu-black text-dipiu-beige overflow-hidden"
        >
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="mb-20 text-center md:text-left">
                    <h2 className="product-title font-sans text-5xl md:text-7xl leading-tight">
                        Our<br />Collection.
                    </h2>
                    <div className="w-full h-[1px] bg-dipiu-beige/20 mt-8" />
                </div>

                {/* Grid */}
                <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <div key={product.id} className="product-card group cursor-pointer">
                            {/* Image Wrapper */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg mb-6">
                                <Image
                                    src={`/DipiuFotos/${product.image}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    suppressHydrationWarning
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>

                            {/* Info */}
                            <div className="flex justify-between items-baseline border-b border-dipiu-beige/20 pb-4">
                                <h3 className="text-xl md:text-2xl font-sans">{product.name}</h3>
                                <span className="text-sm opacity-60 font-sans tracking-widest hidden group-hover:block animate-in fade-in duration-300">VIEW</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
