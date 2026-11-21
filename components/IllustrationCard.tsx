"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { IllustrationArt } from "./IllustrationArt";
import { previewColor } from "@/lib/illustrations";
import type { Illustration, Snapshot } from "@/lib/types";

type Props = {
  illustration: Illustration;
  snapshot: Snapshot | null;
  index: number;
  onOpen: () => void;
};

export function IllustrationCard({ illustration, snapshot, index, onOpen }: Props) {
  const suggested = Object.fromEntries(
    illustration.regions.map((region) => [region.id, previewColor(region)]),
  );
  const colors = { ...suggested, ...(snapshot?.colors ?? {}) };
  const tilt = [-1.2, 0.8, -0.6, 1.3][index % 4];

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ "--card-tilt": `${tilt}deg` } as React.CSSProperties}
      className="book-card group relative flex flex-col overflow-hidden rounded-[18px_24px_20px_22px] border border-[#e6ddcd] bg-paper text-left shadow-card transition-all duration-300 hover:border-[#cdbd9f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
      aria-label={`Open ${illustration.title}`}
    >
      <span className="washi-tape -left-3 -top-2 z-10 rotate-[-9deg]" aria-hidden="true" />
      <span className="page-number absolute bottom-1 right-3 z-10">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative aspect-square w-full overflow-hidden bg-[#faf4e8]">
        <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
          <IllustrationArt illustration={illustration} colors={colors} showDetails />
        </svg>
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-paper/85 text-ink/60 opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight size={15} strokeWidth={1.8} />
        </span>
      </div>
      <div className="flex items-start justify-between gap-2 px-4 pb-4 pt-3">
        <div>
          <h3 className="font-serif text-[17px] leading-tight text-ink">{illustration.title}</h3>
          <p className="mt-1 text-[12px] italic leading-snug text-muted">{illustration.subtitle}</p>
        </div>
        {snapshot && (
          <span className="mt-1 flex shrink-0 items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-sage-deep">
            <Sparkles size={11} strokeWidth={1.8} />
            <span className="hidden sm:inline">yours</span>
          </span>
        )}
      </div>
    </button>
  );
}
