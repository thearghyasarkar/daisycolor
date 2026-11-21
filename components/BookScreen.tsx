"use client";

import { ArrowLeft, Heart, Mail } from "lucide-react";
import { IllustrationCard } from "./IllustrationCard";
import { ILLUSTRATIONS } from "@/lib/illustrations";
import { useGame } from "@/lib/game-context";

export function BookScreen() {
  const { navigate, goBack, getSnapshot, openIllustration, openLetter } = useGame();

  return (
    <main className="min-h-[100dvh] px-4 pb-14 pt-5 sm:px-8 sm:pt-7">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e2d9c9] bg-paper/70 text-ink/70 transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            aria-label="Back"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
          </button>
          <div>
            <h1 className="font-serif text-[27px] leading-tight text-ink sm:text-[32px]">Daisy&apos;s colouring book</h1>
            <p className="mt-0.5 text-[12px] text-muted">Pick a page, butterfly. Stay as long as you like.</p>
            <p className="marginalia mt-1 rotate-[-1deg]">every page, a small pause</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {ILLUSTRATIONS.map((illustration, index) => (
            <IllustrationCard
              key={illustration.id}
              illustration={illustration}
              snapshot={getSnapshot(illustration.id)}
              index={index}
              onOpen={() => openIllustration(illustration.id)}
            />
          ))}

          <button
            type="button"
            onClick={openLetter}
            className="book-card group relative flex aspect-square flex-col items-center justify-center rounded-[18px_24px_20px_22px] border border-dashed border-[#d9c9b6] bg-[#fdf6e9] px-5 text-center shadow-card transition-all duration-300 hover:border-[#c8b39a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
            style={{ "--card-tilt": "-0.9deg" } as React.CSSProperties}
            aria-label="Open the letter for you"
          >
            <span className="washi-tape -left-3 -top-2 z-10 rotate-[-9deg]" aria-hidden="true" />
            <span className="page-number absolute bottom-1 right-3">16</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2e6d4] text-[#9a7f68] transition-transform group-hover:scale-105">
              <Mail size={21} strokeWidth={1.5} />
            </span>
            <span className="mt-3 font-serif text-[17px] leading-tight text-ink">A letter for you</span>
            <span className="mt-1 text-[11px] italic text-muted">for the last page</span>
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <p className="font-serif text-[14px] italic text-muted">
            You don&apos;t have to finish anything here. Just take your time.
          </p>
          <button
            type="button"
            onClick={() => navigate("garden")}
            className="flex items-center gap-1.5 text-[12px] text-sage-deep underline decoration-[#c8d4bd] underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          >
            <Heart size={12} strokeWidth={1.7} />
            visit Daisy&apos;s garden
          </button>
        </div>
      </div>
    </main>
  );
}
