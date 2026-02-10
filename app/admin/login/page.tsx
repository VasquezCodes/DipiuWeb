"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            router.push("/admin/markets");
        } catch (err) {
            console.error(err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dipiu-beige flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="relative w-32 h-16 mx-auto mb-4">
                        <Image
                            src="/dipiuLogos/SVG/%233 Logomark Red Positive.svg"
                            alt="DiPiù Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="font-luckiest text-3xl text-dipiu-coffee tracking-wide">
                        Admin Panel
                    </h1>
                    <p className="text-sm text-dipiu-coffee/60 mt-2 font-sans">
                        Manage your market locations
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-dipiu-coffee/10">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold text-dipiu-coffee">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@dipiutiramisu.com"
                                required
                                className="w-full bg-dipiu-beige/50 border border-dipiu-coffee/10 rounded-lg px-4 py-3 focus:border-dipiu-red focus:outline-none transition-colors text-dipiu-coffee"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest font-bold text-dipiu-coffee">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-dipiu-beige/50 border border-dipiu-coffee/10 rounded-lg px-4 py-3 focus:border-dipiu-red focus:outline-none transition-colors text-dipiu-coffee"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dipiu-red text-dipiu-beige font-sans text-sm uppercase tracking-widest py-4 rounded-lg hover:bg-dipiu-coffee transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-dipiu-beige border-t-transparent rounded-full animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>


                </div>

                {/* Back to site */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-sm text-dipiu-coffee/50 hover:text-dipiu-coffee transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to site
                    </a>
                </div>
            </div>
        </div>
    );
}
