"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function MarketsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/admin/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dipiu-beige flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-dipiu-red border-t-transparent rounded-full animate-spin" />
                    <p className="text-dipiu-coffee font-sans text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        await signOut();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-dipiu-beige">
            {/* Admin Header */}
            <header className="bg-dipiu-coffee text-dipiu-beige py-4 px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="font-luckiest text-2xl tracking-wide">DiPiù Admin</h1>
                        <span className="text-xs bg-dipiu-red px-2 py-1 rounded-full uppercase tracking-wider">
                            Markets
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-sans uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
