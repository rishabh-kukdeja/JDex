"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Building2, BrainCircuit, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomeLandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-[85vh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 w-[600px] h-[600px] rounded-full blur-3xl opacity-50 pointer-events-none" />

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-primary/20 shadow-sm text-sm font-semibold text-primary mb-8"
            >
                <Sparkles className="w-4 h-4 text-yellow-500" /> THE FUTURE OF RECRUITING
            </motion.div>

            {/* Hero Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center max-w-4xl px-4"
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-4">
                    Smart Assessments,<br />
                    <span className="text-primary relative inline-block">
                        Reimagined.
                        <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-500" viewBox="0 0 200 9" preserveAspectRatio="none">
                            <path fill="currentColor" d="M0 8C50 2 100 0 200 5 L200 9 C100 4 50 6 0 9 Z" />
                        </svg>
                    </span>
                </h1>

                <p className="mt-8 text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                    Experience enterprise-grade hiring with AI-driven candidate evaluation,
                    intelligent JD parsing, and seamless dynamic assessments.
                </p>
            </motion.div>

            {/* CTA Setup (like Track Now) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 w-full max-w-xl px-4"
            >
                <div className="relative group hover:z-10">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-500" />
                    <div className="relative flex items-center bg-card shadow-xl rounded-2xl p-2 border border-border/50">
                        <div className="pl-4 pr-3 text-muted-foreground flex-shrink-0">
                            <Search className="w-5 h-5 text-primary" />
                        </div>
                        <input
                            type="text"
                            placeholder="Paste a Job Description..."
                            className="flex-1 min-w-0 bg-transparent outline-none pr-3 font-medium text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => {
                                if (typeof window !== 'undefined') {
                                    sessionStorage.setItem('tempJdText', e.target.value);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.push('/builder');
                                }
                            }}
                        />
                        <Button
                            className="h-12 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-md text-md ml-auto"
                            onClick={() => {
                                router.push('/builder');
                            }}
                        >
                            Build Now
                        </Button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-32 flex gap-12 text-muted-foreground/50 grayscale hover:grayscale-0 transition-all duration-500"
            >
                {/* Decorative Logos */}
                <div className="flex items-center gap-2 font-bold text-xl"><Building2 /> Enterprise</div>
                <div className="flex items-center gap-2 font-bold text-xl"><BrainCircuit /> Neural</div>
                <div className="flex items-center gap-2 font-bold text-xl"><ActivitySquare /> Analytics</div>
            </motion.div>
        </div>
    );
}
