import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Applicant } from "@/types";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const statuses: { value: Applicant["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
];

export function StatusDropdown({ applicantId, currentStatus }: { applicantId: string; currentStatus: Applicant["status"] }) {
  const { updateApplicantStatus } = useApp();
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string) => {
    setLoading(true);
    setTimeout(() => {
      updateApplicantStatus(applicantId, value as Applicant["status"]);
      setLoading(false);
    }, 500);
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s.value} value={s.value} className="text-xs">
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
