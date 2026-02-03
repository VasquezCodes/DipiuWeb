"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sorbets = [
    {
        id: 1,
        name: "Strawberry Lemonade",
        description: "Fresh strawberries blended with zesty lemon. A perfect balance of sweet and tart.",
        image: "dipiuHelados/strawberryLemonade.jpeg",
        color: "bg-red-100" // Light stain/accent
    },
    {
        id: 2,
        name: "Mango & Raspberry",
        description: "Tropical mango sweetness meets tangy raspberry ripples.",
        image: "dipiuHelados/mangoRaspberry.jpeg",
        color: "bg-orange-100"
    },
    {
        id: 3,
        name: "Kiwi, Lemon & Mint",
        description: "A super refreshing green trio. Bright, cool, and invigorating.",
        image: "dipiuHelados/kiwiLemonAndMint.jpeg",
        color: "bg-green-100"
    },
    {
        id: 4,
        name: "Passion Fruit & Orange",
        description: "Exotic passion fruit punch with a citrusy orange twist.",
        image: "dipiuHelados/passionFruitOrange1.jpeg",
        color: "bg-yellow-100"
    },
    {
        id: 5,
        name: "Coconut",
        description: "Creamy, rich coconut. Pure tropical paradise in a scoop.",
        image: "dipiuHelados/coconut.jpeg",
        color: "bg-slate-100"
    }
];

export default function FruitSorbets() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const container = containerRef.current;
        if (!section || !container) return;

        // Dynamic calculation of scroll amount
        const getScrollAmount = () => {
            // Basic check: if container is somehow smaller than window, don't scroll
            const amount = container.scrollWidth - window.innerWidth;
            return amount > 0 ? amount : 0;
        };

        // Horizontal Scroll Animation
        const tween = gsap.to(container, {
            x: () => -getScrollAmount(), // Move left dynamically
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getScrollAmount()}`, // Scroll duration matches distance
                pin: true,
                scrub: 1, // Smooth interaction
                invalidateOnRefresh: true, // Recalculate on resize
                anticipatePin: 1
            }
        });

        return () => {
            tween.kill(); // Cleanup
        };

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-dipiu-beige text-dipiu-black overflow-hidden"
        >
            {/* Horizontal Container */}
            <div
                ref={containerRef}
                className="flex h-full w-fit"
            >
                {/* Intro Slide */}
                <div className="w-screen h-full flex-shrink-0 flex flex-col justify-center items-center p-8 md:p-20 text-center relative border-r border-dipiu-black/5">
                    <div className="max-w-3xl">
                        <span className="block text-sm md:text-base font-sans font-bold tracking-[0.3em] uppercase mb-6 text-dipiu-red">
                            The Fruit Collection
                        </span>
                        <h2 className="text-5xl md:text-8xl font-luckiest font-medium mb-8 leading-tight text-dipiu-coffee">
                            Pure Fruit<br />
                            Pure Joy
                        </h2>
                        <p className="text-xl md:text-2xl opacity-70 font-sans leading-relaxed max-w-2xl mx-auto">
                            Our popsicles are crafted with 100% natural fruit. No dairy, no artificial flavours—just the honest, vibrant taste of nature's best.
                        </p>
                        <div className="mt-12 animate-bounce opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 mx-auto rotate-[-90deg]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
                </div>

                {/* Product Slides */}
                {sorbets.map((sorbet, index) => (
                    <div
                        key={sorbet.id}
                        className={`w-screen h-full flex-shrink-0 flex flex-col md:flex-row relative ${sorbet.color}`}
                    >
                        {/* Image Half */}
                        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden group">
                            <Image
                                src={`/${sorbet.image}`}
                                alt={sorbet.name}
                                fill
                                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                quality={90}
                                priority={index < 2} // Prioritize first couple of images
                            />
                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>

                        {/* Text Half */}
                        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-center items-center md:items-start p-8 md:p-24 bg-white/50 backdrop-blur-sm md:bg-transparent">
                            <span className="text-7xl md:text-9xl font-serif text-dipiu-red/10 absolute top-4 right-4 md:top-12 md:left-12 select-none pointer-events-none">
                                0{index + 1}
                            </span>

                            <h3 className="text-3xl md:text-5xl font-luckiest font-medium mb-6 text-dipiu-coffee">
                                {sorbet.name}
                            </h3>
                            <div className="w-16 h-1 bg-dipiu-red mb-8"></div>
                            <p className="text-lg md:text-xl opacity-80 font-sans md:max-w-md leading-relaxed text-center md:text-left">
                                {sorbet.description}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Coming Soon Slide */}
                <div className="w-screen h-full flex-shrink-0 flex flex-col justify-center items-center p-8 md:p-20 text-center relative bg-dipiu-black text-dipiu-beige">
                    <span className="block text-sm md:text-base font-sans font-bold tracking-[0.3em] uppercase mb-6 text-dipiu-red">
                        Expanded Menu
                    </span>
                    <h2 className="text-5xl md:text-8xl font-luckiest font-medium mb-16 leading-tight">
                        Coming Soon
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 text-2xl md:text-4xl font-serif">
                        {[
                            "Cookies & Cream",
                            "Dulce de Leche",
                            "Chocolate Brownie",
                            "Biscoff"
                        ].map((flavour, index) => (
                            <span key={index} className="opacity-60 hover:opacity-100 hover:text-dipiu-red transition-all duration-300 cursor-default">
                                {flavour}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
