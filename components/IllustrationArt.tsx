"use client";

import { useId, type KeyboardEvent } from "react";
import { previewColor } from "@/lib/illustrations";
import type { Illustration, Region, Stroke } from "@/lib/types";

const OUTLINE = "#4a4139";

type Props = {
  illustration: Illustration;
  colors?: Record<string, string>;
  strokes?: Stroke[];
  preview?: boolean;
  interactive?: boolean;
  onRegionClick?: (regionId: string) => void;
  showDetails?: boolean;
};

function regionLabel(region: Region): string {
  return region.label ?? region.id.replace(/[-_]/g, " ").replace(/\d+/g, (value) => ` ${value}`);
}

export function IllustrationArt({
  illustration,
  colors,
  strokes = [],
  preview = false,
  interactive = false,
  onRegionClick,
  showDetails = true,
}: Props) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const maskId = `erase-mask-${rawId}`;
  const drawStrokes = strokes.filter((stroke) => !stroke.erase);
  const eraseStrokes = strokes.filter((stroke) => stroke.erase);
  const hasStrokes = strokes.length > 0;

  const common = {
    stroke: OUTLINE,
    strokeWidth: 1.9,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
    className: `region-shape${interactive ? " cursor-pointer outline-none focus-visible:stroke-[#6d7f63] focus-visible:[stroke-width:3.2]" : ""}`,
    tabIndex: interactive ? 0 : undefined,
    role: interactive ? ("button" as const) : undefined,
  };

  return (
    <>
      {illustration.regions.map((region) => {
        const fill = preview ? previewColor(region) : (colors?.[region.id] ?? region.fill);
        const handlers = interactive
          ? {
              onClick: () => onRegionClick?.(region.id),
              onKeyDown: (event: KeyboardEvent<SVGElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onRegionClick?.(region.id);
                }
              },
              "data-region-id": region.id,
              "aria-label": `Colour ${regionLabel(region)}`,
            }
          : {};

        const sharedProps = { ...common, fill, ...handlers, transform: region.transform };

        switch (region.type) {
          case "path":
            return <path key={region.id} {...sharedProps} d={region.d} />;
          case "circle":
            return <circle key={region.id} {...sharedProps} cx={region.cx} cy={region.cy} r={region.r} />;
          case "ellipse":
            return <ellipse key={region.id} {...sharedProps} cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} />;
          case "rect":
            return (
              <rect
                key={region.id}
                {...sharedProps}
                x={region.x}
                y={region.y}
                width={region.width}
                height={region.height}
                rx={region.rx}
              />
            );
          case "polygon":
            return <polygon key={region.id} {...sharedProps} points={region.points} />;
        }
      })}

      {showDetails &&
        illustration.details?.map((detail, index) => (
          <path
            key={`detail-${index}`}
            d={detail.d}
            fill="none"
            stroke={OUTLINE}
            strokeWidth={detail.width ?? 1.5}
            strokeOpacity={detail.opacity ?? 0.8}
            strokeLinecap="round"
            strokeDasharray={detail.dash}
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        ))}

      {hasStrokes && (
        <>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={-200} y={-200} width={800} height={800}>
            <rect x={-200} y={-200} width={800} height={800} fill="white" />
            {eraseStrokes.map((stroke) => (
              <polyline
                key={stroke.id}
                points={stroke.points.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke="black"
                strokeWidth={stroke.size + 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </mask>
          <g mask={`url(#${maskId})`} pointerEvents="none">
            {drawStrokes.map((stroke) => (
              <polyline
                key={stroke.id}
                points={stroke.points.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke={stroke.color}
                strokeWidth={stroke.size}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </>
      )}
    </>
  );
}
