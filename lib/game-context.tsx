"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getIllustration, ILLUSTRATIONS, regionBaseColors } from "./illustrations";
import { DEFAULT_CUSTOM_COLORS } from "./palettes";
import type {
  ArtworkHistory,
  DecorationKind,
  GameState,
  Preferences,
  Screen,
  Snapshot,
  Stroke,
} from "./types";

const STORAGE_KEY = "daisycolor.littleworld.v1";
const MAX_HISTORY = 80;

const defaultState: GameState = {
  artworks: {},
  activeIllustrationId: null,
  screen: "home",
  paletteId: "pastels",
  customColors: DEFAULT_CUSTOM_COLORS,
  selectedColor: "#f2c8c4",
  brushSize: 6,
  preferences: { sound: false, music: true, motion: true },
  garden: { atmosphere: "morning", decorations: ["lantern"], positions: {} },
  seenNotes: [],
  actionCount: 0,
  visited: false,
};

type Toast = { id: number; text: string; kind: "note" | "quiet" | "save" };

type GameContextValue = {
  state: GameState;
  hydrated: boolean;
  toast: Toast | null;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  openIllustration: (id: string) => void;
  openLetter: () => void;
  getSnapshot: (id: string) => Snapshot | null;
  hasArtwork: (id: string) => boolean;
  colorRegion: (regionId: string, color?: string) => void;
  addStroke: (stroke: Stroke) => void;
  undo: () => void;
  redo: () => void;
  resetArtwork: () => void;
  setSelectedColor: (color: string) => void;
  setPalette: (id: string) => void;
  addCustomColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  setAtmosphere: (atmosphere: GameState["garden"]["atmosphere"]) => void;
  toggleDecoration: (decoration: DecorationKind) => void;
  moveDecoration: (decoration: DecorationKind) => void;
  dismissToast: () => void;
  showToast: (text: string, kind?: Toast["kind"]) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

function emptySnapshot(illustrationId: string): Snapshot {
  const illustration = getIllustration(illustrationId);
  return { colors: regionBaseColors(illustration ?? { regions: [] } as never), strokes: [] };
}

function readStoredState(): GameState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return {
      ...defaultState,
      ...parsed,
      preferences: { ...defaultState.preferences, ...parsed.preferences },
      garden: { ...defaultState.garden, ...parsed.garden },
      artworks: parsed.artworks ?? {},
      customColors: parsed.customColors?.length ? parsed.customColors : DEFAULT_CUSTOM_COLORS,
      seenNotes: parsed.seenNotes ?? [],
      screen: parsed.screen === "color" && !parsed.activeIllustrationId ? "book" : parsed.screen ?? "home",
    };
  } catch {
    return defaultState;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastId = useRef(0);
  const screenStack = useRef<Screen[]>([]);

  useEffect(() => {
    setState(readStoredState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // If storage is unavailable the game still works for this visit.
    }
  }, [state, hydrated]);

  const showToast = useCallback((text: string, kind: Toast["kind"] = "quiet") => {
    toastId.current += 1;
    setToast({ id: toastId.current, text, kind });
  }, []);

  const navigate = useCallback((screen: Screen) => {
    setState((previous) => {
      if (previous.screen === screen) return previous;
      screenStack.current.push(previous.screen);
      return {
        ...previous,
        screen,
        visited: true,
        activeIllustrationId: screen === "color" ? previous.activeIllustrationId : previous.activeIllustrationId,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((previous) => {
      const fallback: Screen = previous.screen === "color" || previous.screen === "letter" ? "book" : "home";
      const next = screenStack.current.pop() ?? fallback;
      if (next === previous.screen) return { ...previous, screen: fallback };
      return { ...previous, screen: next };
    });
  }, []);

  const openIllustration = useCallback((id: string) => {
    if (!getIllustration(id)) return;
    setState((previous) => {
      screenStack.current.push(previous.screen);
      return { ...previous, activeIllustrationId: id, screen: "color", visited: true };
    });
  }, []);

  const openLetter = useCallback(() => {
    setState((previous) => {
      screenStack.current.push(previous.screen);
      return { ...previous, screen: "letter", visited: true, activeIllustrationId: null };
    });
  }, []);

  const getSnapshot = useCallback(
    (id: string): Snapshot | null => {
      const artwork = state.artworks[id];
      if (!artwork || !artwork.history.length) return null;
      return artwork.history[Math.min(artwork.index, artwork.history.length - 1)];
    },
    [state.artworks],
  );

  const hasArtwork = useCallback(
    (id: string): boolean => {
      const snapshot = state.artworks[id]?.history?.[state.artworks[id].index];
      if (!snapshot) return false;
      if (snapshot.strokes.length) return true;
      const base = regionBaseColors(getIllustration(id) ?? ({ regions: [] } as never));
      return Object.entries(snapshot.colors).some(([regionId, color]) => base[regionId] && base[regionId] !== color);
    },
    [state.artworks],
  );

  const commit = useCallback((illustrationId: string, update: (current: Snapshot) => Snapshot | null) => {
    setState((previous) => {
      const artwork: ArtworkHistory = previous.artworks[illustrationId] ?? {
        history: [emptySnapshot(illustrationId)],
        index: 0,
      };
      const current = artwork.history[artwork.index] ?? emptySnapshot(illustrationId);
      const next = update(current);
      if (!next) return previous;
      const history = [...artwork.history.slice(0, artwork.index + 1), next].slice(-MAX_HISTORY);
      return {
        ...previous,
        actionCount: previous.actionCount + 1,
        artworks: {
          ...previous.artworks,
          [illustrationId]: { history, index: history.length - 1 },
        },
      };
    });
  }, []);

  const revealNotes = useCallback(
    (illustrationId: string, regionId: string, nextActionCount: number) => {
      const illustration = getIllustration(illustrationId);
      const note = illustration?.notes?.find((entry) => entry.regionId === regionId);
      if (note) {
        const key = `${illustrationId}:${regionId}:note`;
        if (!state.seenNotes.includes(key)) {
          setState((previous) => ({ ...previous, seenNotes: [...previous.seenNotes, key] }));
          showToast(note.text, "note");
          return;
        }
      }
      const milestones: Record<number, string> = {
        10: "breathe beautiful.",
        28: "the calm the silence.",
        55: "stay happy happy",
        90: "You don't have to finish anything here. Just take your time.",
      };
      const message = milestones[nextActionCount];
      if (message) {
        const key = `message:${nextActionCount}`;
        if (!state.seenNotes.includes(key)) {
          setState((previous) => ({ ...previous, seenNotes: [...previous.seenNotes, key] }));
          showToast(message, "quiet");
        }
      }
    },
    [showToast, state.seenNotes],
  );

  const colorRegion = useCallback(
    (regionId: string, color?: string) => {
      const illustrationId = state.activeIllustrationId;
      if (!illustrationId) return;
      const fill = color ?? state.selectedColor;
      const illustration = getIllustration(illustrationId);
      const base = illustration?.regions.find((region) => region.id === regionId)?.fill;
      const current = state.artworks[illustrationId]?.history?.[state.artworks[illustrationId].index];
      const currentColor = current?.colors[regionId] ?? base;
      if (currentColor === fill) return;
      commit(illustrationId, (snapshot) => ({
        ...snapshot,
        colors: { ...snapshot.colors, [regionId]: fill },
      }));
      revealNotes(illustrationId, regionId, state.actionCount + 1);
    },
    [commit, revealNotes, state.actionCount, state.activeIllustrationId, state.artworks, state.selectedColor],
  );

  const addStroke = useCallback(
    (stroke: Stroke) => {
      const illustrationId = state.activeIllustrationId;
      if (!illustrationId || stroke.points.length < 2) return;
      commit(illustrationId, (snapshot) => ({ ...snapshot, strokes: [...snapshot.strokes, stroke] }));
    },
    [commit, state.activeIllustrationId],
  );

  const undo = useCallback(() => {
    const id = state.activeIllustrationId;
    if (!id) return;
    setState((previous) => {
      const artwork = previous.artworks[id];
      if (!artwork || artwork.index <= 0) return previous;
      return {
        ...previous,
        artworks: { ...previous.artworks, [id]: { ...artwork, index: artwork.index - 1 } },
      };
    });
  }, [state.activeIllustrationId]);

  const redo = useCallback(() => {
    const id = state.activeIllustrationId;
    if (!id) return;
    setState((previous) => {
      const artwork = previous.artworks[id];
      if (!artwork || artwork.index >= artwork.history.length - 1) return previous;
      return {
        ...previous,
        artworks: { ...previous.artworks, [id]: { ...artwork, index: artwork.index + 1 } },
      };
    });
  }, [state.activeIllustrationId]);

  const resetArtwork = useCallback(() => {
    const id = state.activeIllustrationId;
    if (!id) return;
    setState((previous) => ({
      ...previous,
      artworks: {
        ...previous.artworks,
        [id]: { history: [emptySnapshot(id)], index: 0 },
      },
    }));
    showToast("A fresh page, whenever you'd like one.", "quiet");
  }, [showToast, state.activeIllustrationId]);

  const setSelectedColor = useCallback((color: string) => {
    setState((previous) => ({ ...previous, selectedColor: color }));
  }, []);

  const setPalette = useCallback((id: string) => {
    setState((previous) => ({ ...previous, paletteId: id }));
  }, []);

  const addCustomColor = useCallback((color: string) => {
    setState((previous) => {
      const colors = previous.customColors.includes(color)
        ? previous.customColors
        : [...previous.customColors, color].slice(-20);
      return { ...previous, customColors: colors, paletteId: "custom", selectedColor: color };
    });
  }, []);

  const setBrushSize = useCallback((size: number) => {
    setState((previous) => ({ ...previous, brushSize: size }));
  }, []);

  const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setState((previous) => ({
      ...previous,
      preferences: { ...previous.preferences, [key]: value },
    }));
  }, []);

  const setAtmosphere = useCallback((atmosphere: GameState["garden"]["atmosphere"]) => {
    setState((previous) => ({ ...previous, garden: { ...previous.garden, atmosphere } }));
  }, []);

  const toggleDecoration = useCallback((decoration: DecorationKind) => {
    setState((previous) => {
      const enabled = previous.garden.decorations.includes(decoration);
      return {
        ...previous,
        garden: {
          ...previous.garden,
          decorations: enabled
            ? previous.garden.decorations.filter((item) => item !== decoration)
            : [...previous.garden.decorations, decoration],
        },
      };
    });
  }, []);

  const moveDecoration = useCallback((decoration: DecorationKind) => {
    setState((previous) => ({
      ...previous,
      garden: {
        ...previous.garden,
        positions: {
          ...previous.garden.positions,
          [decoration]: ((previous.garden.positions[decoration] ?? 0) + 1) % 3,
        },
      },
    }));
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      hydrated,
      toast,
      navigate,
      goBack,
      openIllustration,
      openLetter,
      getSnapshot,
      hasArtwork,
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
      setAtmosphere,
      toggleDecoration,
      moveDecoration,
      dismissToast: () => setToast(null),
      showToast,
    }),
    [
      state,
      hydrated,
      toast,
      navigate,
      goBack,
      openIllustration,
      openLetter,
      getSnapshot,
      hasArtwork,
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
      setAtmosphere,
      toggleDecoration,
      moveDecoration,
      showToast,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
