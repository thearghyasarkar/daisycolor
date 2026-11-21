"use client";

import { Plus } from "lucide-react";

type Props = {
  color: string;
  onChange: (color: string) => void;
  onSave: () => void;
};

export function ColourPicker({ color, onChange, onSave }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#e6ddcd] bg-paper/80 py-1 pl-1 pr-1.5">
      <label className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#d8ccb8] bg-white">
        <span
          className="pointer-events-none absolute inset-[3px] rounded-full"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Pick any colour"
        />
      </label>
      <span className="hidden font-mono text-[10px] uppercase tracking-wide text-muted sm:inline">
        {color}
      </span>
      <button
        type="button"
        onClick={onSave}
        className="flex h-7 w-7 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-[#f3ecdd] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        aria-label="Keep this colour in my palette"
        title="Keep this colour"
      >
        <Plus size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}
