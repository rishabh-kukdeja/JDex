"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CandidateAssessmentPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.id as string;

    const [assessment, setAssessment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [candidateData, setCandidateData] = useState({ name: "", email: "" });
    const [answers, setAnswers] = useState<any>({ mcqs: [], subjective: [] });
    const [authLoading, setAuthLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                router.push("/login");
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        async function fetchAssessment() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await fetch(`${apiUrl}/api/assessments/${assessmentId}`);
                if (!res.ok) throw new Error("Assessment not found");
                const data = await res.json();

                // data.assessment handles the actual Gemini generated schema
                setAssessment(data.assessment);

                // Initialize answers
                const mcqAnswers = data.assessment.mcqs?.map((_: any, i: number) => ({ index: i, selectedOption: null })) || [];
                const subAnswers = data.assessment.subjective?.map((_: any, i: number) => ({ index: i, answer: "" })) || [];
                const codingAnswers = data.assessment.coding?.map((_: any, i: number) => ({ index: subAnswers.length + i, answer: "" })) || [];
                setAnswers({ mcqs: mcqAnswers, subjective: [...subAnswers, ...codingAnswers] });
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        }

        if (assessmentId && isAuthenticated) fetchAssessment();
    }, [assessmentId, isAuthenticated]);

    const handleMCQChange = (questionIndex: number, val: string) => {
        const mcqs = [...answers.mcqs];
        mcqs[questionIndex].selectedOption = parseInt(val);
        setAnswers({ ...answers, mcqs });
    };

    const handleSubjectiveChange = (questionIndex: number, val: string) => {
        const subjective = [...answers.subjective];
        subjective[questionIndex].answer = val;
        setAnswers({ ...answers, subjective });
    };

    const handleSubmit = async () => {
        if (!candidateData.name || !candidateData.email) {
            setError("Please fill out your name and email.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/assessments/${assessmentId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidateName: candidateData.name,
                    email: candidateData.email,
                    candidateAnswers: answers
                })
            });

            if (!res.ok) throw new Error("Failed to submit assessment");

            router.push(`/assessment/${assessmentId}/success`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) return <div className="p-12 text-center text-lg animate-pulse">Loading assessment...</div>;
    if (error && !assessment) return <div className="p-12 text-center text-destructive font-semibold">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
            <div className="mb-8 flex items-center justify-between border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <BookOpen className="h-6 w-6" /> {assessment.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">Test your judgement, not just your memory.</p>
                </div>
                <div className="text-right">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted font-medium text-sm">
                        <Clock className="w-4 h-4 text-warning" /> 60m Timer
                    </span>
                </div>
            </div>

            <Card className="mb-8 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Candidate Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                            value={candidateData.name}
                            onChange={e => setCandidateData({ ...candidateData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={candidateData.email}
                            onChange={e => setCandidateData({ ...candidateData, email: e.target.value })}
                            placeholder="john@example.com"
                            type="email"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-8">
                {/* MCQs */}
                {assessment.mcqs?.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold border-b pb-2">Part 1: Scenario Judgment (Multiple Choice)</h2>
                        {assessment.mcqs.map((mcq: any, i: number) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium leading-relaxed">
                                        <span className="text-primary font-bold mr-2">Q{i + 1}.</span>
                                        {mcq.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup onValueChange={(val) => handleMCQChange(i, val)}>
                                        <div className="space-y-3">
                                            {mcq.options.map((opt: string, optIndex: number) => (
                                                <div key={optIndex} className="flex items-start space-x-3 p-3 rounded-md border border-transparent hover:border-muted hover:bg-muted/30 transition-colors">
                                                    <RadioGroupItem value={optIndex.toString()} id={`q${i}-opt${optIndex}`} className="mt-1" />
                                                    <Label htmlFor={`q${i}-opt${optIndex}`} className="font-normal text-sm leading-relaxed cursor-pointer w-full">{opt}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Subjective */}
                {assessment.subjective?.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <h2 className="text-2xl font-semibold border-b pb-2">Part 2: Deep Understanding (Open Ended)</h2>
                        {assessment.subjective.map((sub: any, i: number) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium leading-relaxed">
                                        <span className="text-primary font-bold mr-2">Q{assessment.mcqs.length + i + 1}.</span>
                                        {sub.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder="Write your answer here. Focus on the nuances and reasoning..."
                                        className="min-h-[150px] resize-y"
                                        value={answers.subjective[i]?.answer || ''}
                                        onChange={(e) => handleSubjectiveChange(i, e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Coding Challenge */}
                {assessment.coding?.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <h2 className="text-2xl font-semibold border-b pb-2">Part 3: Coding Challenge</h2>
                        {assessment.coding.map((codingProb: any, i: number) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium leading-relaxed">
                                        <span className="text-primary font-bold mr-2">Problem {i + 1}.</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted/30 p-4 rounded-md text-sm leading-relaxed border space-y-4">
                                        <p className="font-semibold">{codingProb.problemStatement}</p>

                                        <div>
                                            <p className="font-bold text-xs uppercase tracking-wider mb-2">Examples</p>
                                            {codingProb.examples?.map((ex: any, idx: number) => (
                                                <div key={idx} className="bg-background py-2 px-3 border rounded-md mb-2 font-mono text-xs">
                                                    <p>Input: {ex.input}</p>
                                                    <p>Output: {ex.output}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {codingProb.constraints?.length > 0 && (
                                            <div>
                                                <p className="font-bold text-xs uppercase tracking-wider mb-1">Constraints</p>
                                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                                    {codingProb.constraints.map((c: string, idx: number) => (
                                                        <li key={idx}>{c}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <Textarea
                                        placeholder="// Write your code here..."
                                        className="min-h-[300px] font-mono text-sm bg-zinc-950 text-zinc-50 border-zinc-800"
                                        value={answers.subjective[assessment.subjective?.length + i]?.answer || ''}
                                        onChange={(e) => handleSubjectiveChange(assessment.subjective?.length + i, e.target.value)}
                                        spellCheck={false}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {error && <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>}

            <div className="mt-12 flex justify-end mb-24">
                <Button
                    size="lg"
                    className="w-[200px] text-lg font-semibold flex items-center gap-2"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Evaluating..." : <><CheckCircle className="w-5 h-5" /> Submit Answers</>}
                </Button>
            </div>
        </div>
    );
}
