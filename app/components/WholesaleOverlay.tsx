"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useWholesale } from "../context/WholesaleContext";
import { usePathname } from "next/navigation";

export default function WholesaleOverlay() {
    const pathname = usePathname();
    const { isWholesaleOpen, closeWholesale } = useWholesale();
    const overlayRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [interests, setInterests] = useState<string[]>([]);

    // Hide on admin routes
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    // Form States
    const [formData, setFormData] = useState({
        businessName: "",
        contactPerson: "",
        email: "",
        volume: "10 - 50 Units",
        message: ""
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const tlRef = useRef<gsap.core.Timeline | null>(null);

    // Initial GSAP Setup
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
                // Reset form on close if successful
                if (status === 'success') {
                    setStatus('idle');
                    setFormData({ businessName: "", contactPerson: "", email: "", volume: "10 - 50 Units", message: "" });
                    setInterests([]);
                }
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
    }, { scope: overlayRef, dependencies: [status] });

    useEffect(() => {
        if (!tlRef.current) return;
        isWholesaleOpen ? tlRef.current.play() : tlRef.current.reverse();
    }, [isWholesaleOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, interests }),
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    closeWholesale();
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[-1] pointer-events-none">
            <div
                ref={backdropRef}
                onClick={closeWholesale}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-auto cursor-pointer"
            />

            <div
                ref={panelRef}
                className="absolute top-0 right-0 h-full w-full md:w-[500px] bg-dipiu-beige text-dipiu-black shadow-2xl translate-x-full pointer-events-auto flex flex-col"
            >
                <div className="flex justify-between items-center p-8 border-b border-dipiu-black/10">
                    <h2 className="font-serif text-3xl font-bold tracking-tighter">Partner with DiPiù</h2>
                    <button onClick={closeWholesale} className="group p-2 hover:bg-dipiu-black/5 rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 relative">
                    {/* Success Message Overlay */}
                    {status === 'success' && (
                        <div className="absolute inset-0 bg-dipiu-beige z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-2">Grazie!</h3>
                            <p className="font-sans text-sm opacity-70">We received your enquiry and will be in touch shortly.</p>
                        </div>
                    )}

                    <p className="font-sans text-sm uppercase tracking-widest opacity-60 mb-8">
                        Bring authentic Italian Tiramisù to your venue.
                    </p>

                    <form ref={formRef} className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Business Name</label>
                            <input
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g. Caffe Roma"
                                required
                                className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Contact Person</label>
                            <input
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                type="text"
                                placeholder="Your Name"
                                required
                                className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Email Address</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="hello@example.com"
                                required
                                className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors"
                            />
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
                                    <span className="font-serif text-xl italic">Fruit Popsicles</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-60">100% Natural</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Estimated Volume / Week</label>
                            <select
                                name="volume"
                                value={formData.volume}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors"
                            >
                                <option>10 - 50 Units</option>
                                <option>50 - 100 Units</option>
                                <option>100+ Units (Custom)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your venue..."
                                className="w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="mt-4 w-full bg-dipiu-red text-dipiu-beige font-sans text-sm uppercase tracking-widest py-4 hover:bg-dipiu-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : "Send Enquiry"}
                        </button>
                        {status === 'error' && (
                            <p className="text-red-600 text-xs text-center font-bold">Something went wrong. Please try again or email us directly.</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
