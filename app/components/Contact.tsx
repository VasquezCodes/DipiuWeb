"use client";

import { useState } from "react";
import { useWholesale } from "../context/WholesaleContext";

export default function Contact() {
    const [copied, setCopied] = useState<string | null>(null);
    const { openEvents } = useWholesale();

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section id="contact" data-nav-ink="dark" aria-label="Contact DiPiù Tiramisu" className="w-full bg-dipiu-beige text-dipiu-red py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden relative">

            {/* Feedback Toast */}
            <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-dipiu-red text-dipiu-beige px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 z-50 ${copied ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                {copied} COPIED!
            </div>

            {/* Background Texture/Decoration (Optional - keeping it clean for now) */}

            <div className="container mx-auto px-6 relative z-10">
                <span className="block text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-6 opacity-80">
                    Get in Touch
                </span>

                <h2 className="text-4xl md:text-6xl font-luckiest tracking-tighter mb-12 leading-none">
                    Have a sweet<br />enquiry?
                </h2>

                <div className="flex flex-col gap-8 md:gap-12 items-center">
                    {/* Email - Large and Central */}
                    <button
                        onClick={() => handleCopy("dipiutiramisu@gmail.com", "EMAIL")}
                        className="text-2xl md:text-4xl font-serif hover:scale-105 transition-transform duration-300 border-b-2 border-dipiu-red/20 hover:border-dipiu-red pb-1 cursor-copy"
                    >
                        dipiutiramisu@gmail.com
                    </button>

                    {/* Phones - Side by Side or Stacked */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-16 text-lg md:text-xl font-medium tracking-wide">
                        <button onClick={() => handleCopy("0416306220", "PHONE")} className="hover:opacity-70 transition-opacity cursor-copy">
                            0416 306 220
                        </button>
                        <span className="hidden md:block opacity-30">•</span>
                        <button onClick={() => handleCopy("0434951515", "PHONE")} className="hover:opacity-70 transition-opacity cursor-copy">
                            0434 951 515
                        </button>
                    </div>
                </div>

                {/* Consulta de eventos */}
                <div className="mt-16 md:mt-20 mx-auto max-w-md flex flex-col items-center gap-6 border-t border-dipiu-red/15 pt-12">
                    <p className="font-luckiest text-2xl md:text-3xl tracking-tight leading-tight text-balance">
                        Planning a wedding, birthday or work do?
                    </p>
                    <button
                        type="button"
                        onClick={openEvents}
                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-dipiu-red px-8 py-4 font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white cursor-pointer transition-transform duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dipiu-red"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 origin-left scale-x-0 bg-dipiu-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                        />
                        <span className="relative">Send an event enquiry</span>
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="relative w-4 h-4 transition-[translate] duration-500 group-hover:translate-x-1"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
