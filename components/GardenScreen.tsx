"use client";

import {
  ArrowLeft,
  Bird,
  Droplet,
  Flower2,
  Lamp,
  Sparkles,
  Sprout,
} from "lucide-react";
import { IllustrationArt } from "./IllustrationArt";
import { ILLUSTRATIONS } from "@/lib/illustrations";
import { useGame } from "@/lib/game-context";
import type { DecorationKind, Illustration, Snapshot } from "@/lib/types";

const ATMOSPHERES = [
  { id: "morning", label: "Morning", sky: "#eaf1ef", hill: "#d4e2ce", ground: "#e2ead7", light: "#f6e6bd" },
  { id: "golden", label: "Golden hour", sky: "#f8e9d2", hill: "#ded0aa", ground: "#eee0bd", light: "#f4cf9c" },
  { id: "twilight", label: "Twilight", sky: "#dcdbe9", hill: "#c3c8c6", ground: "#d3d6cc", light: "#eee0e7" },
] as const;

const DECORATION_INFO: { id: DecorationKind; label: string; icon: typeof Lamp }[] = [
  { id: "lantern", label: "lantern", icon: Lamp },
  { id: "mushroom", label: "mushroom", icon: Sprout },
  { id: "bird", label: "bird", icon: Bird },
  { id: "wateringCan", label: "watering can", icon: Droplet },
];

const DECORATION_POSITIONS: Record<DecorationKind, { x: number; y: number }[]> = {
  lantern: [
    { x: 88, y: 300 },
    { x: 408, y: 322 },
    { x: 730, y: 306 },
  ],
  mushroom: [
    { x: 148, y: 402 },
    { x: 512, y: 412 },
    { x: 58, y: 426 },
  ],
  bird: [
    { x: 186, y: 112 },
    { x: 520, y: 86 },
    { x: 704, y: 150 },
  ],
  wateringCan: [
    { x: 256, y: 398 },
    { x: 628, y: 408 },
    { x: 372, y: 416 },
  ],
};

function DecorationShape({ kind }: { kind: DecorationKind }) {
  switch (kind) {
    case "lantern":
      return (
        <g>
          <path d="M -10 -8 L 10 -8 L 7 20 L -7 20 Z" fill="#f7e4b5" stroke="#6f6358" strokeWidth="2" />
          <path d="M -12 -8 L 12 -8 M -8 -18 Q 0 -26 8 -18" fill="none" stroke="#6f6358" strokeWidth="2" strokeLinecap="round" />
          <circle cx={0} cy={6} r={5} fill="#f0c978" />
        </g>
      );
    case "mushroom":
      return (
        <g>
          <path d="M -6 0 L -6 15 Q 0 19 6 15 L 6 0 Z" fill="#f7f0df" stroke="#6f6358" strokeWidth="2" />
          <path d="M -16 2 Q -14 -16 0 -16 Q 14 -16 16 2 Z" fill="#dca9a3" stroke="#6f6358" strokeWidth="2" />
          <circle cx={-6} cy={-6} r={2} fill="#fff6e6" />
          <circle cx={5} cy={-9} r={2} fill="#fff6e6" />
        </g>
      );
    case "bird":
      return (
        <g>
          <path d="M -14 2 Q -4 -12 8 -2 Q 16 -10 22 0 Q 10 8 -2 6 Q -9 10 -14 2 Z" fill="#f7f1e5" stroke="#6f6358" strokeWidth="2" />
          <circle cx={-11} cy={0} r={1.5} fill="#6f6358" />
        </g>
      );
    case "wateringCan":
      return (
        <g>
          <path d="M -14 -4 L 10 -4 L 8 16 L -12 16 Z" fill="#b8ccc2" stroke="#6f6358" strokeWidth="2" />
          <path d="M -12 -4 Q -18 -16 -2 -14 Q 8 -14 10 -4" fill="none" stroke="#6f6358" strokeWidth="2" />
          <path d="M 10 0 L 26 -10 L 30 -4 L 14 8 Z" fill="#b8ccc2" stroke="#6f6358" strokeWidth="2" />
        </g>
      );
  }
}

function ArtworkFrame({
  illustration,
  snapshot,
  onOpen,
}: {
  illustration: Illustration;
  snapshot: Snapshot;
  onOpen: () => void;
}) {
  const suggested = Object.fromEntries(illustration.regions.map((region) => [region.id, region.fill]));
  const colors = { ...suggested, ...snapshot.colors };
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group overflow-hidden rounded-[12px] border border-[#ddd2bd] bg-paper p-1 shadow-soft transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
      aria-label={`Reopen ${illustration.title}`}
      title={illustration.title}
    >
      <svg viewBox="0 0 400 400" className="aspect-square w-full rounded-[7px] bg-[#fbf7ee]" aria-hidden="true">
        <IllustrationArt illustration={illustration} colors={colors} strokes={snapshot.strokes} />
      </svg>
      <span className="block truncate px-0.5 pb-0.5 pt-1 text-center text-[9px] text-muted">{illustration.title}</span>
    </button>
  );
}

export function GardenScreen() {
  const { state, getSnapshot, hasArtwork, openIllustration, goBack, setAtmosphere, toggleDecoration, moveDecoration } = useGame();
  const atmosphere = ATMOSPHERES.find((item) => item.id === state.garden.atmosphere) ?? ATMOSPHERES[0];
  const artworks = ILLUSTRATIONS.filter((illustration) => hasArtwork(illustration.id));
  const slots = 6;

  return (
    <main className="min-h-[100dvh] px-4 pb-12 pt-5 sm:px-8 sm:pt-7">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e2d9c9] bg-paper/70 text-ink/70 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            aria-label="Back"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
          </button>
          <div>
            <h1 className="font-serif text-[27px] leading-tight text-ink sm:text-[32px]">Daisy&apos;s little garden</h1>
            <p className="mt-0.5 text-[12px] text-muted">Everything here grew at its own pace, buttercup.</p>
            <p className="marginalia mt-1 rotate-[-1deg]">somewhere soft to land</p>
          </div>
        </header>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-full border border-[#e3dac9] bg-paper/70 p-1">
            {ATMOSPHERES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAtmosphere(item.id)}
                aria-pressed={state.garden.atmosphere === item.id}
                className={`rounded-full px-3 py-1.5 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
                  state.garden.atmosphere === item.id
                    ? "bg-[#e7ebdd] text-[#566648]"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="font-serif text-[12px] italic text-muted">
            {artworks.length ? "Some of your colours found a home with you." : "A quiet place, waiting for its first daisy."}
          </p>
        </div>

        <section className="sketch-border relative h-[440px] overflow-hidden border border-[#dfd6c4] bg-paper shadow-card sm:h-[500px]" aria-label="Daisy's garden scene">
          <span className="washi-tape -left-3 -top-2 z-10 rotate-[-10deg]" aria-hidden="true" />
          <span className="washi-tape -right-3 top-10 z-10 rotate-[14deg]" aria-hidden="true" />
          <svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x={0} y={0} width={800} height={460} fill={atmosphere.sky} />
            <circle cx={662} cy={82} r={38} fill={atmosphere.light} opacity={0.85} />
            <path d="M 96 92 C 82 92 78 76 92 72 C 98 58 119 57 126 70 C 137 64 152 73 150 86 C 160 88 158 100 146 100 L 100 100 Z" fill="#fffdf7" opacity={0.75} />
            <path d="M 382 62 C 372 62 370 50 380 48 C 386 38 401 38 406 48 C 416 44 427 52 424 62 Z" fill="#fffdf7" opacity={0.6} />
            <path d="M 0 280 Q 160 226 320 278 Q 500 334 800 260 L 800 460 L 0 460 Z" fill={atmosphere.hill} />
            <path d="M 0 344 Q 190 306 380 348 Q 580 392 800 336 L 800 460 L 0 460 Z" fill={atmosphere.ground} />
            <rect x={40} y={264} width={720} height={8} rx={4} fill="#efe6d4" stroke="#8c8273" strokeWidth={1.5} />
            <rect x={40} y={310} width={720} height={8} rx={4} fill="#efe6d4" stroke="#8c8273" strokeWidth={1.5} />
            {[60, 170, 280, 390, 500, 610, 720].map((x) => (
              <rect key={x} x={x} y={256} width={10} height={72} rx={3} fill="#f2ead9" stroke="#8c8273" strokeWidth={1.5} />
            ))}
            <rect x={702} y={190} width={16} height={132} rx={6} fill="#b7a68f" stroke="#75695d" strokeWidth={2} />
            <circle cx={710} cy={172} r={46} fill="#b9cbb0" stroke="#7e9072" strokeWidth={2} />
            <circle cx={674} cy={196} r={34} fill="#cad9bd" stroke="#7e9072" strokeWidth={2} />
            <circle cx={744} cy={200} r={33} fill="#cad9bd" stroke="#7e9072" strokeWidth={2} />
            {[100, 230, 350, 470, 590].map((x, index) => (
              <g key={x} transform={`translate(${x} ${400 + (index % 2) * 8})`}>
                <path d="M 0 0 L 0 12" stroke="#7e9072" strokeWidth={2} />
                {[0, 72, 144, 216, 288].map((angle) => (
                  <ellipse key={angle} cx={0} cy={-7} rx={4} ry={8} fill={index % 2 ? "#e7c5c2" : "#d9c5e0"} stroke="#7e7168" strokeWidth={1} transform={`rotate(${angle})`} />
                ))}
                <circle cx={0} cy={-7} r={3.5} fill="#f1d89f" />
              </g>
            ))}
            {state.garden.decorations.map((kind) => {
              const position = DECORATION_POSITIONS[kind][state.garden.positions[kind] ?? 0];
              return (
                <g
                  key={kind}
                  transform={`translate(${position.x} ${position.y})`}
                  onClick={() => moveDecoration(kind)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      moveDecoration(kind);
                    }
                  }}
                  tabIndex={0}
                  className="cursor-pointer outline-none focus-visible:opacity-70"
                  role="button"
                  aria-label={`Move the ${kind}`}
                >
                  <DecorationShape kind={kind} />
                </g>
              );
            })}
          </svg>

          <div className="absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-5">
            {artworks.length === 0 && (
              <div className="mx-auto mb-3 max-w-xs rounded-2xl bg-paper/85 px-4 py-2.5 text-center shadow-soft backdrop-blur-[1px]">
                <p className="font-serif text-[13px] italic text-ink/80">Daisy&apos;s garden is beautiful even when it&apos;s quiet.</p>
                <p className="mt-0.5 text-[11px] text-muted">Coloured pages will find a home here.</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
              {Array.from({ length: slots }).map((_, index) => {
                const illustration = artworks[index];
                const snapshot = illustration ? getSnapshot(illustration.id) : null;
                if (illustration && snapshot) {
                  return (
                    <ArtworkFrame
                      key={illustration.id}
                      illustration={illustration}
                      snapshot={snapshot}
                      onOpen={() => openIllustration(illustration.id)}
                    />
                  );
                }
                return (
                  <div
                    key={`empty-${index}`}
                    className="flex aspect-square flex-col items-center justify-center rounded-[12px] border border-dashed border-[#cfc4b2] bg-paper/45 text-[#b8ab98]"
                  >
                    <Flower2 size={16} strokeWidth={1.2} />
                    <span className="mt-1 text-[9px]">room to grow</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="sketch-border mt-4 border border-[#e5dccb] bg-paper/70 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={14} strokeWidth={1.6} className="text-sage-deep" />
            <h2 className="font-serif text-[15px] text-ink">A few little things for Daisy&apos;s garden</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DECORATION_INFO.map((item) => {
              const Icon = item.icon;
              const enabled = state.garden.decorations.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleDecoration(item.id)}
                  aria-pressed={enabled}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
                    enabled
                      ? "border-[#c9d6bc] bg-[#e7eee0] text-[#586749]"
                      : "border-[#e2d9c9] bg-paper text-muted hover:text-ink"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.7} />
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-[11px] italic text-muted">
            Tap a decoration in the garden to move it somewhere else.
          </p>
        </div>
      </div>
    </main>
  );
}
