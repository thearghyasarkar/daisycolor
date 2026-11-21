"use client";

import { useEffect, useState } from "react";
import { Check, Flower2, Music2, Settings2, X } from "lucide-react";
import { HomeScreen } from "./HomeScreen";
import { BookScreen } from "./BookScreen";
import { ColourScreen } from "./ColourScreen";
import { GardenScreen } from "./GardenScreen";
import { LetterScreen } from "./LetterScreen";
import { Settings } from "./Settings";
import { useAmbientMusic } from "@/lib/use-ambient-music";
import { useAmbientSound } from "@/lib/use-ambient-sound";
import { useGame } from "@/lib/game-context";

function LoadingScreen() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-cream text-center">
      <Flower2 size={34} strokeWidth={1.2} className="animate-float text-sage-deep" />
      <p className="font-serif text-[15px] italic text-muted">opening Daisy&apos;s little world…</p>
    </main>
  );
}

function Toast() {
  const { toast, dismissToast } = useGame();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, toast.kind === "save" ? 3200 : 7000);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="pointer-events-none fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-[60] w-[min(90vw,420px)] -translate-x-1/2 animate-fadeUp"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-[#e4dac8] bg-paper/95 px-4 py-2.5 text-center shadow-card">
        {toast.kind === "save" ? (
          <Check size={14} strokeWidth={1.8} className="shrink-0 text-sage-deep" />
        ) : (
          <Flower2 size={14} strokeWidth={1.5} className="shrink-0 text-sage-deep" />
        )}
        <p className={`flex-1 text-[12px] leading-snug text-ink/85 ${toast.kind === "note" ? "font-serif italic" : ""}`}>
          {toast.text}
        </p>
        <button
          type="button"
          onClick={dismissToast}
          className="pointer-events-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted hover:bg-[#f1eadc] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          aria-label="Dismiss message"
        >
          <X size={12} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export function AppShell() {
  const { state, hydrated, setPreference } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  useAmbientSound(state.preferences.sound);
  useAmbientMusic(state.preferences.music);

  if (!hydrated) return <LoadingScreen />;

  return (
    <div className={state.preferences.motion ? "" : "reduce-motion"}>
      {state.screen === "home" && <HomeScreen />}
      {state.screen === "book" && <BookScreen />}
      {state.screen === "color" && <ColourScreen />}
      {state.screen === "garden" && <GardenScreen />}
      {state.screen === "letter" && <LetterScreen />}

      {state.screen !== "color" && (
        <>
          <button
            type="button"
            onClick={() => setPreference("music", !state.preferences.music)}
            className={`fixed right-[60px] top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border bg-paper/85 shadow-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
              state.preferences.music
                ? "border-[#c8b4cf] text-[#806e91]"
                : "border-[#e2d9c9] text-ink/55 hover:text-ink"
            }`}
            aria-label={state.preferences.music ? "Turn the little music off" : "Turn the little music on"}
            aria-pressed={state.preferences.music}
            title={state.preferences.music ? "Hush the music" : "Play a little music"}
          >
            <Music2 size={16} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="fixed right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#e2d9c9] bg-paper/85 text-ink/65 shadow-soft transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            aria-label="Settings"
          >
            <Settings2 size={16} strokeWidth={1.7} />
          </button>
        </>
      )}

      {settingsOpen && (
        <Settings
          preferences={state.preferences}
          onChange={setPreference}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <Toast />
    </div>
  );
}
