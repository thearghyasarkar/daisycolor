"use client";

import { ArrowLeft, Flower2, Heart } from "lucide-react";
import { useGame } from "@/lib/game-context";

export function LetterScreen() {
  const { goBack, navigate } = useGame();

  return (
    <main className="relative min-h-[100dvh] overflow-hidden px-4 pb-14 pt-5 sm:px-8 sm:pt-7">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#eee3d3]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#e2eadb]/50 blur-3xl" />

      <div className="relative mx-auto max-w-2xl">
        <header className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e2d9c9] bg-paper/70 text-ink/70 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            aria-label="Back to the book"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
          </button>
          <div>
            <h1 className="font-serif text-[24px] leading-tight text-ink sm:text-[28px]">A letter for Daisy</h1>
            <p className="mt-0.5 text-[12px] italic text-muted">the last page, for buttercup</p>
          </div>
        </header>

        <article className="torn-paper relative border border-[#e2d7c4] bg-paper px-6 py-9 shadow-card sm:px-12 sm:py-12">
          <span className="washi-tape -left-4 -top-3 rotate-[-8deg]" aria-hidden="true" />
          <span className="washi-tape -right-5 top-10 rotate-[12deg]" aria-hidden="true" />
          <span className="wax-seal absolute -right-4 -top-6 z-10 flex h-16 w-16 text-[#fae9df]" aria-label="a wax seal with a flower pressed into it">
            <Flower2 size={24} strokeWidth={1.4} />
          </span>
          <div className="pointer-events-none absolute left-5 top-5 flex gap-1 text-[#c9bba4]" aria-hidden="true">
            <Flower2 size={13} strokeWidth={1.3} />
            <Flower2 size={10} strokeWidth={1.3} />
          </div>
          <div className="pointer-events-none absolute bottom-5 right-5 rotate-12 text-[#c9bba4]" aria-hidden="true">
            <Flower2 size={15} strokeWidth={1.3} />
          </div>
          <span className="marginalia absolute -bottom-6 left-8 rotate-[-3deg]">folded with care</span>

          <p className="font-serif text-[24px] text-ink">For Daisy,</p>
          <div className="mt-5 space-y-5 font-serif text-[16px] leading-[1.85] text-[#5d544b] sm:text-[17px]">
            <p>
              If you&apos;ve found your way to this last page, I hope you have had somewhere quiet to sit for a
              while, butterfly.
            </p>
            <p>
              This little world was made with one thought in mind: that you deserve a place to colour, to slow
              down, and to be gentle with yourself. You don&apos;t have to finish anything here. Just take your time.
            </p>
            <p>
              Some of the little corners keep words you&apos;ve said to me — <em>breathe beautiful.</em>, <em>the calm
              the silence.</em>, <em>more home than home</em>. I tucked them in quietly, the way you do.
            </p>
            <p>
              There are wax seals with flowers pressed into them, five places, our jacket while we game, voice notes,
              and the 1:11 you decided was better than all the others. I made the pages intricate because the way you
              notice things deserves that much care, buttercup.
            </p>
            <p>
              I hope this little world gives you somewhere peaceful to go, whenever you need it. And whenever you
              feel like it, there&apos;s always a little piece of me here with you — in the quiet, in the small hours,
              and on every page you leave exactly as you like.
            </p>
          </div>
          <div className="mt-9 flex items-center gap-2 text-sage-deep">
            <Heart size={14} strokeWidth={1.5} />
            <span className="font-serif text-[14px] italic">always, quietly &middot; nolan</span>
          </div>
        </article>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("garden")}
            className="rounded-full border border-[#dcd2bf] bg-paper/70 px-6 py-2.5 text-[12px] text-ink/80 transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          >
            Visit Daisy&apos;s garden
          </button>
        </div>
      </div>
    </main>
  );
}
