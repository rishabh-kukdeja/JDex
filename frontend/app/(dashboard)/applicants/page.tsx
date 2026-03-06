"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Eye, Mail, Calendar, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PlatformBadgeWithLabel } from "@/components/shared/PlatformBadge";
import { ATSScoreBadge } from "@/components/applicants/ATSScoreRing";
import { StatusDropdown } from "@/components/applicants/StatusDropdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { useApp } from "@/context/AppContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusTabs = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "interview_scheduled", label: "Interview" },
    { value: "selected", label: "Selected" },
    { value: "rejected", label: "Rejected" },
    { value: "on_hold", label: "On Hold" },
];

export default function ApplicantsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { applicants, jobs } = useApp();

    const [search, setSearch] = useState("");
    const [statusTab, setStatusTab] = useState("all");
    const [jobFilter, setJobFilter] = useState(searchParams.get("job") || "all");
    const [sourceFilter, setSourceFilter] = useState("all");

    const filtered = useMemo(() => {
        return applicants.filter((a) => {
            if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
            if (statusTab !== "all" && a.status !== statusTab) return false;
            if (jobFilter !== "all" && a.jobId !== jobFilter) return false;
            if (sourceFilter !== "all" && a.source !== sourceFilter) return false;
            return true;
        });
    }, [applicants, search, statusTab, jobFilter, sourceFilter]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: applicants.length };
        applicants.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
        return counts;
    }, [applicants]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{applicants.length} total applicants</span>
            </div>

            <Tabs value={statusTab} onValueChange={setStatusTab}>
                <TabsList className="h-auto flex-wrap">
                    {statusTabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                            {tab.label} <span className="ml-1 text-muted-foreground">({statusCounts[tab.value] || 0})</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Job" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobs.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-[130px]"><SelectValue placeholder="Source" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {["LinkedIn", "Naukri", "Indeed", "WorkIndia", "Direct"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Users} title="No applicants found" description="Publish a job to start receiving applications." />
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs text-muted-foreground">
                                    <th className="px-4 py-3 text-left font-medium">Candidate</th>
                                    <th className="px-4 py-3 text-left font-medium">Job Applied</th>
                                    <th className="px-4 py-3 text-left font-medium">Source</th>
                                    <th className="px-4 py-3 text-left font-medium">Applied</th>
                                    <th className="px-4 py-3 text-left font-medium">ATS Score</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((a) => (
                                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/applicants/${a.id}`)}>
                                                <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{a.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                                                <div><p className="font-medium hover:underline">{a.name}</p><p className="text-xs text-muted-foreground">{a.email}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{a.jobTitle}</td>
                                        <td className="px-4 py-3"><PlatformBadgeWithLabel name={a.source} /></td>
                                        <td className="px-4 py-3 text-muted-foreground">{a.appliedAt}</td>
                                        <td className="px-4 py-3"><ATSScoreBadge score={a.atsScore} /></td>
                                        <td className="px-4 py-3"><StatusDropdown applicantId={a.id} currentStatus={a.status} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push(`/applicants/${a.id}`)}><Eye className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent>View Profile</TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push("/email")}><Mail className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent>Send Email</TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push("/interviews")}><Calendar className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent>Schedule Interview</TooltipContent></Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
