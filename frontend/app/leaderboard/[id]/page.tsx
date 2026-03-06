"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Trophy, ArrowRightCircle, Star, Target, Brain, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.id as string;

    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch(`http://localhost:5000/api/assessments/${assessmentId}/leaderboard`);
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                const data = await res.json();

                setLeaderboard(data.leaderboard);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        }

        if (assessmentId) fetchLeaderboard();
    }, [assessmentId]);

    const getRecommendationColor = (rec: string) => {
        if (!rec) return "bg-muted";
        const lower = rec.toLowerCase();
        if (lower.includes("advance") || lower.includes("hire") || lower.includes("strong")) return "bg-success text-success-foreground border-success/30";
        if (lower.includes("reject") || lower.includes("no")) return "bg-destructive text-destructive-foreground border-destructive/30";
        return "bg-warning text-warning-foreground border-warning/30"; // Hold/Maybe
    };

    if (loading) return <div className="p-12 text-center text-lg animate-pulse">Ranking Candidates... (simulating AI Evaluation)</div>;
    if (error) return <div className="p-12 text-center text-destructive font-semibold">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
            <div className="mb-10 flex items-center justify-between border-b pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-primary">
                        <Trophy className="h-8 w-8 text-yellow-500 drop-shadow-md" />
                        Beat Claude Leaderboard
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Candidates ranked strictly by AI based on your custom JD criteria.</p>
                </div>
                <div>
                    <Button variant="outline" onClick={() => router.push('/')}>
                        Dashboard <ArrowRightCircle className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="leaderboard" className="w-full">
                <TabsList className="mb-8 p-1 bg-muted/50">
                    <TabsTrigger value="leaderboard" className="flex gap-2 items-center px-6 py-2">
                        <Trophy className="w-4 h-4" /> Rankings
                    </TabsTrigger>
                    <TabsTrigger value="evaluations" className="flex gap-2 items-center px-6 py-2">
                        <Target className="w-4 h-4" /> Detailed Evaluations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="leaderboard">
                    {leaderboard.length === 0 ? (
                        <Card className="border-dashed border-2 py-16 bg-muted/20 text-center text-muted-foreground">
                            <AlertTriangle className="mx-auto w-12 h-12 mb-4 opacity-50" />
                            <h2 className="text-xl font-medium mb-2">No Candidates Yet</h2>
                            <p className="max-w-md mx-auto">Share the assessment link with candidates. Once they complete the test, the AI will score them and they will appear ranked here.</p>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {leaderboard.map((candidate, idx) => (
                                <Card key={candidate.id} className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${idx === 0 ? 'border-primary shadow-sm bg-primary/5' : 'hover:border-primary/50'}`}>
                                    <div className="flex flex-col md:flex-row">
                                        <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 bg-card/50 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${idx === 0 ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>
                                                            #{idx + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg leading-none">{candidate.candidateName}</h3>
                                                            <span className="text-xs text-muted-foreground mt-1 inline-block">Score: {candidate.totalScore}/100</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 mt-6">
                                                    <Badge variant="outline" className={`w-full justify-center px-4 py-1.5 text-sm uppercase tracking-wider font-bold shadow-sm ${getRecommendationColor(candidate.evaluation?.overallRecommendation)}`}>
                                                        {candidate.evaluation?.overallRecommendation || "N/A"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">AI Summary</p>
                                                <p className="text-sm italic text-foreground/80 leading-relaxed border-l-2 border-primary/40 pl-3">
                                                    "{candidate.evaluation?.reasoning || "Pending deep analysis."}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:w-2/3 bg-background flex flex-col gap-6 w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                                <div className="space-y-3">
                                                    <h4 className="flex items-center gap-2 text-sm font-bold text-success capitalize tracking-wide border-b border-success/20 pb-1">
                                                        <Star className="w-4 h-4" /> Core Strengths
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {candidate.evaluation?.strengths?.map((s: string, i: number) => (
                                                            <li key={i} className="text-sm flex items-start leading-tight">
                                                                <CheckCircle className="w-3.5 h-3.5 mr-2 text-success shrink-0 mt-0.5" />
                                                                <span className="text-muted-foreground">{s}</span>
                                                            </li>
                                                        ))}
                                                        {(!candidate.evaluation?.strengths || candidate.evaluation?.strengths.length === 0) && <li className="text-sm text-muted">None specified</li>}
                                                    </ul>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="flex items-center gap-2 text-sm font-bold text-destructive capitalize tracking-wide border-b border-destructive/20 pb-1">
                                                        <Target className="w-4 h-4" /> Areas for Growth
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {candidate.evaluation?.weaknesses?.map((w: string, i: number) => (
                                                            <li key={i} className="text-sm flex items-start leading-tight">
                                                                <AlertTriangle className="w-3.5 h-3.5 mr-2 text-destructive shrink-0 mt-0.5" />
                                                                <span className="text-muted-foreground">{w}</span>
                                                            </li>
                                                        ))}
                                                        {(!candidate.evaluation?.weaknesses || candidate.evaluation?.weaknesses.length === 0) && <li className="text-sm text-muted">None specified</li>}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="mt-auto border-t border-border pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                                                        <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-md">
                                                            <Brain className="w-3.5 h-3.5" /> MCQ: <span className="font-bold text-foreground">{candidate.evaluation?.mcqScore || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-md">
                                                            <User className="w-3.5 h-3.5" /> Subjective: <span className="font-bold text-foreground">{candidate.evaluation?.subjectiveScore || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="evaluations">
                    <div className="space-y-6">
                        {leaderboard.map((candidate, idx) => (
                            <Card key={idx} className="border border-border/50">
                                <CardHeader className="bg-muted/20 border-b border-border/50">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            {candidate.candidateName}
                                            <span className="text-sm font-normal text-muted-foreground">{candidate.email}</span>
                                        </CardTitle>
                                        <Badge variant="secondary" className="text-base font-bold bg-primary/10 text-primary uppercase">
                                            Total: {candidate.totalScore}/100
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Submitted at: {new Date(candidate.submittedAt).toLocaleString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6 bg-muted/10 p-4 rounded-xl border border-muted/30">
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold mb-3 text-muted-foreground tracking-tight text-sm uppercase">MCQ Performance</h4>
                                            <p className="text-3xl font-black">{candidate.evaluation?.mcqScore || 0}</p>
                                        </div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold mb-3 text-muted-foreground tracking-tight text-sm uppercase">Subjective Logic</h4>
                                            <p className="text-3xl font-black">{candidate.evaluation?.subjectiveScore || 0}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg pb-1 border-b">Evaluator Insights</h4>
                                        <p className="text-sm leading-relaxed border-l-4 border-primary pl-4 py-1 italic bg-muted/20 rounded-r-md">
                                            "{candidate.evaluation?.reasoning || "No insights provided."}"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
