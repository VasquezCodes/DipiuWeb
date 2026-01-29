"use client";

import { useState } from "react";

export default function Contact() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section className="w-full bg-dipiu-beige text-dipiu-red py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden relative">

            {/* Feedback Toast */}
            <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-dipiu-red text-dipiu-beige px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 z-50 ${copied ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                {copied} COPIED!
            </div>

            {/* Background Texture/Decoration (Optional - keeping it clean for now) */}

            <div className="container mx-auto px-6 relative z-10">
                <span className="block text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-6 opacity-80">
                    Get in Touch
                </span>

                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12 leading-none">
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
            </div>
        </section>
    );
}
