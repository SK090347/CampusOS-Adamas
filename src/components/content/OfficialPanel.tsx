"use client";

import { useState } from "react";
import { ExternalLink, PanelRightOpen } from "lucide-react";
import { SourceBadge } from "@/components/ui/SourceBadge";

const ALLOWLIST = [
  "https://adamasuniversity.ac.in",
  "https://scholar.google.com",
  "https://doaj.org",
  "https://arxiv.org",
  "https://www.india.gov.in",
];

function isAllowlisted(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return ALLOWLIST.some((a) => url.startsWith(a));
  } catch {
    return false;
  }
}

type Props = {
  title: string;
  summary?: string | null;
  url: string;
  sourceType?: string | null;
  sourceTitle?: string | null;
  sourceURL?: string | null;
  confidence?: number | null;
  status?: string | null;
  provider?: string | null;
};

/** In-app first panel: summary + optional allowlisted HTTPS embed; official link secondary. */
export function OfficialPanel({
  title,
  summary,
  url,
  sourceType,
  sourceTitle,
  sourceURL,
  confidence,
  status,
  provider,
}: Props) {
  const [showEmbed, setShowEmbed] = useState(false);
  const canEmbed = isAllowlisted(url);

  return (
    <article className="card overflow-hidden">
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold text-ink-950">{title}</h3>
            {provider && <p className="text-xs text-ink-500">{provider}</p>}
          </div>
          <SourceBadge
            sourceType={sourceType}
            sourceTitle={sourceTitle}
            sourceURL={sourceURL || url}
            confidence={confidence}
            status={status}
            compact
          />
        </div>
        {summary && <p className="text-sm leading-relaxed text-ink-600">{summary}</p>}
        <div className="flex flex-wrap gap-2">
          {canEmbed && (
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => setShowEmbed((v) => !v)}
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
              {showEmbed ? "Hide in-app view" : "Open in-app view"}
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Official source
          </a>
        </div>
        {!canEmbed && (
          <p className="text-[11px] text-ink-400">
            This URL is not on the in-app allowlist — use the official source link. CampusOS does not bypass logins.
          </p>
        )}
      </div>
      {showEmbed && canEmbed && (
        <div className="border-t border-ink-100 bg-ink-50/40">
          <iframe
            title={title}
            src={url}
            className="h-[420px] w-full"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
          <p className="px-4 py-2 text-[10px] text-ink-400">
            Embedded official page (allowlisted HTTPS). Content owned by the source site.
          </p>
        </div>
      )}
    </article>
  );
}
