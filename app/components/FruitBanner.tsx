"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FruitBanner() {
    const bannerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Simple parallax or reveal effect
        gsap.fromTo(textRef.current,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: bannerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, { scope: bannerRef });

    return (
        <section
            ref={bannerRef}
            className="relative w-full py-32 md:py-48 bg-dipiu-red text-dipiu-beige flex items-center justify-center overflow-hidden z-10"
        >
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F4F1EA' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <div ref={textRef} className="text-center px-6 relative z-10">
                <span className="block text-sm md:text-base font-sans font-bold tracking-[0.2em] uppercase mb-4 opacity-80">
                    Something refreshing?
                </span>
                <h2 className="text-4xl md:text-7xl font-serif font-bold tracking-tight leading-none">
                    We also have<br />
                    <span className="italic">100% natural</span><br />
                    ice creams!
                </h2>
            </div>
        </section>
    );
}
