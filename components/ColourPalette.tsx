"use client";

import { PALETTES } from "@/lib/palettes";
import { ColourPicker } from "./ColourPicker";

type Props = {
  paletteId: string;
  customColors: string[];
  selectedColor: string;
  onPaletteChange: (id: string) => void;
  onColourChange: (color: string) => void;
  onSaveCustom: () => void;
};

export function ColourPalette({
  paletteId,
  customColors,
  selectedColor,
  onPaletteChange,
  onColourChange,
  onSaveCustom,
}: Props) {
  const colors = paletteId === "custom" ? customColors : (PALETTES.find((item) => item.id === paletteId) ?? PALETTES[0]).colors;

  return (
    <div className="flex flex-col gap-2">
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {[...PALETTES.map((palette) => ({ id: palette.id, name: palette.name })), { id: "custom", name: "Daisy's colours" }].map(
          (palette) => (
            <button
              key={palette.id}
              type="button"
              onClick={() => onPaletteChange(palette.id)}
              aria-pressed={paletteId === palette.id}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep ${
                paletteId === palette.id
                  ? "bg-[#e7ebdd] font-medium text-[#586749]"
                  : "text-muted hover:bg-[#f2ecdf] hover:text-ink"
              }`}
            >
              {palette.name}
            </button>
          ),
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto py-1">
          {colors.map((color, index) => {
            const selected = color.toLowerCase() === selectedColor.toLowerCase();
            return (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => onColourChange(color)}
                aria-label={`Use colour ${color}`}
                aria-pressed={selected}
                className={`relative h-8 w-8 shrink-0 rounded-full border transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep ${
                  selected ? "scale-110 border-ink" : "border-black/10 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              >
                {selected && (
                  <span className="absolute inset-[-5px] rounded-full border border-ink/40" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
        <ColourPicker color={selectedColor} onChange={onColourChange} onSave={onSaveCustom} />
      </div>
    </div>
  );
}
