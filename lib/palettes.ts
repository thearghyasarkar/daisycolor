import type { Palette } from "./types";

export const PALETTES: Palette[] = [
  {
    id: "pastels",
    name: "Soft Pastels",
    description: " powder pinks, pale blues, little bits of butter",
    colors: [
      "#f2c8c4",
      "#f6dcc6",
      "#f5e9b8",
      "#cfe0c4",
      "#bcd8d3",
      "#c9d6eb",
      "#d9c8e4",
      "#e9cddc",
    ],
  },
  {
    id: "garden",
    name: "Garden",
    description: "leafy greens and flowers from the path",
    colors: [
      "#a9bd8f",
      "#c5d2a4",
      "#7f9a72",
      "#e7b7ae",
      "#d59ba0",
      "#f0d49a",
      "#b8a6c9",
      "#9fc0bd",
    ],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "the warm end of a long day",
    colors: [
      "#f4c5a4",
      "#ebad9e",
      "#d99093",
      "#c99ab0",
      "#f2d7a0",
      "#dfb787",
      "#b9a0bd",
      "#9fb3c4",
    ],
  },
  {
    id: "lavender",
    name: "Lavender Dreams",
    description: "soft violets and quiet blues",
    colors: [
      "#c8b8df",
      "#b4a3d1",
      "#d9cdec",
      "#e7d6e8",
      "#b9cbe0",
      "#9fb4d2",
      "#d8c8b8",
      "#e9d9bb",
    ],
  },
  {
    id: "night",
    name: "Night Sky",
    description: "for moonlight and small wishes",
    colors: [
      "#4f5b7a",
      "#65729a",
      "#8493b8",
      "#a9b7d4",
      "#d8c98e",
      "#c3a9c9",
      "#7a8fa3",
      "#3f4a66",
    ],
  },
];

export const DEFAULT_CUSTOM_COLORS = ["#e8b7b0", "#c9d8b6", "#b9c6dd", "#e6d5a5", "#cbb8d8"];

export function getPalette(id: string, customColors: string[]): Palette {
  if (id === "custom") {
    return {
      id: "custom",
      name: "Daisy's colours",
      description: "the colours you gathered along the way",
      colors: customColors,
    };
  }
  return PALETTES.find((palette) => palette.id === id) ?? PALETTES[0];
}
