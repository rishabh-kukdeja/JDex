import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export function ATSScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const color = score >= 75 ? "hsl(160, 84%, 39%)" : score >= 50 ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)";
  const data = [{ value: score, fill: color }];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="75%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={8}
        >
          <RadialBar dataKey="value" background={{ fill: "hsl(var(--muted))" }} cornerRadius={4} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-2xl font-bold", score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive")}>
          {score}
        </span>
      </div>
    </div>
  );
}

export function ATSScoreBadge({ score }: { score: number }) {
  const className = score >= 75
    ? "bg-success/10 text-success"
    : score >= 50
    ? "bg-warning/10 text-warning"
    : "bg-destructive/10 text-destructive";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", className)}>
      {score}
    </span>
  );
}
