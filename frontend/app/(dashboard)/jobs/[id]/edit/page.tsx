"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Monitor, Building, Home, X, Check } from "lucide-react";
import type { JobDescription } from "@/types";
import { cn } from "@/lib/utils";

const departments = ["Engineering", "Design", "Product", "Marketing", "Sales", "HR", "Finance", "Operations"];
const jobTypes: JobDescription["type"][] = ["Full-time", "Part-time", "Contract", "Internship"];
const experienceLevels = ["Fresher", "1-2 years", "2-4 years", "4-6 years", "6-10 years", "10+ years"];
const workModes: { value: JobDescription["workMode"]; icon: typeof Monitor; label: string }[] = [
    { value: "Remote", icon: Home, label: "Remote" },
    { value: "Hybrid", icon: Monitor, label: "Hybrid" },
    { value: "On-site", icon: Building, label: "On-site" },
];

export default function EditJDPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { jobs, setJobs, platforms } = useApp();
    const existingJob = jobs.find((j) => j.id === id) || null;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: existingJob?.title || "",
        department: existingJob?.department || "",
        location: existingJob?.location || "",
        type: existingJob?.type || ("Full-time" as JobDescription["type"]),
        workMode: existingJob?.workMode || ("Remote" as JobDescription["workMode"]),
        experience: existingJob?.experience || "",
        salaryMin: existingJob?.salaryMin?.toString() || "",
        salaryMax: existingJob?.salaryMax?.toString() || "",
        currency: existingJob?.currency || "INR",
        openings: existingJob?.openings?.toString() || "1",
        description: existingJob?.description || "",
        requirements: existingJob?.requirements || ([] as string[]),
        skills: existingJob?.skills || ([] as string[]),
        publishPlatforms: existingJob?.publishedOn || ([] as string[]),
    });
    const [reqInput, setReqInput] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));
    const addTag = (key: "requirements" | "skills", value: string) => {
        if (value.trim() && !form[key].includes(value.trim())) update(key, [...form[key], value.trim()]);
    };
    const removeTag = (key: "requirements" | "skills", idx: number) => {
        update(key, form[key].filter((_, i) => i !== idx));
    };
    const togglePlatform = (name: string) => {
        update("publishPlatforms", form.publishPlatforms.includes(name) ? form.publishPlatforms.filter((p) => p !== name) : [...form.publishPlatforms, name]);
    };

    const handlePublish = (asDraft: boolean) => {
        setLoading(true);
        setTimeout(() => {
            const newJob: JobDescription = {
                id: existingJob?.id || `j${Date.now()}`,
                title: form.title, department: form.department, location: form.location,
                type: form.type, workMode: form.workMode, experience: form.experience,
                salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax),
                currency: form.currency, description: form.description,
                requirements: form.requirements, skills: form.skills,
                openings: Number(form.openings),
                status: asDraft ? "draft" : "published",
                publishedOn: asDraft ? [] : form.publishPlatforms,
                applicantCount: existingJob?.applicantCount || 0,
                createdAt: existingJob?.createdAt || new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
            };
            if (existingJob) {
                setJobs((prev) => prev.map((j) => (j.id === existingJob.id ? newJob : j)));
            } else {
                setJobs((prev) => [newJob, ...prev]);
            }
            setLoading(false);
            toast.success(asDraft ? "Job saved as draft!" : `Job published to ${form.publishPlatforms.join(", ")} successfully!`);
            router.push("/jobs");
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors", step >= s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground")}>
                            {step > s ? <Check className="h-4 w-4" /> : s}
                        </div>
                        <span className={cn("text-sm hidden sm:block", step >= s ? "font-medium" : "text-muted-foreground")}>
                            {s === 1 ? "Basic Info" : s === 2 ? "Job Details" : "Publish"}
                        </span>
                        {s < 3 && <div className={cn("flex-1 h-0.5", step > s ? "bg-primary" : "bg-border")} />}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <Card>
                    <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Job Title *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Senior Frontend Developer" /></div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2"><Label>Department</Label><Select value={form.department} onValueChange={(v) => update("department", v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Bangalore, India" /></div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2"><Label>Job Type</Label><Select value={form.type} onValueChange={(v) => update("type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{jobTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>Experience</Label><Select value={form.experience} onValueChange={(v) => update("experience", v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{experienceLevels.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="space-y-2"><Label>Work Mode</Label><div className="grid grid-cols-3 gap-3">{workModes.map((wm) => (<button key={wm.value} type="button" onClick={() => update("workMode", wm.value)} className={cn("flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors", form.workMode === wm.value ? "border-primary bg-accent" : "border-border hover:border-primary/50")}><wm.icon className="h-5 w-5" /><span className="text-sm font-medium">{wm.label}</span></button>))}</div></div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2"><Label>Min Salary</Label><Input type="number" value={form.salaryMin} onChange={(e) => update("salaryMin", e.target.value)} /></div>
                            <div className="space-y-2"><Label>Max Salary</Label><Input type="number" value={form.salaryMax} onChange={(e) => update("salaryMax", e.target.value)} /></div>
                            <div className="space-y-2"><Label>Currency</Label><Select value={form.currency} onValueChange={(v) => update("currency", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INR">INR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="space-y-2"><Label>Number of Openings</Label><Input type="number" value={form.openings} onChange={(e) => update("openings", e.target.value)} className="w-32" /></div>
                        <div className="flex justify-end"><Button onClick={() => setStep(2)} disabled={!form.title}>Next</Button></div>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Job Description</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} placeholder="Describe the role..." /><p className="text-xs text-muted-foreground">{form.description.length} characters</p></div>
                        <div className="space-y-2"><Label>Requirements</Label><div className="flex gap-2"><Input value={reqInput} onChange={(e) => setReqInput(e.target.value)} placeholder="Type and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("requirements", reqInput); setReqInput(""); } }} /></div><div className="flex flex-wrap gap-2 mt-2">{form.requirements.map((r, i) => (<Badge key={i} variant="secondary" className="gap-1">{r} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag("requirements", i)} /></Badge>))}</div></div>
                        <div className="space-y-2"><Label>Skills Required</Label><div className="flex gap-2"><Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Type and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("skills", skillInput); setSkillInput(""); } }} /></div><div className="flex flex-wrap gap-2 mt-2">{form.skills.map((s, i) => (<Badge key={i} variant="secondary" className="gap-1">{s} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag("skills", i)} /></Badge>))}</div></div>
                        <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Next</Button></div>
                    </CardContent>
                </Card>
            )}

            {step === 3 && (
                <Card>
                    <CardHeader><CardTitle>Publish Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-muted-foreground">Select platforms to publish this job</p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {platforms.map((p) => (
                                <div key={p.id} className={cn("rounded-lg border-2 p-4 transition-colors", form.publishPlatforms.includes(p.name) ? "border-primary bg-accent" : "border-border")}>
                                    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className={cn("h-8 w-8 rounded flex items-center justify-center text-xs font-bold text-primary-foreground", p.name === "LinkedIn" ? "bg-blue-600" : p.name === "Naukri" ? "bg-blue-500" : p.name === "Indeed" ? "bg-violet-600" : p.name === "WorkIndia" ? "bg-orange-500" : "bg-sky-500")}>{p.logo}</div><div><p className="text-sm font-medium">{p.name}</p><Badge variant={p.connected ? "default" : "secondary"} className="text-[10px] h-4 mt-0.5">{p.connected ? "Connected" : "Not Connected"}</Badge></div></div></div>
                                    <div className="flex items-center justify-between"><Switch checked={form.publishPlatforms.includes(p.name)} onCheckedChange={() => togglePlatform(p.name)} disabled={!p.connected} />{!p.connected && (<button className="text-xs text-primary hover:underline" onClick={() => router.push("/settings")}>Connect in Settings →</button>)}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm">This job will be published to <strong>{form.publishPlatforms.length}</strong> platform{form.publishPlatforms.length !== 1 ? "s" : ""}</p>
                        <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><div className="flex gap-2"><Button variant="outline" onClick={() => handlePublish(true)} disabled={loading}>Save as Draft</Button><Button onClick={() => handlePublish(false)} disabled={loading || form.publishPlatforms.length === 0}>{loading ? "Publishing..." : "Publish Now"}</Button></div></div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
