"use client";

import { useState } from "react";
import { useAllMarkets, addMarket, updateMarket, deleteMarket } from "@/app/hooks/useMarkets";
import { Market } from "@/lib/types";
import MarketForm from "@/app/components/admin/MarketForm";
import MarketsTable from "@/app/components/admin/MarketsTable";
import { Plus, X, MapPin } from "lucide-react";

export default function MarketsAdminPage() {
    const { markets, loading, error } = useAllMarkets();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMarket, setEditingMarket] = useState<Market | null>(null);

    const handleAdd = () => {
        setEditingMarket(null);
        setIsFormOpen(true);
    };

    const handleEdit = (market: Market) => {
        setEditingMarket(market);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this market?")) {
            await deleteMarket(id);
        }
    };

    const handleFormSubmit = async (data: {
        dates: Date[];
        marketName: string;
        location: string;
        mapsLink?: string;
        startTime: string;
        endTime: string;
        isActive: boolean;
    }) => {
        if (editingMarket) {
            // Edit mode: single date
            await updateMarket(editingMarket.id, {
                date: data.dates[0],
                marketName: data.marketName,
                location: data.location,
                mapsLink: data.mapsLink,
                startTime: data.startTime,
                endTime: data.endTime,
                isActive: data.isActive,
            });
        } else {
            // Create mode: loop through all dates
            for (const date of data.dates) {
                await addMarket({
                    date,
                    marketName: data.marketName,
                    location: data.location,
                    mapsLink: data.mapsLink,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    isActive: data.isActive,
                });
            }
        }
        setIsFormOpen(false);
        setEditingMarket(null);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingMarket(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-dipiu-red border-t-transparent rounded-full animate-spin" />
                    <p className="text-dipiu-coffee/40 text-sm">Loading markets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100">
                <p className="font-bold mb-2">Error loading markets</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* ═══ HEADER ═══ */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="font-luckiest text-4xl text-dipiu-coffee">Markets</h2>
                    <p className="text-dipiu-coffee/50 text-sm mt-1">
                        {markets.length} location{markets.length !== 1 ? 's' : ''} scheduled
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-dipiu-red text-white font-medium text-sm px-5 py-3 rounded-xl hover:bg-dipiu-coffee hover:scale-105 transition-all duration-300 shadow-lg shadow-dipiu-red/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Market
                </button>
            </div>

            {/* ═══ DRAWER MODAL ═══ */}
            {isFormOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                        onClick={handleFormCancel}
                    />

                    {/* Drawer */}
                    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dipiu-beige z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="sticky top-0 bg-dipiu-beige/95 backdrop-blur-sm border-b border-dipiu-coffee/10 px-6 py-5 flex items-center justify-between z-10">
                            <h3 className="font-luckiest text-2xl text-dipiu-coffee">
                                {editingMarket ? "Edit Market" : "Add Market"}
                            </h3>
                            <button
                                onClick={handleFormCancel}
                                className="p-2 text-dipiu-coffee/40 hover:text-dipiu-coffee hover:bg-dipiu-coffee/10 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <MarketForm
                            initialData={editingMarket || undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </div>
                </>
            )}

            {/* ═══ CONTENT ═══ */}
            {markets.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-dipiu-coffee/5">
                    <div className="w-20 h-20 bg-dipiu-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-10 h-10 text-dipiu-red" />
                    </div>
                    <h3 className="font-luckiest text-2xl text-dipiu-coffee mb-2">No Markets Yet</h3>
                    <p className="text-dipiu-coffee/50 text-sm mb-8 max-w-xs mx-auto">
                        Add your first market location to start showing where customers can find you
                    </p>
                    <button
                        onClick={handleAdd}
                        className="bg-dipiu-red text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-dipiu-coffee transition-all duration-300 shadow-lg shadow-dipiu-red/20"
                    >
                        Add Your First Market
                    </button>
                </div>
            ) : (
                <MarketsTable
                    markets={markets}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
