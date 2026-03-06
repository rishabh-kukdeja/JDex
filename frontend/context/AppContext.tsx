"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { JobDescription, Applicant, Interview, Platform, EmailTemplate, TeamMember, PipelineStage } from "@/types";
import {
  jobDescriptions as initialJobs,
  applicants as initialApplicants,
  interviews as initialInterviews,
  platforms as initialPlatforms,
  emailTemplates as initialTemplates,
  teamMembers as initialTeam,
  pipelineStages as initialStages,
} from "@/lib/data";
import { toast } from "sonner";

interface AppContextType {
  jobs: JobDescription[];
  setJobs: React.Dispatch<React.SetStateAction<JobDescription[]>>;
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  platforms: Platform[];
  setPlatforms: React.Dispatch<React.SetStateAction<Platform[]>>;
  emailTemplates: EmailTemplate[];
  setEmailTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  pipelineStages: PipelineStage[];
  setPipelineStages: React.Dispatch<React.SetStateAction<PipelineStage[]>>;
  updateApplicantStatus: (id: string, status: Applicant["status"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobDescription[]>(initialJobs);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(initialStages);

  const updateApplicantStatus = useCallback((id: string, status: Applicant["status"]) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
            ...a,
            status,
            activityLog: [
              ...a.activityLog,
              {
                action: `Status changed to ${status.replace("_", " ")}`,
                date: new Date().toISOString().split("T")[0],
                by: "Vikram Singh",
              },
            ],
          }
          : a
      )
    );
    const label = status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
    toast.success(`Status updated to ${label}`);
  }, []);

  return (
    <AppContext.Provider
      value={{
        jobs, setJobs, applicants, setApplicants, interviews, setInterviews,
        platforms, setPlatforms, emailTemplates, setEmailTemplates,
        teamMembers, setTeamMembers, pipelineStages, setPipelineStages,
        updateApplicantStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
