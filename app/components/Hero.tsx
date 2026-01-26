"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// import { useRef } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { Flip } from "gsap/Flip";

// gsap.registerPlugin(Flip);

const slides = [
    {
        img: "cardStack1.jpg",
        title: <>Hand<br />crafted<br />Tiramisù.</>,
        subtitle: "Brisbane City • Queensland",
        position: "justify-center items-center text-center"
    },
    {
        img: "cardStack2.jpg",
        title: <>Authentic<br />Italian<br />Recipe.</>,
        subtitle: "A Taste of Heritage in Every Bite",
        position: "justify-end items-start text-left pb-32 pl-6 md:pl-20"
    },
    {
        img: "cardStack3v3.jpg",
        title: <>Premium<br />Local<br />Ingredients.</>,
        subtitle: "Mascarpone, Savoiardi & Espresso",
        position: "justify-start items-end text-right pt-40 pr-6 md:pr-20"
    },
    {
        img: "cardStack4.jpg",
        title: <>Made<br />With<br />Passion.</>,
        subtitle: "Small Batch • Big Flavour",
        position: "justify-center items-start text-left pl-6 md:pl-20"
    },
    {
        img: "cardStack5.jpg",
        title: <>Sweet<br />Moments<br />Shared.</>,
        subtitle: "Perfect for Any Occasion",
        position: "justify-end items-end text-right pb-32 pr-6 md:pr-20"
    },
    {
        img: "cardStack6.jpg",
        title: <>Freshly<br />Prepared<br />Daily.</>,
        subtitle: "Order Yours Today",
        position: "justify-center items-center text-center"
    }
];

export default function Hero() {
    // --- NEW IMPLEMENTATION: Background Slider ---
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full h-[100svh] bg-dipiu-red overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={`/DipiuFotos/${slide.img}`}
                            alt={`Hero Background ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            quality={90}
                        />
                        {/* Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Content */}
                    <div className={`relative w-full h-full flex flex-col px-6 ${slide.position}`}>
                        <div className={`flex flex-col ${slide.position.includes("text-center") ? "items-center" : slide.position.includes("text-right") ? "items-end" : "items-start"} transition-all duration-[2000ms] transform ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}>
                            <h1 className="font-serif text-[10vw] md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="mt-8 font-sans text-sm md:text-sm tracking-[0.3em] uppercase opacity-90 border-t border-current pt-6 drop-shadow-md">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );

    /* 
    // --- OLD IMPLEMENTATION: Card Stack ---
    const containerRef = useRef<HTMLDivElement>(null);
    const stackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const stack = stackRef.current;
        if (!stack) return;

        let mm = gsap.matchMedia(containerRef);

        mm.add({
            isMobile: "(max-width: 768px)",
            isDesktop: "(min-width: 769px)",
        }, (context) => {
            let { isMobile } = context.conditions as { isMobile: boolean };
            const step = isMobile ? 12 : 20; // Reduce spread on mobile

            // Helper to enforce the "Stack" layout based on DOM order
            function applyStackLayout(animate = false) {
                if (!stack) return;

                // Filter active cards (exclude exiting)
                let children = Array.from(stack.children).filter(c => !c.classList.contains("exiting")) as HTMLElement[];

                // Safety: Ensure we only style the last 6 items to prevent visual overflow if cleanup lags
                if (children.length > cards.length) {
                    children = children.slice(children.length - cards.length);
                }

                children.forEach((card, i) => {
                    const reversedIndex = children.length - 1 - i;

                    // Config for the stack visual (diagonal offset)
                    const offset = reversedIndex * step;

                    gsap.set(card, {
                        x: offset,
                        y: -offset,
                        zIndex: i,
                        scale: 1,
                        opacity: 1
                    });
                });
            }

            // Initial Layout setup
            applyStackLayout();

            function moveCard() {
                if (!stack) return;

                // 0. Safety Cleanup: Remove any old 'exiting' cards that stuck around
                stack.querySelectorAll(".exiting").forEach(el => el.remove());

                const lastItem = stack.lastElementChild as HTMLElement;
                if (!lastItem) return;

                // 1. Capture State
                const state = Flip.getState(".card-item");

                // 2. Modify DOM
                lastItem.style.display = "none";
                lastItem.classList.add("exiting");

                const newItem = lastItem.cloneNode(true) as HTMLElement;
                newItem.style.display = "flex";
                newItem.classList.remove("exiting");

                stack.prepend(newItem);

                // 3. Re-apply Layout
                applyStackLayout();

                // 4. Flip Animation
                Flip.from(state, {
                    targets: ".card-item:not(.exiting)",
                    duration: 0.6,
                    ease: "sine.inOut",
                    absolute: true,
                    onEnter: (elements) => {
                        return gsap.fromTo(elements,
                            { opacity: 0, scale: 0.9, yPercent: 20 },
                            { opacity: 1, scale: 1, yPercent: 0, duration: 0.4 }
                        );
                    },
                    onLeave: (elements) => {
                        // Manual exit animation
                        lastItem.style.display = "flex";

                        return gsap.to(lastItem, {
                            x: isMobile ? -100 : -200,
                            y: 50,
                            opacity: 0,
                            rotation: -15,
                            duration: 0.4,
                            ease: "expo.out",
                            onComplete: () => lastItem.remove()
                        });
                    }
                });

                gsap.delayedCall(2, moveCard);
            }

            // Start loop (save reference to kill if needed, but matchMedia handles cleanup mostly)
            const timer = gsap.delayedCall(1, moveCard);

            return () => {
                timer.kill();
                gsap.killTweensOf(moveCard);
            };
        });

    }, { scope: containerRef });

    return (
        <section
            id="hero-section"
            ref={containerRef}
            className="relative min-h-[100svh] w-full bg-dipiu-red flex items-center justify-center overflow-hidden pt-32 pb-20 md:py-0"
        >
            <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 items-center h-full">
                // Left: Typography 
                <div className="z-10 text-dipiu-beige flex flex-col justify-center items-start order-2 md:order-1">
                    <h1 className="font-serif text-[15vw] md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter">
                        Hand<br />crafted<br />Tiramisù.
                    </h1>
                    <p className="mt-8 font-sans text-xs md:text-sm tracking-[0.2em] uppercase opacity-80 border-t border-current pt-4">
                        Brisbane City • Queensland
                    </p>
                </div>

                // Right: Card Stack Container
                <div className="relative w-full h-[40svh] md:h-full flex items-center justify-center perspective-[1000px] order-1 md:order-2">
                    <div
                        ref={stackRef}
                        // We translate X slightly on mobile to visual-center the fanned stack (which grows right)
                        className="relative w-56 h-72 md:w-80 md:h-[28rem] -translate-x-6 md:translate-x-0 transition-transform"
                    >
                        {cards.map((img, i) => (
                            <div
                                key={i}
                                className="card-item absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-[4px] border-dipiu-beige bg-white flex items-center justify-center"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={`/DipiuFotos/${img}`}
                                        alt={`DiPiù Card ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={i >= cards.length - 2}
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
    */
}
