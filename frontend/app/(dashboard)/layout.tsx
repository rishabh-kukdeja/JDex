"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setLoading(false);
            } else {
                setIsAuthenticated(false);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse"></div>
                            <div className="absolute inset-1 bg-primary/10 rounded-lg"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-muted-foreground animate-pulse">Loading...</p>
                        <p className="text-xs text-muted-foreground/60">Preparing your dashboard</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className="lg:pl-60">
                <Header onMenuClick={() => setMobileOpen(true)} />
                <main className="p-4 lg:p-6 animate-fade-in">{children}</main>
            </div>
        </div>
    );
}
