"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PlatformBadgeWithLabel } from "@/components/shared/PlatformBadge";
import { ATSScoreRing } from "@/components/applicants/ATSScoreRing";
import { StatusDropdown } from "@/components/applicants/StatusDropdown";
import { useApp } from "@/context/AppContext";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function ApplicantDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { applicants, setApplicants, jobs, interviews } = useApp();

    const applicant = applicants.find((a) => a.id === id);
    const [editingNote, setEditingNote] = useState(false);
    const [noteText, setNoteText] = useState(applicant?.notes || "");

    if (!applicant) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">Applicant not found.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/applicants")}>Back to Applicants</Button>
            </div>
        );
    }

    const job = jobs.find((j) => j.id === applicant.jobId);
    const applicantInterviews = interviews.filter((i) => i.applicantId === applicant.id);
    const initials = applicant.name.split(" ").map((n) => n[0]).join("");

    const saveNote = () => {
        setApplicants((prev) => prev.map((a) => (a.id === applicant.id ? { ...a, notes: noteText } : a)));
        setEditingNote(false);
        toast.success("Note saved");
    };

    return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/applicants")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Applicants
            </Button>

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-16 w-16"><AvatarFallback className="text-lg bg-primary/10 text-primary">{initials}</AvatarFallback></Avatar>
                                <div><h2 className="text-xl font-bold">{applicant.name}</h2><p className="text-sm text-muted-foreground">{applicant.email}</p><p className="text-sm text-muted-foreground">{applicant.phone}</p></div>
                            </div>
                            <StatusDropdown applicantId={applicant.id} currentStatus={applicant.status} />
                            <Separator />
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-sm font-medium">ATS Score</p>
                                <ATSScoreRing score={applicant.atsScore} size={130} />
                                <div className="w-full space-y-2">
                                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Skills Match</span><span className="font-medium">{applicant.atsBreakdown.skillsMatch}%</span></div>
                                    <Progress value={applicant.atsBreakdown.skillsMatch} className="h-1.5" />
                                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Experience Match</span><span className="font-medium">{applicant.atsBreakdown.experienceMatch}%</span></div>
                                    <Progress value={applicant.atsBreakdown.experienceMatch} className="h-1.5" />
                                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Education Match</span><span className="font-medium">{applicant.atsBreakdown.educationMatch}%</span></div>
                                    <Progress value={applicant.atsBreakdown.educationMatch} className="h-1.5" />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">Source</span><PlatformBadgeWithLabel name={applicant.source} /></div>
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">Applied for</span><Link href={`/jobs/${applicant.jobId}/edit`} className="text-primary hover:underline text-right">{applicant.jobTitle}</Link></div>
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">Applied on</span><span>{applicant.appliedAt}</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-base">Activity Log</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {applicant.activityLog.map((log, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <div><p>{log.action}</p><p className="text-xs text-muted-foreground">{log.date} · by {log.by}</p></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">Notes</CardTitle>{!editingNote && <Button variant="ghost" size="sm" onClick={() => setEditingNote(true)}>Edit</Button>}</div></CardHeader>
                        <CardContent>
                            {editingNote ? (
                                <div className="space-y-2"><Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3} /><div className="flex gap-2"><Button size="sm" onClick={saveNote}>Save</Button><Button size="sm" variant="outline" onClick={() => setEditingNote(false)}>Cancel</Button></div></div>
                            ) : (<p className="text-sm text-muted-foreground">{applicant.notes || "No notes yet."}</p>)}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Tabs defaultValue="resume">
                        <TabsList><TabsTrigger value="resume">Resume</TabsTrigger><TabsTrigger value="comparison">JD Comparison</TabsTrigger><TabsTrigger value="interviews">Interviews</TabsTrigger></TabsList>

                        <TabsContent value="resume" className="mt-4">
                            <Card><CardContent className="p-6 space-y-6">
                                <div><h3 className="text-xl font-bold">{applicant.name}</h3><p className="text-sm text-muted-foreground mt-1">{applicant.resumeData.summary}</p></div>
                                {applicant.resumeData.workHistory.length > 0 && (<div><h4 className="font-semibold mb-3">Work Experience</h4><div className="space-y-3">{applicant.resumeData.workHistory.map((w, i) => (<div key={i} className="border-l-2 border-primary pl-4"><p className="font-medium">{w.role}</p><p className="text-sm text-muted-foreground">{w.company} · {w.duration}</p><p className="text-sm mt-1">{w.description}</p></div>))}</div></div>)}
                                <div><h4 className="font-semibold mb-3">Education</h4><div className="space-y-2">{applicant.resumeData.educationHistory.map((e, i) => (<div key={i}><p className="font-medium">{e.degree}</p><p className="text-sm text-muted-foreground">{e.institution} · {e.year}</p></div>))}</div></div>
                                {applicant.resumeData.certifications.length > 0 && (<div><h4 className="font-semibold mb-2">Certifications</h4><ul className="list-disc list-inside text-sm space-y-1">{applicant.resumeData.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul></div>)}
                                <div><h4 className="font-semibold mb-2">Skills</h4><div className="flex flex-wrap gap-2">{applicant.skills.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}</div></div>
                            </CardContent></Card>
                        </TabsContent>

                        <TabsContent value="comparison" className="mt-4">
                            <Card><CardContent className="p-6">
                                {job ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm font-medium border-b border-border pb-2"><span>Required Skill</span><span>Candidate Has</span></div>
                                        {job.skills.map((skill, i) => {
                                            const has = applicant.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
                                            return (<div key={i} className="grid grid-cols-2 gap-4 text-sm items-center"><span>{skill}</span><div className="flex items-center gap-1">{has ? (<><Check className="h-4 w-4 text-success" /><span className="text-success">Match</span></>) : (<><X className="h-4 w-4 text-destructive" /><span className="text-destructive">Missing</span></>)}</div></div>);
                                        })}
                                        <Separator />
                                        <div className="text-center"><p className="text-3xl font-bold text-primary">{applicant.atsBreakdown.skillsMatch}%</p><p className="text-sm text-muted-foreground">Skills Match</p></div>
                                    </div>
                                ) : (<p className="text-muted-foreground text-center py-8">Job not found for comparison.</p>)}
                            </CardContent></Card>
                        </TabsContent>

                        <TabsContent value="interviews" className="mt-4">
                            <Card><CardContent className="p-6">
                                {applicantInterviews.length === 0 ? (
                                    <div className="text-center py-8"><Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-muted-foreground mb-3">No interviews scheduled</p><Button onClick={() => router.push("/interviews")}>Schedule Interview</Button></div>
                                ) : (<div className="space-y-3">{applicantInterviews.map((interview) => { const dt = new Date(interview.scheduledAt); return (<div key={interview.id} className="flex items-center gap-4 rounded-lg border border-border p-3"><div className="text-center"><p className="text-xs text-muted-foreground">{dt.toLocaleDateString("en-IN", { month: "short" })}</p><p className="text-xl font-bold">{dt.getDate()}</p></div><div className="flex-1"><p className="text-sm font-medium">{dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {interview.duration} min</p><p className="text-xs text-muted-foreground">{interview.interviewers.join(", ")}</p></div><StatusBadge status={interview.status} /></div>); })}</div>)}
                            </CardContent></Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex gap-3 mt-4">
                        <Button onClick={() => router.push("/interviews")}><Calendar className="h-4 w-4 mr-1" /> Schedule Interview</Button>
                        <Button variant="outline" onClick={() => router.push("/email")}><Mail className="h-4 w-4 mr-1" /> Send Email</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
