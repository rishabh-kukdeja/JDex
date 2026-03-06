"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Copy, Navigation, ExternalLink, Calendar, Briefcase, ActivitySquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

export default function AssessmentsPage() {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) {
                    console.error("No token available");
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await fetch(`${apiUrl}/api/assessments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setAssessments(data);
            } catch (err) {
                console.error("Failed to load assessments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const copyPublicLink = (id: string) => {
        const url = `${window.location.origin}/assessment/${id}`;
        navigator.clipboard.writeText(url);
        // Optional: show a quick toast or alert instead of standard alert
        alert(`Public link copied: ${url}`);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">Your Assessments</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    View your previously generated role assessments, access public test links, and check applicant leaderboards.
                </p>
            </div>

            {assessments.length === 0 ? (
                <Card className="border-dashed border-2 flex items-center justify-center p-12 bg-muted/30 text-muted-foreground/60 h-[300px]">
                    <div className="text-center space-y-3">
                        <ActivitySquare className="mx-auto h-12 w-12 opacity-50" />
                        <p className="font-medium px-8 text-sm">
                            You haven't generated any assessments yet. Head over to New Assessment to get started!
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {assessments.map((a) => (
                        <Card key={a.id} className="shadow-md hover:shadow-lg transition-shadow border-primary/10">
                            <CardHeader>
                                <CardTitle className="truncate">{a.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1.5 mt-1 truncate">
                                    <Briefcase className="w-3.5 h-3.5" /> {a.role}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {a.createdAt ? format(new Date(a.createdAt), "MMM d, yyyy h:mm a") : "Unknown Date"}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 flex flex-col gap-2 p-4 border-t">
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <Button
                                        variant="outline"
                                        className="w-full text-xs font-semibold hover:bg-primary/5"
                                        onClick={() => copyPublicLink(a.id)}
                                    >
                                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Link
                                    </Button>
                                    <Button
                                        className="w-full text-xs font-bold"
                                        onClick={() => window.open(`/leaderboard/${a.id}`, '_blank')}
                                    >
                                        <Navigation className="w-3.5 h-3.5 mr-1" /> Leaderboard
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
