"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const navRef = useRef(null);
    const containerRef = useRef(null);
    const menuOverlayRef = useRef(null);
    const menuContentRef = useRef(null);

    // Mobile Menu State
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // 1. Entry Animation (Runs once)
    useGSAP(() => {
        gsap.from(containerRef.current, {
            y: -100,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out",
        });
    }, { scope: navRef });

    // 2. Menu Logic
    useEffect(() => {
        if (!menuOverlayRef.current) return;

        if (isMenuOpen) {
            gsap.to(menuOverlayRef.current, {
                x: "0%",
                duration: 0.6,
                ease: "power3.out"
            });
            gsap.fromTo(".menu-item",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
            );
            document.body.style.overflow = "hidden";
        } else {
            gsap.to(menuOverlayRef.current, {
                x: "100%",
                duration: 0.6,
                ease: "power3.in"
            });
            document.body.style.overflow = "";
        }
    }, [isMenuOpen]);

    return (
        <nav ref={navRef}>
            <div
                ref={containerRef}
                // Static color: text-dipiu-beige (White-ish)
                className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-6 md:px-12 md:py-8 text-dipiu-beige pointer-events-none"
            >
                {/* Logo - Always White/Negative */}
                <div className="flex-1 relative z-50 pointer-events-none">
                    <Link href="/" onClick={closeMenu} className="relative block w-24 h-8 hover:opacity-80 transition-opacity pointer-events-auto">
                        <Image
                            src="/dipiuLogos/SVG/%233 Logomark Red Positive.svg"
                            alt="DiPiù Logo"
                            fill
                            className="object-contain object-left brightness-0 invert"
                            priority
                            suppressHydrationWarning
                        />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 font-sans text-sm uppercase tracking-widest font-medium pointer-events-auto">
                    <Link href="#products" className="hover:underline underline-offset-4 decoration-1">
                        Our Products
                    </Link>
                    <Link href="#contact" className="hover:underline underline-offset-4 decoration-1">
                        Contact Us
                    </Link>
                    <a
                        href="mailto:wholesale@dipiu.com.au?subject=Wholesale%20Enquiry"
                        className="border border-current px-6 py-2 rounded-full hover:bg-current hover:text-dipiu-red transition-colors duration-300"
                    >
                        Wholesale
                    </a>
                </div>

                {/* Mobile Burger */}
                <button
                    className="md:hidden relative z-[51] w-8 h-8 flex flex-col justify-center items-end gap-1.5 focus:outline-none cursor-pointer pointer-events-auto"
                    onClick={toggleMenu}
                >
                    <span className="block w-8 h-[2px] bg-current" />
                    <span className="block w-6 h-[2px] bg-current" />
                    <span className="block w-4 h-[2px] bg-current" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuOverlayRef}
                className="fixed inset-0 z-[60] bg-dipiu-black text-dipiu-beige flex flex-col translate-x-full md:hidden"
            >
                <div className="flex justify-between items-center px-6 py-6 border-b border-dipiu-beige/10">
                    <span className="font-serif text-xl">Menu</span>
                    <button
                        onClick={closeMenu}
                        className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-dipiu-red transition-colors cursor-pointer"
                    >
                        <span>Back</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                            suppressHydrationWarning
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div ref={menuContentRef} className="flex-1 flex flex-col justify-center items-center gap-10 p-6">
                    <Link href="#products" onClick={closeMenu} className="menu-item font-serif text-5xl hover:text-dipiu-red transition-colors">
                        Products
                    </Link>
                    <Link href="/" onClick={closeMenu} className="menu-item font-serif text-5xl hover:text-dipiu-red transition-colors">
                        Story
                    </Link>
                    <Link href="#contact" onClick={closeMenu} className="menu-item font-serif text-5xl hover:text-dipiu-red transition-colors">
                        Contact
                    </Link>
                    <div className="menu-item w-12 h-[1px] bg-dipiu-beige/20 my-4" />
                    <a
                        href="mailto:wholesale@dipiu.com.au"
                        className="menu-item font-sans text-sm uppercase tracking-widest border border-dipiu-beige px-10 py-4 rounded-full hover:bg-dipiu-beige hover:text-dipiu-black transition-colors"
                    >
                        Wholesale
                    </a>
                </div>
            </div>
        </nav>
    );
}
