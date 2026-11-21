"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Brush,
  Check,
  Eraser,
  Flower2,
  Hand,
  Music2,
  PaintBucket,
  Redo2,
  RotateCcw,
  Settings2,
  Undo2,
} from "lucide-react";
import { ColouringCanvas } from "./ColouringCanvas";
import { ColourPalette } from "./ColourPalette";
import { BreathingFlower } from "./BreathingFlower";
import { Settings } from "./Settings";
import { getIllustration, regionBaseColors } from "@/lib/illustrations";
import { useGame } from "@/lib/game-context";
import type { Tool } from "@/lib/types";

const TOOLS: { id: Tool; label: string; icon: typeof PaintBucket; key: string }[] = [
  { id: "fill", label: "Fill", icon: PaintBucket, key: "F" },
  { id: "draw", label: "Draw", icon: Brush, key: "B" },
  { id: "eraser", label: "Erase", icon: Eraser, key: "E" },
  { id: "move", label: "Move", icon: Hand, key: "H" },
];

export function ColourScreen() {
  const {
    state,
    getSnapshot,
    colorRegion,
    addStroke,
    undo,
    redo,
    resetArtwork,
    setSelectedColor,
    setPalette,
    addCustomColor,
    setBrushSize,
    setPreference,
    goBack,
    showToast,
  } = useGame();
  const [tool, setTool] = useState<Tool>("fill");
  const [breathing, setBreathing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const illustration = getIllustration(state.activeIllustrationId);
  const stored = state.activeIllustrationId ? state.artworks[state.activeIllustrationId] : undefined;
  const snapshot = state.activeIllustrationId ? getSnapshot(state.activeIllustrationId) : null;
  const colors = useMemo(
    () => ({ ...(illustration ? regionBaseColors(illustration) : {}), ...(snapshot?.colors ?? {}) }),
    [illustration, snapshot?.colors],
  );
  const canUndo = Boolean(stored && stored.index > 0);
  const canRedo = Boolean(stored && stored.index < stored.history.length - 1);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const meta = event.ctrlKey || event.metaKey;
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (meta && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }
      if (event.key === "Escape") {
        setResetOpen(false);
        setSettingsOpen(false);
        setBreathing(false);
        return;
      }
      const key = event.key.toLowerCase();
      const match = TOOLS.find((item) => item.key.toLowerCase() === key);
      if (match && !meta) setTool(match.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [redo, undo]);

  if (!illustration || !state.activeIllustrationId) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <Flower2 size={30} strokeWidth={1.4} className="text-sage-deep" />
        <p className="font-serif text-xl text-ink">That page has wandered off.</p>
        <button
          type="button"
          onClick={() => goBack()}
          className="rounded-full bg-[#899c7d] px-6 py-2.5 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        >
          Back to the book
        </button>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-cream">
      <header className="flex shrink-0 items-center gap-2 border-b border-[#e8dfcf] bg-[#f8f1e3]/95 px-3 py-2 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={goBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e2d9c9] bg-paper/80 text-ink/75 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          aria-label="Save and go back to the book"
          title="Save and go back"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-serif text-[17px] leading-tight text-ink sm:text-[19px]">{illustration.title}</h1>
          <p className="truncate text-[10px] italic text-muted">{illustration.subtitle}</p>
          <p className="marginalia hidden truncate sm:block">take your time, butterfly.</p>
        </div>
        <button
          type="button"
          onClick={() => setBreathing((value) => !value)}
          aria-pressed={breathing}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
            breathing ? "border-[#c8b4cf] bg-[#f2eaf4] text-[#806e91]" : "border-[#e2d9c9] bg-paper/80 text-ink/70 hover:bg-paper"
          }`}
          aria-label="Breathing flower"
          title="Take a breath"
        >
          <Flower2 size={17} strokeWidth={1.7} />
        </button>
        <button
          type="button"
          onClick={() => setPreference("music", !state.preferences.music)}
          aria-pressed={state.preferences.music}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
            state.preferences.music
              ? "border-[#c8b4cf] bg-[#f2eaf4] text-[#806e91]"
              : "border-[#e2d9c9] bg-paper/80 text-ink/70 hover:bg-paper"
          }`}
          aria-label={state.preferences.music ? "Turn the little music off" : "Turn the little music on"}
          title={state.preferences.music ? "Hush the music" : "Play a little music"}
        >
          <Music2 size={17} strokeWidth={1.7} />
        </button>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e2d9c9] bg-paper/80 text-ink/70 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          aria-label="Settings"
        >
          <Settings2 size={17} strokeWidth={1.7} />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <ColouringCanvas
          illustration={illustration}
          colors={colors}
          strokes={snapshot?.strokes ?? []}
          tool={tool}
          color={state.selectedColor}
          brushSize={state.brushSize}
          onColourRegion={colorRegion}
          onAddStroke={addStroke}
        />
        {breathing && (
          <BreathingFlower motionEnabled={state.preferences.motion} onClose={() => setBreathing(false)} />
        )}
      </div>

      <footer className="shrink-0 border-t border-[#e8dfcf] bg-[#f6efdf] px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 sm:px-5">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-1.5">
            <div className="flex flex-1 items-center gap-1 rounded-full border border-[#e6ddcd] bg-paper/80 p-1">
              {TOOLS.map((item) => {
                const Icon = item.icon;
                const active = tool === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTool(item.id)}
                    aria-pressed={active}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
                      active ? "bg-[#e2e9d8] text-[#576746]" : "text-muted hover:bg-[#f1eadc] hover:text-ink"
                    }`}
                  >
                    <Icon size={14} strokeWidth={1.7} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6ddcd] bg-paper/80 text-ink/70 transition-colors hover:bg-paper disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={15} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6ddcd] bg-paper/80 text-ink/70 transition-colors hover:bg-paper disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              aria-label="Redo"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={15} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6ddcd] bg-paper/80 text-ink/70 transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              aria-label="Reset illustration"
              title="Start this page over"
            >
              <RotateCcw size={14} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={() => {
                showToast("Saved right here, just for you.", "save");
                goBack();
              }}
              className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#899c7d] px-3 text-[11px] text-paper transition-colors hover:bg-[#778b6d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              aria-label="Save and return to the book"
            >
              <Check size={13} strokeWidth={2} />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>

          {(tool === "draw" || tool === "eraser") && (
            <div className="mt-2 flex items-center gap-2 rounded-full bg-[#f1eadc] px-3 py-1.5">
              <span className="text-[10px] text-muted">size</span>
              <input
                type="range"
                min={2}
                max={24}
                value={state.brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                className="h-1 flex-1 accent-[#899c7d]"
                aria-label="Brush size"
              />
              <span className="w-5 text-right font-mono text-[10px] text-muted">{state.brushSize}</span>
            </div>
          )}

          <div className="mt-2">
            <ColourPalette
              paletteId={state.paletteId}
              customColors={state.customColors}
              selectedColor={state.selectedColor}
              onPaletteChange={setPalette}
              onColourChange={setSelectedColor}
              onSaveCustom={() => {
                addCustomColor(state.selectedColor);
                showToast("Kept in Daisy's little palette.", "quiet");
              }}
            />
          </div>
        </div>
      </footer>

      {settingsOpen && (
        <Settings
          preferences={state.preferences}
          onChange={setPreference}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {resetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a4139]/25 p-5 backdrop-blur-[2px]"
          onMouseDown={() => setResetOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Start this page over"
            className="w-full max-w-xs rounded-[24px] border border-[#e6ddcd] bg-cream p-5 text-center shadow-card animate-fadeUp"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Flower2 size={24} strokeWidth={1.4} className="mx-auto text-sage-deep" />
            <h2 className="mt-2 font-serif text-lg text-ink">Start this page over?</h2>
            <p className="mt-1 text-[12px] leading-snug text-muted">
              All the colours on this page will go back to white. You can always colour it again.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setResetOpen(false)}
                className="flex-1 rounded-full border border-[#ddd3c2] bg-paper py-2.5 text-[12px] text-ink/80 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              >
                Keep my colours
              </button>
              <button
                type="button"
                onClick={() => {
                  resetArtwork();
                  setResetOpen(false);
                }}
                className="flex-1 rounded-full bg-[#899c7d] py-2.5 text-[12px] text-paper hover:bg-[#778b6d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
