"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    // --- Implementación: Slider de Fondo ---
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full h-[100svh] bg-dipiu-red overflow-hidden">
            {/* Indicadores del Carrusel (Fijos) */}

            <div className="absolute top-32 left-6 md:top-40 md:left-12 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-500 border border-dipiu-beige/60 ${index === currentIndex
                            ? "bg-dipiu-beige opacity-100 scale-110"
                            : "bg-transparent opacity-60 hover:opacity-100 hover:bg-dipiu-beige/40"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Diapositivas */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Imagen de Fondo */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={`/DipiuFotos/${slide.img}`}
                            alt={`Hero Background ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            quality={100}
                            unoptimized
                        />
                        {/* Capa oscura para legibilidad */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Contenido */}
                    <div className={`relative w-full h-full flex flex-col px-6 ${slide.position}`}>
                        <div className={`flex flex-col ${slide.position.includes("text-center") ? "items-center" : slide.position.includes("text-right") ? "items-end" : "items-start"} transition-all duration-[2000ms] transform ${index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}>
                            <h1
                                className="font-luckiest text-[10vw] md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter drop-shadow-lg"
                            >
                                {slide.title}
                            </h1>
                            <p
                                className="mt-8 font-sans text-sm md:text-sm tracking-[0.3em] uppercase opacity-90 border-t border-current pt-6 drop-shadow-md"
                            >
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            ))
            }
        </section >
    );
}
