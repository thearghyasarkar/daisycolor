"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { IllustrationArt } from "./IllustrationArt";
import type { Illustration, Point, Stroke, Tool } from "@/lib/types";

const CENTER: Point = { x: 200, y: 200 };

type Props = {
  illustration: Illustration;
  colors: Record<string, string>;
  strokes: Stroke[];
  tool: Tool;
  color: string;
  brushSize: number;
  onColourRegion: (regionId: string) => void;
  onAddStroke: (stroke: Stroke) => void;
};

type Pinch = {
  distance: number;
  zoom: number;
  worldPoint: Point;
  viewCenter: Point;
};

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ColouringCanvas({
  illustration,
  colors,
  strokes,
  tool,
  color,
  brushSize,
  onColourRegion,
  onAddStroke,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<Pinch | null>(null);
  const drawing = useRef<Stroke | null>(null);
  const gesture = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [liveStroke, setLiveStroke] = useState<Stroke | null>(null);

  const toViewBox = useCallback((clientX: number, clientY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const result = point.matrixTransform(matrix.inverse());
    return { x: result.x, y: result.y };
  }, []);

  const toWorld = useCallback(
    (clientX: number, clientY: number): Point => {
      const view = toViewBox(clientX, clientY);
      return {
        x: CENTER.x + (view.x - pan.x - CENTER.x) / zoom,
        y: CENTER.y + (view.y - pan.y - CENTER.y) / zoom,
      };
    },
    [pan, toViewBox, zoom],
  );

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key === "+" || event.key === "=") setZoom((value) => clamp(value * 1.2, 0.8, 6));
      if (event.key === "-" || event.key === "_") setZoom((value) => clamp(value / 1.2, 0.8, 6));
      if (event.key === "0") resetZoom();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resetZoom]);

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      gesture.current = true;
      if (drawing.current) {
        drawing.current = null;
        setLiveStroke(null);
      }
      const points = Array.from(pointers.current.values());
      const mid = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      pinch.current = {
        distance: distance(points[0], points[1]),
        zoom,
        worldPoint: toWorld(mid.x, mid.y),
        viewCenter: toViewBox(mid.x, mid.y),
      };
      return;
    }

    if (pointers.current.size !== 1 || pinch.current) return;

    if (tool === "draw" || tool === "eraser") {
      const point = toWorld(event.clientX, event.clientY);
      const stroke: Stroke = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `stroke-${Date.now()}`,
        color: tool === "eraser" ? "#fffdf7" : color,
        size: brushSize,
        erase: tool === "eraser",
        points: [point],
      };
      drawing.current = stroke;
      setLiveStroke(stroke);
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic or unusual pointers still draw without capture.
      }
    } else if (tool === "move") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pinch and drag still work without capture.
      }
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size >= 2 && pinch.current) {
      const points = Array.from(pointers.current.values());
      const mid = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      const nextZoom = clamp((pinch.current.zoom * distance(points[0], points[1])) / Math.max(pinch.current.distance, 1), 0.8, 6);
      const view = toViewBox(mid.x, mid.y);
      const world = pinch.current.worldPoint;
      setZoom(nextZoom);
      setPan({
        x: view.x - CENTER.x - nextZoom * (world.x - CENTER.x),
        y: view.y - CENTER.y - nextZoom * (world.y - CENTER.y),
      });
      return;
    }

    if (tool === "move" && pointers.current.size === 1) {
      const before = toViewBox(previous.x, previous.y);
      const after = toViewBox(event.clientX, event.clientY);
      setPan((current) => ({ x: current.x + (after.x - before.x), y: current.y + (after.y - before.y) }));
      return;
    }

    if (drawing.current && pointers.current.size === 1) {
      const point = toWorld(event.clientX, event.clientY);
      const last = drawing.current.points[drawing.current.points.length - 1];
      if (distance(point, last) > 2.2 && drawing.current.points.length < 900) {
        drawing.current = { ...drawing.current, points: [...drawing.current.points, point] };
        setLiveStroke(drawing.current);
      }
    }
  };

  const finishPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId);
    if (drawing.current) {
      if (drawing.current.points.length >= 2) onAddStroke(drawing.current);
      drawing.current = null;
      setLiveStroke(null);
    }
    if (pointers.current.size < 2) pinch.current = null;
    if (gesture.current) {
      window.setTimeout(() => {
        gesture.current = false;
      }, 260);
    }
  };

  const handleRegionClick = (regionId: string) => {
    if (tool !== "fill" || gesture.current) return;
    onColourRegion(regionId);
  };

  const allStrokes = liveStroke ? [...strokes, liveStroke] : strokes;
  const overlayActive = tool === "draw" || tool === "eraser" || tool === "move";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div className="flex h-full w-full items-center justify-center p-2 sm:p-4">
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className={`h-full max-h-full w-full max-w-full select-none ${tool === "move" ? "cursor-grab active:cursor-grabbing" : tool === "fill" ? "cursor-crosshair" : "cursor-crosshair"}`}
          style={{ touchAction: "none" }}
          role="img"
          aria-label={`${illustration.title} colouring page`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
        >
          <g transform={`translate(${pan.x} ${pan.y}) translate(200 200) scale(${zoom}) translate(-200 -200)`}>
            <rect x={-400} y={-400} width={1200} height={1200} fill="#fffdf7" stroke="#e8dfce" strokeWidth={1} />
            <IllustrationArt
              illustration={illustration}
              colors={colors}
              strokes={allStrokes}
              interactive={tool === "fill"}
              onRegionClick={handleRegionClick}
            />
            {overlayActive && (
              <rect
                x={-400}
                y={-400}
                width={1200}
                height={1200}
                fill="transparent"
                style={{ touchAction: "none" }}
              />
            )}
          </g>
        </svg>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full border border-[#e6ddcd] bg-paper/90 p-1 shadow-soft">
        <button
          type="button"
          onClick={() => setZoom((value) => clamp(value / 1.25, 0.8, 6))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink/70 hover:bg-[#f2ecdf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          aria-label="Zoom out"
        >
          <Minus size={14} strokeWidth={1.8} />
        </button>
        <span className="w-9 text-center font-mono text-[10px] text-muted">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((value) => clamp(value * 1.25, 0.8, 6))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink/70 hover:bg-[#f2ecdf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          aria-label="Zoom in"
        >
          <Plus size={14} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={resetZoom}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink/70 hover:bg-[#f2ecdf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <LocateFixed size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
