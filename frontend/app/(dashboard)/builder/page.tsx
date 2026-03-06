"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle, FileText, Settings, User, BookOpen, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { auth } from "@/lib/firebase";

export default function AssessmentBuilder() {
    const router = useRouter();
    const [jdText, setJdText] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tempJd = sessionStorage.getItem('tempJdText');
            if (tempJd) {
                setJdText(tempJd);
                sessionStorage.removeItem('tempJdText'); // Clear it after reading
            }
        }
    }, []);
    const [assessmentType, setAssessmentType] = useState("mcq"); // mcq, qa, coding
    const [loading, setLoading] = useState(false);
    const [assessmentId, setAssessmentId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!jdText.trim()) {
            setError("Please paste a Job Description.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('text', jdText);
            formData.append('type', assessmentType);

            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                throw new Error("User not authenticated");
            }

            // API Call to Node/Express Backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/assessments/generate`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setAssessmentId(data.assessmentId);
        } catch (err: any) {
            setError(err.message || "Failed to generate assessment.");
        } finally {
            setLoading(false);
        }
    };

    const handlePublishGoogleForms = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/assessments/${assessmentId}/publish`, {
                method: 'POST'
            });
            const data = await res.json();

            if (!res.ok) {
                alert(`Failed to publish: ${data.error}`);
            } else {
                alert(`Success! Form published at: ${data.url}`);
            }
        } catch (err) {
            alert('An error occurred during publishing. Setup Google ADC (.json file) on backend manually first.');
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">New Assessment Builder</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Upload a Job Description and choose the flavor of assessment. Auto-generate tests that look for true judgment over simply memory.
                </p>
            </div>

            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                <Card className="shadow-lg border-primary/20 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Create New Assessment</CardTitle>
                        <CardDescription>Paste the Job Description (JD) below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="jd-text">Job Description Content</Label>
                            <Textarea
                                id="jd-text"
                                placeholder="e.g. Seeking a Senior Frontend Engineer with Next.js expertise..."
                                className="min-h-[200px] resize-y bg-background focus:ring-primary/50"
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Assessment Type</Label>
                            <RadioGroup value={assessmentType} onValueChange={setAssessmentType} className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition">
                                    <RadioGroupItem value="mcq" id="r1" />
                                    <Label htmlFor="r1" className="cursor-pointer">Scenario Judgement (MCQs & 2 QA)</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition">
                                    <RadioGroupItem value="qa" id="r2" />
                                    <Label htmlFor="r2" className="cursor-pointer">Deep Understanding (All Text Q&A)</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition">
                                    <RadioGroupItem value="coding" id="r3" />
                                    <Label htmlFor="r3" className="cursor-pointer">Coding Assessment (LeetCode Style)</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {error && <p className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}

                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 transition-all shadow-md active:scale-[0.98]"
                            size="lg"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2 animate-pulse">
                                    <Settings className="animate-spin h-5 w-5" /> Encoding JD Insights...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <UploadCloud className="h-5 w-5" /> Generate Tailored Assessment
                                </span>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {assessmentId ? (
                        <Card className="border-success/50 bg-success/5 shadow-md transform transition-all duration-500 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-success">
                                    <CheckCircle className="h-6 w-6" /> Assessment Ready
                                </CardTitle>
                                <CardDescription>Your role-specific test logic has been generated.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm font-medium text-muted-foreground p-3 bg-background rounded-md border text-center break-all shadow-inner">
                                    ID: {assessmentId}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full font-medium hover:bg-primary/5"
                                        onClick={() => window.open(`/assessment/${assessmentId}`, '_blank')}
                                    >
                                        <BookOpen className="h-4 w-4 mr-2" /> Take Assessment
                                    </Button>
                                    <Button
                                        onClick={() => router.push(`/leaderboard/${assessmentId}`)}
                                        className="w-full font-medium bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                                    >
                                        <User className="h-4 w-4 mr-2" /> View Leaderboard
                                    </Button>
                                </div>
                                <div className="w-full pt-4 border-t border-success/20">
                                    <Button
                                        variant="outline"
                                        className="w-full font-medium"
                                        onClick={() => {
                                            const url = `${window.location.origin}/assessment/${assessmentId}`;
                                            navigator.clipboard.writeText(url);
                                            alert(`Public link copied: ${url}`);
                                        }}
                                    >
                                        <Copy className="w-4 h-4 mr-2" /> Copy Link
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-2">Share this test with applicants using the link above.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 flex items-center justify-center p-12 bg-muted/30 text-muted-foreground/60 h-[400px]">
                            <div className="text-center space-y-3">
                                <Settings className="mx-auto h-12 w-12 opacity-50" />
                                <p className="font-medium px-8 text-sm">
                                    Paste a Job Description and choose an assessment type to build from scratch.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
