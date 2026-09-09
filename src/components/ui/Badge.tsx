import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "amber" | "green" | "red" | "violet" | "gold";
  className?: string;
}) {
  const tones = {
    neutral: "bg-ink-100 text-ink-700",
    blue: "bg-campus-50 text-campus-900",
    amber: "bg-amber-50 text-amber-900",
    green: "bg-emerald-50 text-emerald-900",
    red: "bg-red-50 text-red-900",
    violet: "bg-violet-50 text-violet-900",
    gold: "bg-campus-100 text-campus-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
