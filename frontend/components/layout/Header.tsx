"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobs": "Job Descriptions",
  "/jobs/create": "Create Job Description",
  "/applicants": "Applicants",
  "/interviews": "Interviews",
  "/email": "Email Center",
  "/settings": "Settings",
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.match(/^\/jobs\/[^/]+\/edit$/)) return "Edit Job Description";
    if (pathname.match(/^\/applicants\/[^/]+$/)) return "Applicant Details";
    return pageTitles[pathname] || "JDex";
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-lg font-semibold">{getTitle()}</h1>

      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
            3
          </Badge>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">VS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
