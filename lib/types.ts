export type BaseRegion = {
  id: string;
  fill: string;
  transform?: string;
  label?: string;
};

export type Region =
  | (BaseRegion & { type: "path"; d: string })
  | (BaseRegion & { type: "ellipse"; cx: number; cy: number; rx: number; ry: number })
  | (BaseRegion & { type: "circle"; cx: number; cy: number; r: number })
  | (BaseRegion & {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      rx?: number;
    })
  | (BaseRegion & { type: "polygon"; points: string });

export type Detail = { d: string; width?: number; opacity?: number; dash?: string };

export type HiddenNote = { regionId: string; text: string };

export type Illustration = {
  id: string;
  title: string;
  subtitle: string;
  regions: Region[];
  details?: Detail[];
  notes?: HiddenNote[];
};

export type Point = { x: number; y: number };

export type Stroke = {
  id: string;
  color: string;
  size: number;
  points: Point[];
  erase?: boolean;
};

export type Snapshot = {
  colors: Record<string, string>;
  strokes: Stroke[];
};

export type ArtworkHistory = {
  history: Snapshot[];
  index: number;
};

export type Palette = {
  id: string;
  name: string;
  colors: string[];
  description: string;
};

export type Tool = "fill" | "draw" | "eraser" | "move";

export type Screen = "home" | "book" | "color" | "garden" | "letter";

export type DecorationKind = "lantern" | "mushroom" | "bird" | "wateringCan";

export type GardenState = {
  atmosphere: "morning" | "golden" | "twilight";
  decorations: DecorationKind[];
  positions: Partial<Record<DecorationKind, number>>;
};

export type Preferences = {
  sound: boolean;
  music: boolean;
  motion: boolean;
};

export type GameState = {
  artworks: Record<string, ArtworkHistory>;
  activeIllustrationId: string | null;
  screen: Screen;
  paletteId: string;
  customColors: string[];
  selectedColor: string;
  brushSize: number;
  preferences: Preferences;
  garden: GardenState;
  seenNotes: string[];
  actionCount: number;
  visited: boolean;
};
