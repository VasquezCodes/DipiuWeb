"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type EnquiryType = "wholesale" | "events";

interface WholesaleContextType {
    isWholesaleOpen: boolean;
    enquiryType: EnquiryType;
    setEnquiryType: (type: EnquiryType) => void;
    openWholesale: () => void;
    openEvents: () => void;
    closeWholesale: () => void;
}

const WholesaleContext = createContext<WholesaleContextType | undefined>(undefined);

export function WholesaleProvider({ children }: { children: ReactNode }) {
    const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);
    const [enquiryType, setEnquiryType] = useState<EnquiryType>("wholesale");

    const openWholesale = () => {
        setEnquiryType("wholesale");
        setIsWholesaleOpen(true);
    };
    const openEvents = () => {
        setEnquiryType("events");
        setIsWholesaleOpen(true);
    };
    const closeWholesale = () => setIsWholesaleOpen(false);

    return (
        <WholesaleContext.Provider value={{ isWholesaleOpen, enquiryType, setEnquiryType, openWholesale, openEvents, closeWholesale }}>
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
