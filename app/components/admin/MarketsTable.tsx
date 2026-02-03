"use client";

import { Market } from "@/lib/types";
import { MapPin, Clock, Pencil, Trash2, ExternalLink } from "lucide-react";

interface MarketsTableProps {
    markets: Market[];
    onEdit: (market: Market) => void;
    onDelete: (id: string) => void;
}

export default function MarketsTable({ markets, onEdit, onDelete }: MarketsTableProps) {
    const formatDate = (date: Date) => {
        const d = new Date(date);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
            dayName: days[d.getUTCDay()],
            dayNumber: d.getUTCDate(),
            month: months[d.getUTCMonth()],
            year: d.getUTCFullYear(),
        };
    };

    const isPast = (date: Date) => {
        return new Date().toISOString().split('T')[0] > new Date(date).toISOString().split('T')[0];
    };

    const isToday = (date: Date) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const dateStr = new Date(date).toISOString().split('T')[0];
        return dateStr === todayStr;
    };

    // Group markets by status for visual hierarchy
    const todayMarkets = markets.filter(m => isToday(m.date));
    const upcomingMarkets = markets.filter(m => !isToday(m.date) && !isPast(m.date));
    const pastMarkets = markets.filter(m => isPast(m.date));

    const MarketCard = ({ market, variant }: { market: Market; variant: 'today' | 'upcoming' | 'past' }) => {
        const { dayName, dayNumber, month } = formatDate(market.date);
        const past = variant === 'past';
        const today = variant === 'today';

        return (
            <div
                className={`
                    group relative bg-white rounded-2xl border transition-all duration-300
                    hover:shadow-xl hover:-translate-y-0.5
                    ${past ? "opacity-60 border-dipiu-coffee/5" : "border-dipiu-coffee/10"}
                    ${today ? "ring-2 ring-green-500/20 border-green-500/30" : ""}
                    ${!market.isActive ? "bg-amber-50/30" : ""}
                `}
            >
                <div className="flex items-stretch">
                    {/* ═══ DATE BADGE ═══ */}
                    <div
                        className={`
                            flex-shrink-0 w-20 flex flex-col items-center justify-center rounded-l-2xl
                            ${today
                                ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                                : past
                                    ? "bg-dipiu-coffee/5 text-dipiu-coffee/40"
                                    : "bg-gradient-to-br from-dipiu-red to-dipiu-red/90 text-white"
                            }
                        `}
                    >
                        <span className="text-[10px] font-bold tracking-wider opacity-80 uppercase">
                            {dayName}
                        </span>
                        <span className="font-luckiest text-3xl leading-none">
                            {dayNumber}
                        </span>
                        <span className="text-[10px] tracking-wide opacity-70 uppercase">
                            {month}
                        </span>
                    </div>

                    {/* ═══ CONTENT ═══ */}
                    <div className="flex-1 p-4 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                {/* Market Name + Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-luckiest text-dipiu-coffee text-lg truncate">
                                        {market.marketName}
                                    </h3>
                                    {!market.isActive && (
                                        <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                            Hidden
                                        </span>
                                    )}
                                    {today && (
                                        <span className="text-[9px] bg-green-500 text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wide animate-pulse">
                                            Today
                                        </span>
                                    )}
                                </div>

                                {/* Location & Time */}
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dipiu-coffee/60">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-dipiu-coffee/30" />
                                        {market.mapsLink ? (
                                            <a
                                                href={market.mapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-dipiu-red hover:underline underline-offset-2 flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {market.location}
                                                <ExternalLink className="w-3 h-3 opacity-50" />
                                            </a>
                                        ) : (
                                            <span>{market.location}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-dipiu-coffee/30" />
                                        <span>{market.startTime} – {market.endTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ═══ ACTIONS ═══ */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(market)}
                                    className="p-2.5 text-dipiu-coffee/40 hover:text-dipiu-red hover:bg-dipiu-red/10 rounded-xl transition-all"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(market.id)}
                                    className="p-2.5 text-dipiu-coffee/40 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* ═══ TODAY ═══ */}
            {todayMarkets.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <h3 className="text-xs uppercase tracking-widest font-bold text-green-600">
                            Today
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {todayMarkets.map((market) => (
                            <MarketCard key={market.id} market={market} variant="today" />
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ UPCOMING ═══ */}
            {upcomingMarkets.length > 0 && (
                <section>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-dipiu-coffee/40 mb-4">
                        Upcoming
                    </h3>
                    <div className="space-y-3">
                        {upcomingMarkets.map((market) => (
                            <MarketCard key={market.id} market={market} variant="upcoming" />
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ PAST ═══ */}
            {pastMarkets.length > 0 && (
                <section>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-dipiu-coffee/20 mb-4">
                        Past
                    </h3>
                    <div className="space-y-2">
                        {pastMarkets.map((market) => (
                            <MarketCard key={market.id} market={market} variant="past" />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
