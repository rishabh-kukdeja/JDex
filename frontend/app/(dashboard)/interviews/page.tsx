"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar as CalendarIcon, Video, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import type { Interview } from "@/types";

const modeIcons = { Online: Video, Offline: MapPin, Phone };

export default function InterviewsPage() {
    const router = useRouter();
    const { interviews, setInterviews, applicants, teamMembers } = useApp();
    const [statusFilter, setStatusFilter] = useState("all");
    const [modeFilter, setModeFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);

    const [formApplicant, setFormApplicant] = useState("");
    const [formDate, setFormDate] = useState("");
    const [formTime, setFormTime] = useState("");
    const [formDuration, setFormDuration] = useState("60");
    const [formMode, setFormMode] = useState<Interview["mode"]>("Online");
    const [formMeetLink, setFormMeetLink] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formInterviewers, setFormInterviewers] = useState<string[]>([]);
    const [scheduling, setScheduling] = useState(false);

    const filtered = useMemo(() => {
        return interviews.filter((i) => {
            if (statusFilter !== "all" && i.status !== statusFilter) return false;
            if (modeFilter !== "all" && i.mode !== modeFilter) return false;
            return true;
        }).sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
    }, [interviews, statusFilter, modeFilter]);

    const handleSchedule = () => {
        const applicant = applicants.find((a) => a.id === formApplicant);
        if (!applicant || !formDate || !formTime) return;
        setScheduling(true);
        setTimeout(() => {
            const newInterview: Interview = {
                id: `i${Date.now()}`, applicantId: applicant.id, applicantName: applicant.name,
                applicantAvatar: "", jobTitle: applicant.jobTitle,
                scheduledAt: `${formDate}T${formTime}:00`, duration: Number(formDuration),
                mode: formMode, interviewers: formInterviewers,
                meetLink: formMode === "Online" ? formMeetLink : undefined,
                location: formMode === "Offline" ? formLocation : undefined,
                status: "scheduled",
            };
            setInterviews((prev) => [...prev, newInterview]);
            setScheduling(false);
            setModalOpen(false);
            toast.success(`Interview scheduled with ${applicant.name}`);
            setFormApplicant(""); setFormDate(""); setFormTime(""); setFormMeetLink(""); setFormLocation(""); setFormInterviewers([]);
        }, 800);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div />
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Schedule Interview</Button></DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2"><Label>Select Applicant</Label><Select value={formApplicant} onValueChange={setFormApplicant}><SelectTrigger><SelectValue placeholder="Choose applicant" /></SelectTrigger><SelectContent>{applicants.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name} — {a.jobTitle}</SelectItem>))}</SelectContent></Select></div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label>Date</Label><Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} /></div>
                                <div className="space-y-2"><Label>Time</Label><Input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} /></div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label>Duration</Label><Select value={formDuration} onValueChange={setFormDuration}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="45">45 min</SelectItem><SelectItem value="60">60 min</SelectItem><SelectItem value="90">90 min</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Mode</Label><Select value={formMode} onValueChange={(v) => setFormMode(v as Interview["mode"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Offline">Offline</SelectItem><SelectItem value="Phone">Phone</SelectItem></SelectContent></Select></div>
                            </div>
                            {formMode === "Online" && (<div className="space-y-2"><Label>Meet Link</Label><Input value={formMeetLink} onChange={(e) => setFormMeetLink(e.target.value)} placeholder="https://meet.google.com/..." /></div>)}
                            {formMode === "Offline" && (<div className="space-y-2"><Label>Location</Label><Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="Office address" /></div>)}
                            <div className="space-y-2"><Label>Interviewers</Label><div className="flex flex-wrap gap-2">{teamMembers.map((tm) => (<Button key={tm.id} type="button" variant={formInterviewers.includes(tm.name) ? "default" : "outline"} size="sm" onClick={() => { setFormInterviewers((prev) => prev.includes(tm.name) ? prev.filter((n) => n !== tm.name) : [...prev, tm.name]); }}>{tm.name}</Button>))}</div></div>
                            <Button className="w-full" onClick={handleSchedule} disabled={scheduling || !formApplicant || !formDate || !formTime}>{scheduling ? "Scheduling..." : "Schedule Interview"}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-wrap gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
                <Select value={modeFilter} onValueChange={setModeFilter}><SelectTrigger className="w-[130px]"><SelectValue placeholder="Mode" /></SelectTrigger><SelectContent><SelectItem value="all">All Modes</SelectItem><SelectItem value="Online">Online</SelectItem><SelectItem value="Offline">Offline</SelectItem><SelectItem value="Phone">Phone</SelectItem></SelectContent></Select>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={CalendarIcon} title="No interviews found" description="Schedule an interview to get started." actionLabel="Schedule Interview" onAction={() => setModalOpen(true)} />
            ) : (
                <div className="space-y-3">
                    {filtered.map((interview) => {
                        const dt = new Date(interview.scheduledAt);
                        const ModeIcon = modeIcons[interview.mode] || Video;
                        return (
                            <Card key={interview.id} className="hover:shadow-sm transition-shadow">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                                        <span className="text-[10px] font-medium text-primary uppercase">{dt.toLocaleDateString("en-IN", { month: "short" })}</span>
                                        <span className="text-xl font-bold text-primary">{dt.getDate()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{interview.applicantName.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="text-sm font-medium cursor-pointer hover:underline" onClick={() => { const a = applicants.find(a => a.id === interview.applicantId); if (a) router.push(`/applicants/${a.id}`); }}>{interview.applicantName}</p>
                                                <p className="text-xs text-muted-foreground">{interview.jobTitle}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>{dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {interview.duration} min</span>
                                            <Badge variant="outline" className="text-[10px] gap-1"><ModeIcon className="h-3 w-3" /> {interview.mode}</Badge>
                                            <span>{interview.interviewers.join(", ")}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={interview.status} />
                                        {interview.mode === "Online" && interview.meetLink && interview.status === "scheduled" && (
                                            <Button size="sm" variant="outline" className="text-success border-success/30" asChild><a href={interview.meetLink} target="_blank" rel="noopener noreferrer">Join Meet</a></Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
