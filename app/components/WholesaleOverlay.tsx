"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useWholesale, EnquiryType } from "../context/WholesaleContext";
import { usePathname } from "next/navigation";

const initialFormData = {
    businessName: "",
    contactPerson: "",
    email: "",
    volume: "10 - 50 Units",
    message: "",
    // Eventos
    phone: "",
    occasion: "Wedding",
    eventDate: "",
    guests: "Under 50 guests",
    venue: "",
};

const enquiryTabs: { type: EnquiryType; label: string }[] = [
    { type: "wholesale", label: "Wholesale" },
    { type: "events", label: "Events & parties" },
];

const copy: Record<EnquiryType, { title: string; intro: string; messagePlaceholder: string }> = {
    wholesale: {
        title: "Partner with DiPiù",
        intro: "Bring authentic Italian Tiramisù to your venue.",
        messagePlaceholder: "Tell us about your venue...",
    },
    events: {
        title: "Bring DiPiù to your event",
        intro: "Tell us about your celebration and we'll get back to you with availability.",
        messagePlaceholder: "Tell us about the day...",
    },
};

const labelClass = "text-xs uppercase tracking-widest font-bold";
const fieldClass = "w-full bg-transparent border-b border-dipiu-black/20 py-2 focus:border-dipiu-red focus:outline-none transition-colors";

export default function WholesaleOverlay() {
    const pathname = usePathname();
    const { isWholesaleOpen, enquiryType, setEnquiryType, closeWholesale } = useWholesale();
    const overlayRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [interests, setInterests] = useState<string[]>([]);
    const [services, setServices] = useState<string[]>([]);

    // Form States
    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const statusRef = useRef(status);

    const isEvents = enquiryType === "events";

    // Keep ref in sync with state
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    // Initial GSAP Setup — NO status dependency!
    useGSAP(() => {
        if (!overlayRef.current) return;

        const tl = gsap.timeline({
            paused: true,
            onStart: () => {
                if (overlayRef.current) overlayRef.current.style.zIndex = "60";
                document.body.style.overflow = "hidden";
            },
            onReverseComplete: () => {
                if (overlayRef.current) overlayRef.current.style.zIndex = "-1";
                document.body.style.overflow = "";
                // Reset form on close if successful — read from ref, not stale closure
                if (statusRef.current === 'success' || statusRef.current === 'error') {
                    setStatus('idle');
                    setFormData(initialFormData);
                    setInterests([]);
                    setServices([]);
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
    }, { scope: overlayRef });

    useEffect(() => {
        if (!tlRef.current) return;
        isWholesaleOpen ? tlRef.current.play() : tlRef.current.reverse();
    }, [isWholesaleOpen]);

    // Hide on admin routes (después de los hooks para no romper su orden)
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggle = (setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setList(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, enquiryType, interests, services }),
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    closeWholesale();
                }, 3500);
            } else {
                const data = await res.json().catch(() => ({}));
                console.error('Email API error:', data);
                setStatus('error');
            }
        } catch (error) {
            console.error('Network error sending email:', error);
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
                    <h2 className="font-serif text-3xl font-bold tracking-tighter">{copy[enquiryType].title}</h2>
                    <button onClick={closeWholesale} aria-label="Close enquiry" className="group p-2 hover:bg-dipiu-black/5 rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tipo de consulta */}
                <div role="group" aria-label="Enquiry type" className="flex gap-8 px-8 border-b border-dipiu-black/10">
                    {enquiryTabs.map(({ type, label }) => {
                        const isActive = enquiryType === type;
                        return (
                            <button
                                key={type}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => setEnquiryType(type)}
                                className={`relative py-4 text-xs uppercase tracking-widest font-bold transition-colors duration-300 cursor-pointer ${isActive ? "text-dipiu-black" : "text-dipiu-black/65 hover:text-dipiu-black"}`}
                            >
                                {label}
                                <span
                                    aria-hidden="true"
                                    className={`absolute left-0 bottom-0 h-0.5 w-full bg-dipiu-red origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"}`}
                                />
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto p-8 relative" data-lenis-prevent>
                    {/* Success Message Overlay */}
                    {status === 'success' && (
                        <div
                            className="absolute inset-0 bg-dipiu-beige z-20 flex flex-col items-center justify-center text-center p-8"
                            style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
                        >
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-3xl font-bold mb-3 text-dipiu-black">Grazie!</h3>
                            <p className="font-sans text-base text-dipiu-black/70 max-w-xs">We received your enquiry and will be in touch shortly.</p>
                        </div>
                    )}

                    {/* Error Message Overlay */}
                    {status === 'error' && (
                        <div
                            className="absolute inset-0 bg-dipiu-beige z-20 flex flex-col items-center justify-center text-center p-8"
                            style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
                        >
                            <div className="w-20 h-20 bg-red-100 text-dipiu-red rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-3 text-dipiu-black">Oops!</h3>
                            <p className="font-sans text-base text-dipiu-black/70 max-w-xs mb-6">Something went wrong. Please try again or email us directly.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-6 py-3 bg-dipiu-red text-dipiu-beige font-sans text-xs uppercase tracking-widest hover:bg-dipiu-black transition-colors duration-300"
                                >
                                    Try Again
                                </button>
                                <a
                                    href="mailto:dipiutiramisu@gmail.com"
                                    className="px-6 py-3 border border-dipiu-black/20 text-dipiu-black font-sans text-xs uppercase tracking-widest hover:bg-dipiu-black/5 transition-colors duration-300"
                                >
                                    Email Us
                                </a>
                            </div>
                        </div>
                    )}

                    <p className="font-sans text-sm uppercase tracking-widest opacity-60 mb-8">
                        {copy[enquiryType].intro}
                    </p>

                    <form ref={formRef} className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {!isEvents && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="enquiry-business" className={labelClass}>Business Name</label>
                                <input
                                    id="enquiry-business"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Caffe Roma"
                                    required
                                    className={fieldClass}
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="enquiry-name" className={labelClass}>{isEvents ? "Your Name" : "Contact Person"}</label>
                            <input
                                id="enquiry-name"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                type="text"
                                placeholder="Your Name"
                                autoComplete="name"
                                required
                                className={fieldClass}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="enquiry-email" className={labelClass}>Email Address</label>
                            <input
                                id="enquiry-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="hello@example.com"
                                autoComplete="email"
                                required
                                className={fieldClass}
                            />
                        </div>

                        {isEvents ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="enquiry-phone" className={labelClass}>Phone <span className="font-normal opacity-75 normal-case tracking-normal">(optional)</span></label>
                                    <input
                                        id="enquiry-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="04XX XXX XXX"
                                        autoComplete="tel"
                                        className={fieldClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="enquiry-occasion" className={labelClass}>Occasion</label>
                                    <select
                                        id="enquiry-occasion"
                                        name="occasion"
                                        value={formData.occasion}
                                        onChange={handleChange}
                                        className={fieldClass}
                                    >
                                        <option>Wedding</option>
                                        <option>Engagement</option>
                                        <option>Birthday</option>
                                        <option>Christening</option>
                                        <option>Corporate event</option>
                                        <option>Something else</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="enquiry-date" className={labelClass}>Event Date</label>
                                        <input
                                            id="enquiry-date"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                            type="date"
                                            className={fieldClass}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="enquiry-guests" className={labelClass}>Guests</label>
                                        <select
                                            id="enquiry-guests"
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleChange}
                                            className={fieldClass}
                                        >
                                            <option>Under 50 guests</option>
                                            <option>50 to 100 guests</option>
                                            <option>100 to 200 guests</option>
                                            <option>200+ guests</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="enquiry-venue" className={labelClass}>Suburb or Venue</label>
                                    <input
                                        id="enquiry-venue"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="e.g. New Farm"
                                        className={fieldClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <span id="enquiry-services" className={labelClass}>What would you like?</span>
                                    <div role="group" aria-labelledby="enquiry-services" className="flex gap-4">
                                        <button
                                            type="button"
                                            aria-pressed={services.includes('tiramisu-tray')}
                                            onClick={() => toggle(setServices, 'tiramisu-tray')}
                                            className={`flex-1 py-6 px-4 border transition-all duration-300 flex flex-col items-center gap-1 ${services.includes('tiramisu-tray') ? 'bg-dipiu-coffee border-dipiu-coffee text-dipiu-beige' : 'bg-white border-dipiu-black/10 hover:border-dipiu-coffee/50 text-dipiu-black/70'}`}
                                        >
                                            <span className="font-serif text-xl italic">Tiramisu Tray</span>
                                            <span className="text-[10px] uppercase tracking-widest">By the slice</span>
                                        </button>

                                        <button
                                            type="button"
                                            aria-pressed={services.includes('cannoli-station')}
                                            onClick={() => toggle(setServices, 'cannoli-station')}
                                            className={`flex-1 py-6 px-4 border transition-all duration-300 flex flex-col items-center gap-1 ${services.includes('cannoli-station') ? 'bg-dipiu-red border-dipiu-red text-white' : 'bg-white border-dipiu-black/10 hover:border-dipiu-red/50 text-dipiu-black/70'}`}
                                        >
                                            <span className="font-serif text-xl italic">Cannoli Station</span>
                                            <span className="text-[10px] uppercase tracking-widest">Piped to order</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3">
                                    <span id="enquiry-interests" className={labelClass}>I&apos;m interested in...</span>
                                    <div role="group" aria-labelledby="enquiry-interests" className="flex gap-4">
                                        <button
                                            type="button"
                                            aria-pressed={interests.includes('tiramisu')}
                                            onClick={() => toggle(setInterests, 'tiramisu')}
                                            className={`flex-1 py-6 px-4 border transition-all duration-300 flex flex-col items-center gap-1 group ${interests.includes('tiramisu') ? 'bg-dipiu-coffee border-dipiu-coffee text-dipiu-beige' : 'bg-white border-dipiu-black/10 hover:border-dipiu-coffee/50 text-dipiu-black/60'}`}
                                        >
                                            <span className="font-serif text-xl italic">Tiramisù</span>
                                            <span className="text-[10px] uppercase tracking-widest opacity-60">Classic Collection</span>
                                        </button>

                                        <button
                                            type="button"
                                            aria-pressed={interests.includes('popsicles')}
                                            onClick={() => toggle(setInterests, 'popsicles')}
                                            className={`flex-1 py-6 px-4 border transition-all duration-300 flex flex-col items-center gap-1 group ${interests.includes('popsicles') ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-white border-dipiu-black/10 hover:border-orange-200 text-dipiu-black/60'}`}
                                        >
                                            <span className="font-serif text-xl italic">Fruit Popsicles</span>
                                            <span className="text-[10px] uppercase tracking-widest opacity-60">100% Natural</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="enquiry-volume" className={labelClass}>Estimated Volume / Week</label>
                                    <select
                                        id="enquiry-volume"
                                        name="volume"
                                        value={formData.volume}
                                        onChange={handleChange}
                                        className={fieldClass}
                                    >
                                        <option>10 - 50 Units</option>
                                        <option>50 - 100 Units</option>
                                        <option>100+ Units (Custom)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="enquiry-message" className={labelClass}>Message</label>
                            <textarea
                                id="enquiry-message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder={copy[enquiryType].messagePlaceholder}
                                className={`${fieldClass} resize-none`}
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

                    </form>
                </div>
            </div>
        </div>
    );
}
