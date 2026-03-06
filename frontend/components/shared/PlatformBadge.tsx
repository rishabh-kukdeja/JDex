import { cn } from "@/lib/utils";

const platformColors: Record<string, string> = {
  LinkedIn: "bg-blue-600",
  Naukri: "bg-blue-500",
  Indeed: "bg-violet-600",
  WorkIndia: "bg-orange-500",
  Internshala: "bg-sky-500",
  Direct: "bg-muted-foreground",
};

export function PlatformBadge({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[11px]";
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded font-bold text-white", sizeClasses, platformColors[name] || "bg-muted-foreground")}
      title={name}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function PlatformBadgeWithLabel({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <PlatformBadge name={name} />
      <span className="text-sm">{name}</span>
    </div>
  );
}
