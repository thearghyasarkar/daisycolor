"use client";

import { useEffect, type ReactNode } from "react";
import { Flower2, Music2, Volume2, X } from "lucide-react";
import type { Preferences } from "@/lib/types";

type Props = {
  preferences: Preferences;
  onChange: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  onClose: () => void;
};

function Toggle({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ebe3d5] bg-paper px-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1ecdf] text-sage-deep">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-serif text-[15px] text-ink">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-snug text-muted">{description}</span>
      </span>
      <span className="relative mt-1 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full border border-[#d8ccb8] bg-[#eee8dc] transition-colors peer-checked:bg-[#b9c9ab] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sage-deep" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-paper shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function Settings({ preferences, onChange, onClose }: Props) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#4a4139]/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Daisy's little world settings"
        className="w-full max-w-md rounded-t-[28px] border border-[#e6ddcd] bg-cream p-5 pb-8 shadow-card animate-fadeUp sm:rounded-[28px] sm:pb-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-ink">A few little things</h2>
            <p className="mt-0.5 text-xs text-muted">Make this space feel like yours.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-[#f0e9dc] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            aria-label="Close settings"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>
        <div className="space-y-2.5">
          <Toggle
            checked={preferences.sound}
            onChange={(value) => onChange("sound", value)}
            label="Soft hush"
            description="A gentle, generated hush. It never plays unless you turn it on."
            icon={<Volume2 size={17} strokeWidth={1.7} />}
          />
          <Toggle
            checked={preferences.music}
            onChange={(value) => onChange("music", value)}
            label="Little music"
            description="A very quiet tune, made just for this page. It begins after your first tap."
            icon={<Music2 size={17} strokeWidth={1.7} />}
          />
          <Toggle
            checked={preferences.motion}
            onChange={(value) => onChange("motion", value)}
            label="Gentle motion"
            description="Slow, quiet animations. Turn off whenever you prefer stillness."
            icon={<Flower2 size={17} strokeWidth={1.7} />}
          />
        </div>
        <p className="mt-4 text-center font-serif text-[13px] italic text-muted">
          Nothing here needs your attention right now.
        </p>
      </div>
    </div>
  );
}
