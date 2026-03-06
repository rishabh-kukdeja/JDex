"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailTemplate, TeamMember, PipelineStage } from "@/types";

export default function SettingsPage() {
    const { platforms, setPlatforms, emailTemplates, setEmailTemplates, teamMembers, setTeamMembers, pipelineStages, setPipelineStages } = useApp();

    const togglePlatformEnabled = (id: string) => { setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))); toast.success("Platform setting updated"); };
    const togglePlatformConnection = (id: string) => { setPlatforms((prev) => prev.map((p) => { if (p.id !== id) return p; if (p.connected) { return { ...p, connected: false, enabled: false }; } else { toast.info("Redirect to OAuth (demo)"); return { ...p, connected: true }; } })); };

    const [tEditing, setTEditing] = useState<EmailTemplate | null>(null);
    const [tCreating, setTCreating] = useState(false);
    const [tName, setTName] = useState(""); const [tType, setTType] = useState<EmailTemplate["type"]>("custom");
    const [tSubject, setTSubject] = useState(""); const [tBody, setTBody] = useState("");

    const saveTemplate = () => {
        if (tEditing) { setEmailTemplates((prev) => prev.map((t) => (t.id === tEditing.id ? { ...t, name: tName, type: tType, subject: tSubject, body: tBody } : t))); toast.success("Template updated"); }
        else { setEmailTemplates((prev) => [...prev, { id: `et${Date.now()}`, name: tName, type: tType, subject: tSubject, body: tBody }]); toast.success("Template created"); }
        setTEditing(null); setTCreating(false); setTName(""); setTSubject(""); setTBody(""); setTType("custom");
    };

    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState(""); const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Recruiter");
    const inviteMember = () => { setTeamMembers((prev) => [...prev, { id: `tm${Date.now()}`, name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, avatar: "", department: "HR", joinedAt: new Date().toISOString().split("T")[0] }]); toast.success(`Invitation sent to ${inviteEmail}`); setInviteOpen(false); setInviteEmail(""); setInviteRole("Recruiter"); };
    const removeMember = (id: string) => { setTeamMembers((prev) => prev.filter((m) => m.id !== id)); toast.success("Team member removed"); };

    const [newStageLabel, setNewStageLabel] = useState("");
    const moveStage = (index: number, dir: -1 | 1) => { setPipelineStages((prev) => { const next = [...prev]; const target = index + dir; if (target < 0 || target >= next.length) return prev;[next[index], next[target]] = [next[target], next[index]]; return next.map((s, i) => ({ ...s, order: i + 1 })); }); };
    const addStage = () => { if (!newStageLabel.trim()) return; setPipelineStages((prev) => [...prev, { id: `ps${Date.now()}`, label: newStageLabel.trim(), color: "#6B7280", order: prev.length + 1 }]); setNewStageLabel(""); toast.success("Stage added"); };
    const removeStage = (id: string) => { setPipelineStages((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }))); toast.success("Stage removed"); };

    return (
        <Tabs defaultValue="integrations" className="space-y-4">
            <TabsList><TabsTrigger value="integrations">Integrations</TabsTrigger><TabsTrigger value="templates">Email Templates</TabsTrigger><TabsTrigger value="team">Team Members</TabsTrigger><TabsTrigger value="pipeline">Pipeline Stages</TabsTrigger></TabsList>

            <TabsContent value="integrations">
                <div className="space-y-3">
                    {platforms.map((p) => (
                        <Card key={p.id}><CardContent className="p-4 flex items-center gap-4">
                            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground", p.name === "LinkedIn" ? "bg-blue-600" : p.name === "Naukri" ? "bg-blue-500" : p.name === "Indeed" ? "bg-violet-600" : p.name === "WorkIndia" ? "bg-orange-500" : "bg-sky-500")}>{p.logo}</div>
                            <div className="flex-1"><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">Post jobs to {p.name}</p></div>
                            <Badge variant={p.connected ? "default" : "secondary"}>{p.connected ? "Connected" : "Not Connected"}</Badge>
                            <Switch checked={p.enabled} onCheckedChange={() => togglePlatformEnabled(p.id)} disabled={!p.connected} />
                            <Button variant={p.connected ? "outline" : "default"} size="sm" className={p.connected ? "text-destructive border-destructive/30" : ""} onClick={() => togglePlatformConnection(p.id)}>{p.connected ? "Disconnect" : "Connect"}</Button>
                        </CardContent></Card>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="templates">
                <Card>
                    <CardHeader><div className="flex items-center justify-between"><CardTitle>Email Templates</CardTitle><Button size="sm" onClick={() => { setTCreating(true); setTEditing(null); setTName(""); setTSubject(""); setTBody(""); }}><Plus className="h-3 w-3 mr-1" /> New Template</Button></div></CardHeader>
                    <CardContent className="space-y-3">
                        {tCreating && (
                            <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/50">
                                <Input placeholder="Name" value={tName} onChange={(e) => setTName(e.target.value)} />
                                <Select value={tType} onValueChange={(v) => setTType(v as EmailTemplate["type"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="shortlist">Shortlist</SelectItem><SelectItem value="reject">Reject</SelectItem><SelectItem value="interview">Interview</SelectItem><SelectItem value="offer">Offer</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select>
                                <Input placeholder="Subject" value={tSubject} onChange={(e) => setTSubject(e.target.value)} />
                                <Textarea placeholder="Body" value={tBody} onChange={(e) => setTBody(e.target.value)} rows={4} />
                                <div className="flex gap-2"><Button size="sm" onClick={saveTemplate}>Save</Button><Button size="sm" variant="outline" onClick={() => { setTCreating(false); setTEditing(null); }}>Cancel</Button></div>
                            </div>
                        )}
                        {emailTemplates.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div><p className="text-sm font-medium">{t.name}</p><Badge variant="outline" className="text-[10px] mt-1">{t.type}</Badge></div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setTEditing(t); setTCreating(true); setTName(t.name); setTType(t.type); setTSubject(t.subject); setTBody(t.body); }}><Pencil className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setEmailTemplates((prev) => prev.filter((x) => x.id !== t.id)); toast.success("Template deleted"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="team">
                <Card>
                    <CardHeader><div className="flex items-center justify-between"><CardTitle>Team Members</CardTitle><Dialog open={inviteOpen} onOpenChange={setInviteOpen}><DialogTrigger asChild><Button size="sm"><UserPlus className="h-3 w-3 mr-1" /> Invite</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label>Email</Label><Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@company.com" /></div><div className="space-y-2"><Label>Role</Label><Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamMember["role"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="HR Manager">HR Manager</SelectItem><SelectItem value="Recruiter">Recruiter</SelectItem><SelectItem value="Interviewer">Interviewer</SelectItem></SelectContent></Select></div><Button className="w-full" onClick={inviteMember}>Send Invitation</Button></div></DialogContent></Dialog></div></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-border text-xs text-muted-foreground"><th className="px-4 py-2 text-left">Member</th><th className="px-4 py-2 text-left">Role</th><th className="px-4 py-2 text-left">Department</th><th className="px-4 py-2 text-left">Joined</th><th className="px-4 py-2 text-left">Actions</th></tr></thead>
                                <tbody>{teamMembers.map((m) => (<tr key={m.id} className="border-b border-border last:border-0"><td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar><div><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div></div></td><td className="px-4 py-3"><Badge variant="outline">{m.role}</Badge></td><td className="px-4 py-3 text-muted-foreground">{m.department}</td><td className="px-4 py-3 text-muted-foreground">{m.joinedAt}</td><td className="px-4 py-3"><Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => removeMember(m.id)}>Remove</Button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="pipeline">
                <Card>
                    <CardHeader><CardTitle>Pipeline Stages</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {pipelineStages.map((stage, index) => (
                            <div key={stage.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
                                <span className="flex-1 text-sm font-medium">{stage.label}</span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveStage(index, -1)} disabled={index === 0}><ArrowUp className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveStage(index, 1)} disabled={index === pipelineStages.length - 1}><ArrowDown className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeStage(stage.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-2 pt-2"><Input placeholder="New stage name" value={newStageLabel} onChange={(e) => setNewStageLabel(e.target.value)} /><Button onClick={addStage} disabled={!newStageLabel.trim()}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
