"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUpcomingMarkets } from "../hooks/useMarkets";
import { MapPin, ChevronRight, X, Calendar } from "lucide-react";

export default function MarketsTickerBanner() {
    const { markets, loading } = useUpcomingMarkets();
    const mobileRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-cycle through markets when not expanded
    useEffect(() => {
        if (isExpanded || markets.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.min(markets.length, 5));
        }, 4000);

        return () => clearInterval(interval);
    }, [isExpanded, markets.length]);

    // Entrance animation for both mobile and desktop
    useGSAP(() => {
        if (loading || markets.length === 0) return;

        if (mobileRef.current) {
            gsap.fromTo(
                mobileRef.current,
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "power2.out" }
            );
        }

        if (desktopRef.current) {
            gsap.fromTo(
                desktopRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "power2.out" }
            );
        }
    }, { dependencies: [loading, markets.length] });

    const formatDate = (date: Date) => {
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return {
            dayName: days[date.getDay()],
            dayNumber: date.getDate(),
            month: months[date.getMonth()]
        };
    };

    // --- Closing Logic (Simplified - let CSS transitions handle it) ---
    const handleClose = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsExpanded(false);
    };

    // Animation handling for expanded/collapsed states
    useGSAP(() => {
        if (isExpanded) {
            // Desktop Expand Animation
            if (desktopRef.current) {
                gsap.killTweensOf(desktopRef.current);
                gsap.fromTo(desktopRef.current,
                    { width: "300px", height: "172px" },
                    {
                        width: "360px",
                        height: "auto",
                        duration: 0.6,
                        ease: "elastic.out(1, 0.75)"
                    }
                );

                // Animate inner content — scoped to desktopRef
                const items = desktopRef.current.querySelectorAll(".market-item");
                gsap.killTweensOf(items);
                gsap.fromTo(items,
                    { x: -20, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        stagger: 0.1,
                        duration: 0.4,
                        delay: 0.1,
                        ease: "power2.out"
                    }
                );
            }

            // Mobile Expand Animation
            if (mobileRef.current) {
                const panel = mobileRef.current.querySelector(".expanded-panel");
                if (panel) {
                    gsap.killTweensOf(panel);
                    gsap.fromTo(panel,
                        { scale: 0.9, opacity: 0, y: -10 },
                        {
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: "back.out(1.7)"
                        }
                    );
                }

                // Mobile list stagger — scoped to mobileRef
                const mobileItems = mobileRef.current.querySelectorAll(".mobile-market-item");
                gsap.killTweensOf(mobileItems);
                gsap.fromTo(mobileItems,
                    { x: -10, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        stagger: 0.08,
                        duration: 0.4,
                        delay: 0.15,
                        ease: "power1.out"
                    }
                );
            }
        } else {
            // COLLAPSED: Kill active tweens and clear inline styles
            if (desktopRef.current) {
                gsap.killTweensOf(desktopRef.current);
                const items = desktopRef.current.querySelectorAll(".market-item");
                gsap.killTweensOf(items);
                // Clear all GSAP inline styles from the container
                gsap.set(desktopRef.current, { clearProps: "all" });
                // Restore the initial opacity (entrance animation set it to 1)
                gsap.set(desktopRef.current, { opacity: 1 });
            }
            if (mobileRef.current) {
                const panel = mobileRef.current.querySelector(".expanded-panel");
                if (panel) {
                    gsap.killTweensOf(panel);
                    gsap.set(panel, { clearProps: "all" });
                }
                const mobileItems = mobileRef.current.querySelectorAll(".mobile-market-item");
                gsap.killTweensOf(mobileItems);
            }
        }
    }, { dependencies: [isExpanded] });

    // Don't render if no markets or loading
    if (loading || markets.length === 0) return null;

    const displayMarkets = markets.slice(0, 5);
    const currentMarket = displayMarkets[currentIndex];

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MOBILE: Top-center toast between logo and hamburger */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div
                ref={mobileRef}
                className="md:hidden fixed top-5 left-1/2 -translate-x-1/2 z-[45]"
            >
                {isExpanded ? (
                    // ─── EXPANDED STATE: Dropdown panel ───
                    <div className="expanded-panel">
                        <div className="bg-dipiu-beige/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-dipiu-coffee/10 w-[90vw] max-w-[280px] overflow-hidden mt-2">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-dipiu-red to-dipiu-red/90 px-3 py-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-dipiu-beige">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="font-luckiest text-xs tracking-wide">
                                            Upcoming Markets
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5 text-dipiu-beige" />
                                    </button>
                                </div>
                            </div>

                            {/* Markets list */}
                            <div className="p-2 space-y-1.5 max-h-[55vh] overflow-y-auto">
                                {displayMarkets.map((market, index) => {
                                    const { dayName, dayNumber, month } = formatDate(market.date);
                                    const isFirst = index === 0;
                                    return (
                                        <div
                                            key={market.id}
                                            className={`
                                                mobile-market-item flex items-center gap-2.5 p-2 rounded-xl transition-all
                                                ${isFirst
                                                    ? "bg-dipiu-red/10 border border-dipiu-red/20"
                                                    : "bg-dipiu-coffee/5"
                                                }
                                            `}
                                        >
                                            {/* Date block */}
                                            <div className={`
                                                flex-shrink-0 w-10 h-12 rounded-lg flex flex-col items-center justify-center
                                                ${isFirst ? "bg-dipiu-red text-dipiu-beige" : "bg-dipiu-coffee/10 text-dipiu-coffee"}
                                            `}>
                                                <span className="text-[8px] font-bold tracking-wider opacity-80">{dayName}</span>
                                                <span className="font-luckiest text-lg leading-none">{dayNumber}</span>
                                                <span className="text-[7px] tracking-wider opacity-70">{month}</span>
                                            </div>

                                            {/* Market info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-luckiest text-dipiu-coffee text-xs leading-tight">
                                                    {market.marketName}
                                                </p>
                                                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-dipiu-coffee/60">
                                                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                                    <span className="truncate max-w-[130px]">{market.location}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                                    <p className="text-[10px] text-dipiu-coffee/50">
                                                        {market.startTime} - {market.endTime}
                                                    </p>
                                                    {market.mapsLink && (
                                                        <a
                                                            href={market.mapsLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[9px] font-bold text-dipiu-red hover:underline"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Location
                                                            <ChevronRight className="w-2.5 h-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    // ─── COLLAPSED STATE: Minimal centered pill ───
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="group flex items-center gap-3 bg-dipiu-beige/95 backdrop-blur-lg px-4 py-2.5 rounded-full shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 active:scale-[0.97]"
                    >
                        {/* Date badge */}
                        <div className="bg-dipiu-red text-dipiu-beige w-11 h-11 rounded-full flex flex-col items-center justify-center">
                            <span className="font-luckiest text-lg leading-none">
                                {formatDate(currentMarket.date).dayNumber}
                            </span>
                            <span className="text-[7px] tracking-wide opacity-80">
                                {formatDate(currentMarket.date).month}
                            </span>
                        </div>

                        {/* Market name */}
                        <div className="flex flex-col items-start max-w-[150px]">
                            <span className="text-[10px] text-dipiu-red font-bold uppercase tracking-wider">
                                Find Us
                            </span>
                            <span className="font-luckiest text-dipiu-coffee text-sm leading-tight truncate w-full">
                                {currentMarket.marketName}
                            </span>
                        </div>

                        {/* Expand indicator */}
                        <ChevronRight className="w-5 h-5 text-dipiu-coffee/40 group-hover:text-dipiu-red transition-colors rotate-90" />
                    </button>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* DESKTOP: Elegant floating card at bottom-right */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div
                className="hidden md:block absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-30"
            >
                <div
                    ref={desktopRef}
                    onClick={() => isExpanded ? handleClose() : setIsExpanded(true)}
                    className={`
                        bg-dipiu-beige/95 backdrop-blur-md
                        rounded-2xl shadow-2xl cursor-pointer
                        border border-white/20
                        overflow-hidden
                        opacity-0
                        /* Removing CSS transition for width/height to let GSAP handle the elastic feel if expanding */
                        ${!isExpanded ? 'hover:scale-[1.02] transition-transform duration-300' : ''}
                        hover:shadow-3xl
                        ${isExpanded ? "w-[360px]" : "w-[300px]"}
                    `}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-dipiu-red to-dipiu-red/90 px-4 py-3">
                        <div className="flex items-center justify-between text-dipiu-beige">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="font-luckiest text-sm tracking-wide">
                                    Find Us This Week
                                </span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                        {isExpanded ? (
                            <div key="expanded-list" className="space-y-2">
                                {displayMarkets.map((market, index) => {
                                    const { dayName, dayNumber, month } = formatDate(market.date);
                                    const isFirst = index === 0;
                                    return (
                                        <div
                                            key={`expanded-${market.id}`}
                                            className={`
                                                market-item flex items-center gap-3 p-3 rounded-xl transition-colors
                                                ${isFirst ? "bg-dipiu-red/10 border border-dipiu-red/20" : "bg-dipiu-coffee/5 hover:bg-dipiu-coffee/10"}
                                            `}
                                        >
                                            <div className={`
                                                w-14 h-16 rounded-xl flex flex-col items-center justify-center
                                                ${isFirst ? "bg-dipiu-red text-dipiu-beige" : "bg-dipiu-coffee/10 text-dipiu-coffee"}
                                            `}>
                                                <span className="text-[9px] font-bold tracking-wider opacity-80">{dayName}</span>
                                                <span className="font-luckiest text-2xl leading-none">{dayNumber}</span>
                                                <span className="text-[8px] tracking-wider opacity-70">{month}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-luckiest text-dipiu-coffee text-base truncate">
                                                    {market.marketName}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1 text-[11px] text-dipiu-coffee/60">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{market.location}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                                    <p className="text-[11px] text-dipiu-coffee/50">
                                                        {market.startTime} - {market.endTime}
                                                    </p>
                                                    {market.mapsLink && (
                                                        <a
                                                            href={market.mapsLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[9px] font-bold text-dipiu-red hover:underline uppercase tracking-wider shrink-0"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Location <ChevronRight className="w-2.5 h-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div key="collapsed-carousel" className="relative h-[72px] overflow-hidden">
                                {displayMarkets.map((market, index) => {
                                    const { dayName, dayNumber, month } = formatDate(market.date);
                                    return (
                                        <div
                                            key={`carousel-${market.id}`}
                                            className={`
                                                absolute inset-0 flex items-center gap-3 transition-all duration-500
                                                ${index === currentIndex
                                                    ? "opacity-100 translate-y-0"
                                                    : "opacity-0 translate-y-3 pointer-events-none"
                                                }
                                            `}
                                        >
                                            <div className="w-14 h-16 rounded-xl bg-dipiu-red text-dipiu-beige flex flex-col items-center justify-center shadow-sm">
                                                <span className="text-[9px] font-bold tracking-wider opacity-80">{dayName}</span>
                                                <span className="font-luckiest text-2xl leading-none">{dayNumber}</span>
                                                <span className="text-[8px] tracking-wider opacity-70">{month}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-luckiest text-dipiu-coffee text-base truncate">
                                                    {market.marketName}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1 text-[11px] text-dipiu-coffee/60">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{market.location}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                                    <p className="text-[11px] text-dipiu-coffee/50">
                                                        {market.startTime} - {market.endTime}
                                                    </p>
                                                    {market.mapsLink && (
                                                        <a
                                                            href={market.mapsLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-0.5 text-[9px] font-bold text-dipiu-red hover:underline uppercase tracking-wider shrink-0"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Location <ChevronRight className="w-2.5 h-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination dots (collapsed only) */}
                    {!isExpanded && displayMarkets.length > 1 && (
                        <div className="flex justify-center gap-1.5 pb-3">
                            {displayMarkets.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`
                                        h-1.5 rounded-full transition-all duration-300
                                        ${index === currentIndex
                                            ? "bg-dipiu-red w-5"
                                            : "bg-dipiu-coffee/20 w-1.5 hover:bg-dipiu-coffee/40"
                                        }
                                    `}
                                />
                            ))}
                        </div>
                    )}

                    {/* Hint: Only pulsing if collapsed */}
                    {!isExpanded && (
                        <div className="pb-3 text-center">
                            <p className="text-[9px] text-dipiu-coffee/40 uppercase tracking-[0.2em] animate-pulse">
                                Click to see all markets
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
