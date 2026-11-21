"use client";

import { ArrowRight, Flower2 } from "lucide-react";
import { useGame } from "@/lib/game-context";

function HeroFlower() {
  return (
    <svg viewBox="0 0 220 240" className="h-[210px] w-[200px] sm:h-[250px] sm:w-[235px]" aria-hidden="true">
      <path d="M 110 108 C 108 150 110 190 112 232" fill="none" stroke="#7e9072" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 110 168 C 88 148 62 154 54 174 C 76 187 99 185 110 168 Z" fill="#cad9bd" stroke="#7e9072" strokeWidth="2" />
      <path d="M 111 190 C 134 169 159 176 166 195 C 144 208 122 205 111 190 Z" fill="#dbe5c9" stroke="#7e9072" strokeWidth="2" />
      <g className="animate-float" style={{ transformOrigin: "110px 86px" }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <ellipse
            key={index}
            cx={110}
            cy={48}
            rx={21}
            ry={38}
            fill={index % 2 === 0 ? "#e9c0be" : "#d9c5e0"}
            stroke="#6f635c"
            strokeWidth="1.8"
            transform={`rotate(${index * (360 / 7)} 110 86)`}
          />
        ))}
        <circle cx={110} cy={86} r={23} fill="#f1d89f" stroke="#6f635c" strokeWidth="2" />
        <circle cx={102} cy={80} r={2} fill="#b69a63" />
        <circle cx={118} cy={89} r={2} fill="#b69a63" />
        <circle cx={108} cy={94} r={2} fill="#b69a63" />
      </g>
    </svg>
  );
}

export function HomeScreen() {
  const { navigate } = useGame();

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[12, 30, 52, 74, 88].map((left, index) => (
          <span
            key={left}
            className="absolute top-[-20px] h-3 w-2 rounded-[70%_30%_65%_35%] bg-[#e8c8c5]/70 animate-petal"
            style={{ left: `${left}%`, animationDelay: `${index * 1.9}s`, animationDuration: `${8 + index}s` }}
          />
        ))}
        <span className="absolute -left-16 top-1/3 h-52 w-52 rounded-full bg-[#e9e1cf]/35 blur-2xl" />
        <span className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-[#dbe6d4]/35 blur-2xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <div className="mb-2 flex items-center gap-2 text-sage-deep">
          <Flower2 size={14} strokeWidth={1.6} />
          <span className="hand-ink text-[13px] normal-case tracking-normal">for daisy · a little world of her own</span>
        </div>

        <div className="relative mt-1 w-[226px] sm:w-[260px]">
          <span className="washi-tape -left-5 -top-2 rotate-[-18deg]" aria-hidden="true" />
          <span className="washi-tape -right-6 top-8 rotate-[16deg]" aria-hidden="true" />
          <div className="sketch-border relative rotate-[-2deg] bg-paper/80 px-3 pb-6 pt-4 shadow-card">
            <HeroFlower />
            <span className="marginalia absolute -bottom-1 left-6 rotate-[-4deg]">breathe beautiful.</span>
          </div>
          <span className="absolute -right-7 top-4 flex h-11 w-11 rotate-12 items-center justify-center rounded-full border border-dashed border-[#9a7f68]/50 bg-[#f6ead6]/80 font-serif text-[12px] text-[#9a7f68]">
            1:11
          </span>
        </div>

        <h1 className="mt-4 font-serif text-[38px] leading-[1.1] text-ink sm:text-[54px]">
          come in, butterfly.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
          Daisy&apos;s own little world to colour, whenever you need a moment of peace.
        </p>
        <p className="marginalia mt-2 max-w-md rotate-[-1deg]">the calm, the silence.</p>

        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("book")}
            className="sketch-button group flex w-full items-center justify-center gap-2 bg-[#899c7d] px-7 py-3.5 text-[14px] font-medium text-paper transition-all duration-300 hover:bg-[#778b6d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep sm:w-auto"
          >
            Let&apos;s colour
            <ArrowRight size={15} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate("garden")}
            className="sketch-button w-full border border-[#dcd2bf] bg-paper/60 px-7 py-3.5 text-[14px] text-ink/80 transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep sm:w-auto"
          >
            Visit Daisy&apos;s garden
          </button>
        </div>

        <p className="mt-10 max-w-sm font-serif text-[13px] italic leading-relaxed text-muted/90">
          For you to colour, whenever the world feels a little too loud.
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-muted/70">
          made for buttercup, by nolan
        </p>
      </div>
    </main>
  );
}
