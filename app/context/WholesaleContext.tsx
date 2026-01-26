"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WholesaleContextType {
    isWholesaleOpen: boolean;
    openWholesale: () => void;
    closeWholesale: () => void;
}

const WholesaleContext = createContext<WholesaleContextType | undefined>(undefined);

export function WholesaleProvider({ children }: { children: ReactNode }) {
    const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);

    const openWholesale = () => setIsWholesaleOpen(true);
    const closeWholesale = () => setIsWholesaleOpen(false);

    return (
        <WholesaleContext.Provider value={{ isWholesaleOpen, openWholesale, closeWholesale }}>
            {children}
        </WholesaleContext.Provider>
    );
}

export function useWholesale() {
    const context = useContext(WholesaleContext);
    if (context === undefined) {
        throw new Error("useWholesale must be used within a WholesaleProvider");
    }
    return context;
}
