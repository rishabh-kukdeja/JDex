"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { X, Send, Eye, Plus, Pencil, Trash2, Mail } from "lucide-react";
import type { EmailTemplate } from "@/types";

export default function EmailCenterPage() {
    const { emailTemplates, setEmailTemplates, applicants } = useApp();

    const [recipients, setRecipients] = useState<string[]>([]);
    const [recipientInput, setRecipientInput] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [preview, setPreview] = useState(false);
    const [sending, setSending] = useState(false);

    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [creating, setCreating] = useState(false);
    const [tName, setTName] = useState("");
    const [tType, setTType] = useState<EmailTemplate["type"]>("custom");
    const [tSubject, setTSubject] = useState("");
    const [tBody, setTBody] = useState("");

    const handleTemplateSelect = (templateId: string) => {
        const template = emailTemplates.find((t) => t.id === templateId);
        if (template) { setSelectedTemplate(templateId); setSubject(template.subject); setBody(template.body); }
    };

    const addRecipient = (email: string) => {
        if (email.trim() && !recipients.includes(email.trim())) { setRecipients([...recipients, email.trim()]); setRecipientInput(""); }
    };

    const handleSend = () => {
        if (recipients.length === 0) return;
        setSending(true);
        setTimeout(() => { setSending(false); toast.success(`Emails sent successfully to ${recipients.length} recipient${recipients.length > 1 ? "s" : ""}`); setRecipients([]); setSubject(""); setBody(""); setSelectedTemplate(""); }, 1000);
    };

    const previewBody = body.replace(/\{\{candidate_name\}\}/g, "John Doe").replace(/\{\{job_title\}\}/g, "Senior Frontend Developer").replace(/\{\{company_name\}\}/g, "JDex").replace(/\{\{interview_date\}\}/g, "March 5, 2026 at 10:00 AM").replace(/\{\{interview_link\}\}/g, "https://meet.google.com/example");

    const saveTemplate = () => {
        if (editingTemplate) { setEmailTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? { ...t, name: tName, type: tType, subject: tSubject, body: tBody } : t))); toast.success("Template updated"); }
        else { setEmailTemplates((prev) => [...prev, { id: `et${Date.now()}`, name: tName, type: tType, subject: tSubject, body: tBody }]); toast.success("Template created"); }
        setEditingTemplate(null); setCreating(false); setTName(""); setTSubject(""); setTBody(""); setTType("custom");
    };

    const startEdit = (template: EmailTemplate) => { setEditingTemplate(template); setCreating(true); setTName(template.name); setTType(template.type); setTSubject(template.subject); setTBody(template.body); };
    const deleteTemplate = (id: string) => { setEmailTemplates((prev) => prev.filter((t) => t.id !== id)); toast.success("Template deleted"); };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-4 w-4" /> Compose Email</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>To</Label>
                        <div className="flex flex-wrap gap-1 p-2 border border-border rounded-md min-h-[40px]">
                            {recipients.map((r, i) => (<Badge key={i} variant="secondary" className="gap-1">{r} <X className="h-3 w-3 cursor-pointer" onClick={() => setRecipients(recipients.filter((_, idx) => idx !== i))} /></Badge>))}
                            <input className="flex-1 min-w-[120px] text-sm outline-none bg-transparent" placeholder="Type email and press Enter" value={recipientInput} onChange={(e) => setRecipientInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRecipient(recipientInput); } }} />
                        </div>
                        <div className="flex flex-wrap gap-1">{applicants.slice(0, 5).map((a) => (<Button key={a.id} variant="ghost" size="sm" className="text-xs h-6" onClick={() => addRecipient(a.email)}>+ {a.name}</Button>))}</div>
                    </div>
                    <div className="space-y-2"><Label>Template</Label><Select value={selectedTemplate} onValueChange={handleTemplateSelect}><SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger><SelectContent>{emailTemplates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between"><Label>Body</Label><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Preview</span><Switch checked={preview} onCheckedChange={setPreview} /></div></div>
                        {preview ? (<div className="rounded-md border border-border p-4 text-sm whitespace-pre-wrap bg-muted/50 min-h-[200px]">{previewBody}</div>) : (<Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />)}
                    </div>
                    <Button className="w-full" onClick={handleSend} disabled={sending || recipients.length === 0}>{sending ? "Sending..." : `Send to ${recipients.length} Recipient${recipients.length !== 1 ? "s" : ""}`}</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4" /> Templates</CardTitle><Button size="sm" onClick={() => { setCreating(true); setEditingTemplate(null); setTName(""); setTSubject(""); setTBody(""); setTType("custom"); }}><Plus className="h-3 w-3 mr-1" /> New</Button></div></CardHeader>
                <CardContent className="space-y-3">
                    {creating && (
                        <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/50">
                            <Input placeholder="Template name" value={tName} onChange={(e) => setTName(e.target.value)} />
                            <Select value={tType} onValueChange={(v) => setTType(v as EmailTemplate["type"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="shortlist">Shortlist</SelectItem><SelectItem value="reject">Reject</SelectItem><SelectItem value="interview">Interview</SelectItem><SelectItem value="offer">Offer</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select>
                            <Input placeholder="Subject" value={tSubject} onChange={(e) => setTSubject(e.target.value)} />
                            <Textarea placeholder="Body (use {{candidate_name}}, {{job_title}}, etc.)" value={tBody} onChange={(e) => setTBody(e.target.value)} rows={4} />
                            <div className="flex gap-2"><Button size="sm" onClick={saveTemplate}>Save</Button><Button size="sm" variant="outline" onClick={() => { setCreating(false); setEditingTemplate(null); }}>Cancel</Button></div>
                        </div>
                    )}
                    {emailTemplates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div><p className="text-sm font-medium">{template.name}</p><Badge variant="outline" className="text-[10px] mt-1">{template.type}</Badge></div>
                            <div className="flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(template)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteTemplate(template.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
