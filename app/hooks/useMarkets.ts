"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Market, MarketData } from "@/lib/types";

export function useUpcomingMarkets() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Calculate "Start of Today" in Brisbane (UTC+10)
        // This ensures users in earlier timezones (like Americas) still see "Today's" markets in Australia
        const now = new Date();
        const BRISBANE_OFFSET = 10 * 60 * 60 * 1000; // UTC+10

        // 1. Shift time to Brisbane frame (treating UTC methods as local Brisbane time)
        const brisbaneTime = new Date(now.getTime() + BRISBANE_OFFSET);
        // 2. Floor to midnight
        brisbaneTime.setUTCHours(0, 0, 0, 0);
        // 3. Shift back to real UTC to get the timestamp of Brisbane's Midnight
        const brisbaneMidnight = new Date(brisbaneTime.getTime() - BRISBANE_OFFSET);

        const q = query(
            collection(db, "markets"),
            where("date", ">=", Timestamp.fromDate(brisbaneMidnight)),
            where("isActive", "==", true),
            orderBy("date", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const marketsData = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        date: data.date.toDate(),
                        marketName: data.marketName,
                        location: data.location,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isActive: data.isActive,
                        mapsLink: data.mapsLink,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    } as Market;
                });
                setMarkets(marketsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching markets:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { markets, loading, error };
}

export function useAllMarkets() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, "markets"),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const marketsData = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        date: data.date.toDate(),
                        marketName: data.marketName,
                        location: data.location,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isActive: data.isActive,
                        mapsLink: data.mapsLink,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    } as Market;
                });
                setMarkets(marketsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching markets:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { markets, loading, error };
}

export async function addMarket(marketData: Omit<MarketData, "createdAt" | "updatedAt">) {
    const now = new Date();
    await addDoc(collection(db, "markets"), {
        ...marketData,
        date: Timestamp.fromDate(marketData.date),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
    });
}

export async function updateMarket(id: string, marketData: Partial<MarketData>) {
    const docRef = doc(db, "markets", id);
    const updateData: Record<string, unknown> = {
        ...marketData,
        updatedAt: Timestamp.fromDate(new Date()),
    };

    if (marketData.date) {
        updateData.date = Timestamp.fromDate(marketData.date);
    }

    await updateDoc(docRef, updateData);
}

export async function deleteMarket(id: string) {
    await deleteDoc(doc(db, "markets", id));
}
