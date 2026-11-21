"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  motionEnabled: boolean;
  onClose: () => void;
};

export function BreathingFlower({ motionEnabled, onClose }: Props) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    const update = () => {
      const elapsed = (Date.now() - startedAt) % 10000;
      setPhase(elapsed < 4000 ? "in" : "out");
    };
    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="absolute right-3 top-3 z-20 w-[190px] rounded-[22px] border border-[#e6ddcd] bg-paper/95 p-3 text-center shadow-card animate-fadeUp sm:right-5 sm:top-5">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-[#f2ecdf] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        aria-label="Close breathing flower"
      >
        <X size={13} strokeWidth={1.8} />
      </button>
      <div className="mx-auto h-[92px] w-[92px]">
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
          <path d="M 60 76 C 60 95 60 103 60 114" fill="none" stroke="#8fa383" strokeWidth="2" strokeLinecap="round" />
          <path d="M 60 99 C 48 92 42 96 40 103 C 49 107 56 105 60 99 Z" fill="#cddcbf" stroke="#6d7f63" strokeWidth="1.4" />
          <path d="M 60 105 C 72 98 78 102 80 109 C 71 113 64 111 60 105 Z" fill="#cddcbf" stroke="#6d7f63" strokeWidth="1.4" />
          <g
            className={motionEnabled ? "animate-breathe" : ""}
            style={{ transformOrigin: "60px 52px" }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <ellipse
                key={index}
                cx={60}
                cy={28}
                rx={11}
                ry={22}
                fill={index % 2 === 0 ? "#e8c3c2" : "#d6c4e0"}
                stroke="#7c6f68"
                strokeWidth="1.2"
                transform={`rotate(${index * 45} 60 52)`}
              />
            ))}
            <circle cx={60} cy={52} r={12} fill="#f0d6a2" stroke="#7c6f68" strokeWidth="1.4" />
          </g>
        </svg>
      </div>
      <p className="font-serif text-[17px] text-ink">{phase === "in" ? "Breathe in…" : "Breathe out…"}</p>
      <p className="mt-0.5 font-serif text-[11px] italic text-sage-deep">breathe beautiful.</p>
      <p className="mt-0.5 text-[10px] leading-tight text-muted">No need to do it perfectly.</p>
    </div>
  );
}
