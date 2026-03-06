"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AssessmentSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 bg-background">
            <CheckCircle className="w-24 h-24 text-success mb-6 drop-shadow-md" />
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-primary">Assessment Submitted!</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Thank you for completing the test. Your responses have been sent to our evaluators.
                We appreciate the time and effort you took.
            </p>
            <div className="mt-12">
                <Button size="lg" className="px-8 shadow-sm flex gap-2 items-center" onClick={() => window.location.href = '/'}>
                    Return Home <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
