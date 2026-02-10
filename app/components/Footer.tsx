"use client";

import Image from "next/image";
import Link from "next/link";
import { useWholesale } from "../context/WholesaleContext";

export default function Footer() {
    const { openWholesale } = useWholesale();

    const handleInstagramClick = (e: React.MouseEvent) => {
        e.preventDefault();

        const username = "dipiutiramisu";
        const webUrl = `https://www.instagram.com/${username}/`;
        const appUrl = `instagram://user?username=${username}`;

        // Try to open the Instagram app directly via native URI scheme
        const now = Date.now();
        window.location.href = appUrl;

        // If the app didn't open (page is still visible after 1.5s), fall back to web
        setTimeout(() => {
            if (document.visibilityState !== "hidden" && Date.now() - now < 2000) {
                window.open(webUrl, "_blank", "noopener,noreferrer");
            }
        }, 1500);
    };

    return (
        <footer id="contact" className="w-full bg-dipiu-red text-dipiu-beige font-sans">
            {/* Contenido Principal */}
            <div className="container mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-8">

                {/* 1. Sección Logo (Izquierda) */}
                <div className="flex-1 flex justify-center md:justify-start">
                    <div className="relative w-32 h-16 md:w-40 md:h-20">
                        <Image
                            src="/dipiuLogos/SVG/%233 Logomark Red Positive.svg"
                            alt="DiPiù Logo"
                            fill
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                </div>

                {/* 2. Centro: Redes Sociales */}
                <div className="flex-1 flex justify-center items-center">
                    <div className="flex gap-4">
                        {/* Facebook */}
                        <a href="https://www.facebook.com/share/1GGBVfkzeU/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dipiu-beige rounded-full flex items-center justify-center text-dipiu-red hover:bg-white transition-colors duration-300">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.791 1.657-2.791 3.593v1.66h4.143l-.53 3.667h-3.613v7.98H9.101Z" />
                            </svg>
                        </a>
                        {/* Instagram */}
                        <button onClick={handleInstagramClick} aria-label="Visit DiPiù on Instagram" className="w-10 h-10 bg-dipiu-beige rounded-full flex items-center justify-center text-dipiu-red hover:bg-white transition-colors duration-300 cursor-pointer">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* 3. Derecha: Enlaces */}
                <div className="flex-1 flex justify-center md:justify-end">
                    <div className="flex flex-col items-center md:items-end gap-2 font-medium text-xs md:text-sm uppercase tracking-widest text-dipiu-beige/90">
                        <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>

                        <Link href="#contact" className="hover:text-white transition-colors">Contact Us</Link>
                        <button onClick={openWholesale} className="hover:text-white transition-colors cursor-pointer uppercase">Wholesale</button>
                    </div>
                </div>

            </div>

            {/* Franja Inferior */}
            <div className="w-full bg-black/10 py-4 text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-60">
                    &copy; {new Date().getFullYear()} DiPiù. Handcrafted in Brisbane
                </p>
            </div>
        </footer>
    );
}
