"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWholesale } from "../context/WholesaleContext";

gsap.registerPlugin(ScrollTrigger);

const occasions = ["Weddings", "Engagements", "Birthdays", "Christenings", "Corporate events"];

const photos = [
    {
        src: "/dipiuEncargos/tiramisu-tray.jpg",
        alt: "A DiPiù server in a black apron lifting a slice of tiramisu from a carry tray",
        caption: "Tiramisu tray",
        position: "object-[50%_45%]",
        offset: "",
    },
    {
        src: "/dipiuEncargos/cannoli-station.jpg",
        alt: "Gloved hands filling cannoli at a DiPiù tray of crushed pistachio and chocolate chips",
        caption: "Cannoli station",
        // Encuadra solo el primer plano del díptico (mitad derecha)
        position: "object-[92%_50%]",
        offset: "mt-16 md:mt-28",
    },
];

export default function Events() {
    const sectionRef = useRef<HTMLElement>(null);
    const { openEvents } = useWholesale();

    useGSAP(() => {
        const mm = gsap.matchMedia();

        // Entrada: titular enmascarado, texto y fotos que suben como una bandeja
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });

            tl.from(".events-line > span", { yPercent: 110, duration: 1, stagger: 0.08 })
                .from(".events-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.06 }, "-=0.7")
                .fromTo(".events-frame",
                    { clipPath: "inset(100% 0% 0% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.15, ease: "power3.inOut" },
                    0
                )
                .from(".events-photo", { scale: 1.15, duration: 1.6, stagger: 0.15 }, 0);
        });

        // Parallax: las dos bandejas se mueven a distinto ritmo
        mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
            const scrub = {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            };
            gsap.fromTo(".events-figure-1", { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: scrub });
            gsap.fromTo(".events-figure-2", { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { ...scrub } });
        });
    }, { scope: sectionRef });

    return (
        <section
            id="events"
            ref={sectionRef}
            aria-labelledby="events-title"
            className="relative w-full bg-dipiu-black text-dipiu-beige overflow-hidden"
        >
            <div className="container mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-8 lg:items-center">

                {/* Texto */}
                <div className="lg:col-span-5">
                    <p className="events-fade font-sans text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-6 text-dipiu-beige/70">
                        Events &amp; parties
                    </p>

                    <h2 id="events-title" className="font-luckiest text-[11vw] sm:text-6xl xl:text-7xl leading-[0.9] tracking-tighter mb-8">
                        <span className="events-line block overflow-hidden pb-[0.08em]">
                            <span className="block">Dessert that</span>
                        </span>
                        <span className="events-line block overflow-hidden pb-[0.08em]">
                            <span className="block text-dipiu-red">does the rounds</span>
                        </span>
                    </h2>

                    <p className="events-fade font-sans text-lg md:text-xl leading-relaxed text-dipiu-beige/80 max-w-md mb-10">
                        We turn up with the tray and make dessert part of the celebration. Your guests get tiramisu served by the slice or cannoli piped on the spot, all made fresh in Brisbane.
                    </p>

                    <ul
                        aria-label="Occasions we cater for"
                        className="events-fade flex flex-wrap gap-x-5 gap-y-2 max-w-md border-t border-dipiu-beige/15 pt-6 mb-10 font-sans text-xs uppercase tracking-[0.25em] text-dipiu-beige/70"
                    >
                        {occasions.map((occasion) => (
                            <li key={occasion}>{occasion}</li>
                        ))}
                    </ul>

                    <div className="events-fade">
                        <button
                            type="button"
                            onClick={openEvents}
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-dipiu-red px-8 py-4 font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white cursor-pointer transition-transform duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dipiu-beige"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 origin-left scale-x-0 bg-dipiu-beige transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                            />
                            <span className="relative transition-colors duration-500 group-hover:text-dipiu-black group-focus-visible:text-dipiu-black">
                                Plan your event
                            </span>
                            <svg
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="relative w-4 h-4 transition-[translate,color] duration-500 group-hover:translate-x-1 group-hover:text-dipiu-black group-focus-visible:text-dipiu-black"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Fotos */}
                <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-2 gap-4 md:gap-8 items-start">
                    {photos.map((photo, index) => (
                        <figure key={photo.src} className={`events-figure-${index + 1} ${photo.offset}`}>
                            <div className="events-frame relative aspect-[4/5] overflow-hidden rounded-lg bg-dipiu-beige/5">
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    sizes="(max-width: 1024px) 50vw, 28vw"
                                    className={`events-photo object-cover ${photo.position}`}
                                />
                            </div>
                            <figcaption className="mt-4 flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-dipiu-beige/60">
                                <span aria-hidden="true" className="hidden sm:block h-px w-6 bg-dipiu-red" />
                                {photo.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
