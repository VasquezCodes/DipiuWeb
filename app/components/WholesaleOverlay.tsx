"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useWholesale } from "../context/WholesaleContext";

export default function WholesaleOverlay() {
    const { isWholesaleOpen, closeWholesale } = useWholesale();
    const overlayRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [interests, setInterests] = useState<string[]>([]); // Track selected products

    const tlRef = useRef<gsap.core.Timeline | null>(null);

    // GSAP Context & Timeline Creation (Runs once)
    useGSAP(() => {
        const tl = gsap.timeline({
            paused: true,
            onStart: () => {
                if (overlayRef.current) overlayRef.current.style.zIndex = "60";
                document.body.style.overflow = "hidden";
            },
            onReverseComplete: () => {
                if (overlayRef.current) overlayRef.current.style.zIndex = "-1";
                document.body.style.overflow = "";
            }
        });

        tl.to(backdropRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" })
            .to(panelRef.current, { x: "0%", duration: 0.6, ease: "power3.out" }, "-=0.3")
            .fromTo(formRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );

        tlRef.current = tl;
    }, { scope: overlayRef }); // Scope to overlay for safety

    // Toggle Logic (Runs on state change)
    useEffect(() => {
        if (!tlRef.current) return;

        if (isWholesaleOpen) {
            tlRef.current.play();
        } else {
            tlRef.current.reverse();
        }
    }, [isWholesaleOpen]);

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[-1] pointer-events-none">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={closeWholesale}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-auto cursor-pointer"
            />

            {/* Slide-out Panel */}
            <div
                ref={panelRef}
                className="absolute top-0 right-0 h-full w-full md:w-[500px] bg-dipiu-beige text-dipiu-black shadow-2xl translate-x-full pointer-events-auto flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-dipiu-black/10">
                    <h2 className="font-serif text-3xl font-bold tracking-tighter">Partner with DiPiù</h2>
                    <button onClick={closeWholesale} className="group p-2 hover:bg-dipiu-black/5 rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content / Form */}
                <div className="flex-1 overflow-y-auto p-8">
                    <p className="font-sans text-sm uppercase tracking-widest opacity-60 mb-8">
                        Bring authentic Italian Tiramisù to your venue.
                    </p>

                    <form ref={formRef} className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll be in touch."); closeWholesale(); }}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Business Name</label>
                            <input type="text" placeholder="e.g. Caffe Roma" className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Contact Person</label>
                            <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Email Address</label>
                            <input type="email" placeholder="hello@example.com" className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-xs uppercase tracking-widest font-bold">I'm interested in...</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setInterests(prev => prev.includes('tiramisu') ? prev.filter(i => i !== 'tiramisu') : [...prev, 'tiramisu'])}
                                    className={`flex-1 py-6 px-4 border transition-all duration-300 flex flex-col items-center gap-1 group ${interests.includes('tiramisu') ? 'bg-dipiu-coffee border-dipiu-coffee text-dipiu-beige' : 'bg-white border-dipiu-black/10 hover:border-dipiu-coffee/50 text-dipiu-black/60'}`}
                                >
                                    <span className="font-serif text-xl italic">Tiramisù</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-60">Classic Collection</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setInterests(prev => prev.includes('sorbet') ? prev.filter(i => i !== 'sorbet') : [...prev, 'sorbet'])}
                                    className={`flex-1 py-6 px-4 border transition-all duration-300 flex flex-col items-center gap-1 group ${interests.includes('sorbet') ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-white border-dipiu-black/10 hover:border-orange-200 text-dipiu-black/60'}`}
                                >
                                    <span className="font-serif text-xl italic">Fruit Sorbets</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-60">100% Natural</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Estimated Volume / Week</label>
                            <select className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors">
                                <option>10 - 50 Units</option>
                                <option>50 - 100 Units</option>
                                <option>100+ Units (Custom)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Message</label>
                            <textarea rows={4} placeholder="Tell us about your venue..." className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors resize-none"></textarea>
                        </div>

                        <button type="submit" className="mt-4 w-full bg-dipiu-red text-dipiu-beige font-sans text-sm uppercase tracking-widest py-4 hover:bg-dipiu-black transition-colors duration-300">
                            Send Enquiry
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
