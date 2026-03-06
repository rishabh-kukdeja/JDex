import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-info/10 text-info border-info/20" },
  shortlisted: { label: "Shortlisted", className: "bg-primary/10 text-primary border-primary/20" },
  interview_scheduled: { label: "Interview", className: "bg-warning/10 text-warning border-warning/20" },
  selected: { label: "Selected", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  on_hold: { label: "On Hold", className: "bg-muted text-muted-foreground border-border" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  published: { label: "Published", className: "bg-success/10 text-success border-success/20" },
  closed: { label: "Closed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  scheduled: { label: "Scheduled", className: "bg-info/10 text-info border-info/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  rescheduled: { label: "Rescheduled", className: "bg-warning/10 text-warning border-warning/20" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}
