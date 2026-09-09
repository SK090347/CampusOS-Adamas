import { Badge } from "./Badge";
import { formatSourceType, isSecondary } from "@/lib/utils";

type Props = {
  sourceType?: string | null;
  sourceTitle?: string | null;
  sourceURL?: string | null;
  confidence?: number | null;
  status?: string | null;
  compact?: boolean;
};

export function SourceBadge({
  sourceType,
  sourceTitle,
  sourceURL,
  confidence,
  status,
  compact,
}: Props) {
  const secondary = isSecondary(sourceType);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={secondary ? "amber" : "green"}>
        {formatSourceType(sourceType || "OFFICIAL")}
      </Badge>
      {status === "CONFLICT" && <Badge tone="red">Conflict</Badge>}
      {status === "UNVERIFIED" && <Badge tone="amber">Unverified</Badge>}
      {!compact && confidence != null && (
        <span className="text-[11px] text-ink-400">
          Confidence {(confidence * 100).toFixed(0)}%
        </span>
      )}
      {!compact && sourceTitle && (
        sourceURL ? (
          <a
            href={sourceURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-campus-700 underline-offset-2 hover:underline"
          >
            {sourceTitle}
          </a>
        ) : (
          <span className="text-[11px] text-ink-400">{sourceTitle}</span>
        )
      )}
      {secondary && !compact && (
        <span className="w-full text-[11px] text-amber-700">
          Secondary source — not presented as official university policy.
        </span>
      )}
    </div>
  );
}

export function DiscrepancyAlert({ sources }: { sources: string[] }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">Information discrepancy detected</p>
      <p className="mt-1 text-amber-800">
        Sources disagree. Review each claim carefully:
      </p>
      <ul className="mt-2 list-inside list-disc text-amber-900">
        {sources.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
