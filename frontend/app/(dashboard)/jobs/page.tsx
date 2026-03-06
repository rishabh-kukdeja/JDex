"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Grid3X3,
    List,
    MapPin,
    Users as UsersIcon,
    Calendar,
    Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PlatformBadge } from "@/components/shared/PlatformBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useApp } from "@/context/AppContext";

export default function JobDescriptionsPage() {
    const router = useRouter();
    const { jobs } = useApp();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [view, setView] = useState<"grid" | "table">("grid");

    const departments = useMemo(
        () => [...new Set(jobs.map((j) => j.department))],
        [jobs]
    );

    const filtered = useMemo(() => {
        return jobs.filter((j) => {
            if (search && !j.title.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (statusFilter !== "all" && j.status !== statusFilter) return false;
            if (deptFilter !== "all" && j.department !== deptFilter) return false;
            return true;
        });
    }, [jobs, search, statusFilter, deptFilter]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div />
                <Button onClick={() => router.push("/jobs/create")}>
                    <Plus className="h-4 w-4 mr-1" /> Create New JD
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Depts</SelectItem>
                        {departments.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex border border-border rounded-lg overflow-hidden">
                    <Button
                        variant={view === "grid" ? "default" : "ghost"}
                        size="icon"
                        className="rounded-none h-9 w-9"
                        onClick={() => setView("grid")}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === "table" ? "default" : "ghost"}
                        size="icon"
                        className="rounded-none h-9 w-9"
                        onClick={() => setView("table")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title="No jobs found"
                    description="Try adjusting your filters or create a new job description."
                    actionLabel="Create New JD"
                    onAction={() => router.push("/jobs/create")}
                />
            ) : view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{job.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-xs">
                                                {job.department}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {job.workMode}
                                            </Badge>
                                        </div>
                                    </div>
                                    <StatusBadge status={job.status} />
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {job.location}
                                    </div>
                                    <div>
                                        Exp: {job.experience} · {job.type}
                                    </div>
                                    <div>
                                        ₹{(job.salaryMin / 100000).toFixed(1)}L – ₹
                                        {(job.salaryMax / 100000).toFixed(1)}L
                                    </div>
                                </div>
                                {job.publishedOn.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        {job.publishedOn.map((p) => (
                                            <PlatformBadge key={p} name={p} />
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <UsersIcon className="h-3.5 w-3.5" /> {job.applicantCount}{" "}
                                        applicants
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" /> {job.createdAt}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => router.push(`/jobs/${job.id}/edit`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() =>
                                            router.push(`/applicants?job=${job.id}`)
                                        }
                                    >
                                        Applicants
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs text-muted-foreground">
                                    <th className="px-4 py-3 text-left font-medium">Title</th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Department
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">Type</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Applicants
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Published On
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((job) => (
                                    <tr
                                        key={job.id}
                                        className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                                        onClick={() => router.push(`/jobs/${job.id}/edit`)}
                                    >
                                        <td className="px-4 py-3 font-medium">{job.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {job.department}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {job.type}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={job.status} />
                                        </td>
                                        <td className="px-4 py-3">{job.applicantCount}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                {job.publishedOn.map((p) => (
                                                    <PlatformBadge key={p} name={p} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {job.createdAt}
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
