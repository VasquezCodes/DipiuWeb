// Market type definition for Firestore
export interface Market {
    id: string;
    date: Date;
    marketName: string;
    location: string;
    mapsLink?: string; // Google Maps URL
    startTime: string;
    endTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// For Firestore document data (without id)
export interface MarketData {
    date: Date;
    marketName: string;
    location: string;
    mapsLink?: string; // Google Maps URL
    startTime: string;
    endTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
