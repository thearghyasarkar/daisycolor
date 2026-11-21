import type { Detail, Illustration, Region } from "./types";

const PAPER = "#fffdf7";
const LEAF = "#f1f5ec";
const SKY = "#f5fafd";
const WARM = "#fbf1df";
const STONE = "#f3efe8";
const ROSE = "#f9ece9";
const LILAC = "#f4f0fa";

const path = (
  id: string,
  d: string,
  fill = PAPER,
  transform?: string,
  label?: string,
): Region => ({ type: "path", id, d, fill, transform, label });

const ellipse = (
  id: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fill = PAPER,
  transform?: string,
  label?: string,
): Region => ({ type: "ellipse", id, cx, cy, rx, ry, fill, transform, label });

const circle = (
  id: string,
  cx: number,
  cy: number,
  r: number,
  fill = PAPER,
  label?: string,
): Region => ({ type: "circle", id, cx, cy, r, fill, label });

const rect = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = PAPER,
  rx?: number,
  label?: string,
): Region => ({ type: "rect", id, x, y, width, height, fill, rx, label });

const poly = (
  id: string,
  points: string,
  fill = PAPER,
  transform?: string,
  label?: string,
): Region => ({ type: "polygon", id, points, fill, transform, label });

function flower(
  prefix: string,
  cx: number,
  cy: number,
  r: number,
  count = 6,
  offset = 0,
  petalFill = PAPER,
): Region[] {
  const regions: Region[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = offset + (i * 360) / count;
    regions.push(
      ellipse(
        `${prefix}-petal-${i}`,
        cx,
        cy - r * 0.68,
        r * 0.32,
        r * 0.55,
        petalFill,
        `rotate(${angle} ${cx} ${cy})`,
        `petal ${i + 1} of ${prefix}`,
      ),
    );
  }
  regions.push(circle(`${prefix}-inner`, cx, cy, r * 0.36, WARM, "flower middle"));
  regions.push(circle(`${prefix}-center`, cx, cy, r * 0.18, "#f7e9c6", "flower centre"));
  return regions;
}

function leaf(
  id: string,
  x: number,
  y: number,
  rotation: number,
  scale = 1,
  fill = LEAF,
): Region {
  return path(
    id,
    "M 0 0 C 6 -15 25 -19 35 -3 C 27 12 8 13 0 0 Z",
    fill,
    `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`,
    "leaf",
  );
}

function star(id: string, cx: number, cy: number, r: number, fill = WARM): Region {
  const q = r * 0.2;
  return path(
    id,
    `M ${cx} ${cy - r} Q ${cx + q} ${cy - q} ${cx + r} ${cy} Q ${cx + q} ${cy + q} ${cx} ${cy + r} Q ${cx - q} ${cy + q} ${cx - r} ${cy} Q ${cx - q} ${cy - q} ${cx} ${cy - r} Z`,
    fill,
    undefined,
    "star",
  );
}

function cloud(id: string, x: number, y: number, scale = 1): Region {
  return path(
    id,
    "M 8 36 C -3 36 -5 22 6 19 C 9 8 23 7 29 16 C 36 4 53 9 53 21 C 65 20 68 36 56 36 Z",
    PAPER,
    `translate(${x} ${y}) scale(${scale})`,
    "cloud",
  );
}

/** A delicate, colourable lace edge, shared by every page so each one feels richly detailed. */
function ornateFrame(prefix: string, accent: string): Region[] {
  const regions: Region[] = [];
  const inset = 9;
  const span = 400 - inset * 2;

  for (let index = 0; index < 6; index += 1) {
    const position = inset + ((index + 0.5) / 6) * span;
    const opposite = 400 - position;
    regions.push(
      circle(`${prefix}-frame-top-pearl-${index}`, position, inset, 3.2, index % 2 ? accent : PAPER, "frame pearl"),
      circle(`${prefix}-frame-bottom-pearl-${index}`, position, 400 - inset, 3.2, index % 2 ? PAPER : accent, "frame pearl"),
      circle(`${prefix}-frame-left-pearl-${index}`, inset, position, 3.2, index % 2 ? PAPER : accent, "frame pearl"),
      circle(`${prefix}-frame-right-pearl-${index}`, 400 - inset, position, 3.2, index % 2 ? accent : PAPER, "frame pearl"),
    );

    const garland = 52 + index * 60;
    regions.push(
      leaf(`${prefix}-frame-top-leaf-${index}`, garland, 18, 200, 0.28, accent),
      leaf(`${prefix}-frame-bottom-leaf-${index}`, garland + 30, 382, 20, 0.28, accent),
      leaf(`${prefix}-frame-left-leaf-${index}`, 18, garland, 110, 0.28, accent),
      leaf(`${prefix}-frame-right-leaf-${index}`, 382, garland + 30, -70, 0.28, accent),
    );
  }

  ([[21, 21], [379, 21], [21, 379], [379, 379]] as const).forEach(([cx, cy], index) => {
    regions.push(...flower(`${prefix}-frame-corner-${index}`, cx, cy, 7, 4, index * 12, accent));
  });

  return regions;
}

const bouquet: Illustration = {
  id: "bouquet",
  title: "A little bouquet",
  subtitle: "picked for my buttercup",
  regions: [
    circle("backdrop", 200, 190, 165, PAPER, "soft backdrop"),
    path("stem-1", "M 197 327 C 184 275 165 200 122 139 L 129 135 C 173 197 193 270 204 324 Z", LEAF, undefined, "stem"),
    path("stem-2", "M 199 327 C 194 260 196 175 198 99 L 205 99 C 205 175 204 260 206 326 Z", LEAF, undefined, "stem"),
    path("stem-3", "M 201 327 C 215 270 236 198 276 139 L 283 143 C 240 202 222 274 209 326 Z", LEAF, undefined, "stem"),
    path("stem-4", "M 199 328 C 191 290 174 246 157 212 L 163 207 C 182 242 198 286 205 327 Z", LEAF, undefined, "stem"),
    path("stem-5", "M 202 328 C 211 290 228 246 247 212 L 241 207 C 220 242 205 286 200 327 Z", LEAF, undefined, "stem"),
    leaf("leaf-1", 172, 240, 200, 0.85),
    leaf("leaf-2", 218, 255, -20, 0.9),
    leaf("leaf-3", 148, 178, 170, 0.75),
    leaf("leaf-4", 250, 183, 5, 0.75),
    leaf("leaf-5", 188, 293, 215, 0.7),
    leaf("leaf-6", 214, 300, -35, 0.7),
    ...flower("f1", 125, 132, 31, 6, 0),
    ...flower("f2", 200, 88, 37, 6, 15),
    ...flower("f3", 276, 133, 31, 6, 0),
    ...flower("f4", 156, 208, 28, 6, 30),
    ...flower("f5", 248, 208, 28, 6, 30),
    path("wrap", "M 132 258 L 268 258 L 204 348 Z", WARM, undefined, "paper wrap"),
    path("wrap-fold", "M 135 263 L 200 318 L 265 263 L 252 263 L 200 303 L 148 263 Z", PAPER, undefined, "paper fold"),
    ellipse("bow-left", 180, 258, 21, 11, ROSE, "rotate(-22 180 258)", "ribbon bow"),
    ellipse("bow-right", 220, 258, 21, 11, ROSE, "rotate(22 220 258)", "ribbon bow"),
    circle("bow-knot", 200, 258, 9, LILAC, "ribbon knot"),
  ],
  details: [
    { d: "M 181 269 C 176 286 171 296 163 307" },
    { d: "M 219 269 C 224 286 229 296 237 307" },
    { d: "M 154 277 L 246 277", opacity: 0.5 },
  ],
  notes: [
    { regionId: "f2-center", text: "“and with each we'd seal a flower.”" },
    { regionId: "bow-knot", text: "For my buttercup. Always." },
    { regionId: "leaf-3", text: "oh i adored quentin blake's illustration style" },
  ],
};

const cottage: Illustration = {
  id: "cottage",
  title: "Cottage in the green",
  subtitle: "more home than home",
  regions: [
    rect("sky", 0, 0, 400, 400, SKY, undefined, "sky"),
    circle("sun", 336, 68, 27, WARM, "sun"),
    cloud("cloud-1", 42, 62, 1),
    cloud("cloud-2", 230, 45, 0.75),
    path("hill-back", "M 0 286 Q 90 250 184 284 Q 284 320 400 274 L 400 400 L 0 400 Z", LEAF, undefined, "rolling hill"),
    path("hill-front", "M 0 335 Q 120 300 230 336 Q 320 365 400 330 L 400 400 L 0 400 Z", "#eaf0e1", undefined, "grass"),
    rect("house-body", 112, 176, 176, 142, WARM, 4, "cottage wall"),
    poly("roof", "96,181 200,96 304,181", ROSE, undefined, "roof"),
    rect("chimney", 246, 112, 22, 47, STONE, 2, "chimney"),
    path("door", "M 180 318 L 180 250 Q 180 229 200 229 Q 220 229 220 250 L 220 318 Z", ROSE, undefined, "front door"),
    circle("door-knob", 211, 278, 3.5, WARM, "door knob"),
    rect("window-left", 128, 205, 46, 46, PAPER, 3, "left window"),
    rect("window-right", 226, 205, 46, 46, PAPER, 3, "right window"),
    rect("pane-l-1", 131, 208, 20, 20, SKY, 1, "window pane"),
    rect("pane-l-2", 151, 208, 20, 20, SKY, 1, "window pane"),
    rect("pane-l-3", 131, 228, 20, 20, SKY, 1, "window pane"),
    rect("pane-l-4", 151, 228, 20, 20, SKY, 1, "window pane"),
    rect("pane-r-1", 229, 208, 20, 20, SKY, 1, "window pane"),
    rect("pane-r-2", 249, 208, 20, 20, SKY, 1, "window pane"),
    rect("pane-r-3", 229, 228, 20, 20, SKY, 1, "window pane"),
    rect("pane-r-4", 249, 228, 20, 20, SKY, 1, "window pane"),
    rect("box-left", 124, 251, 54, 13, STONE, 2, "flower box"),
    rect("box-right", 222, 251, 54, 13, STONE, 2, "flower box"),
    circle("box-flower-1", 136, 246, 7, ROSE, "window flower"),
    circle("box-flower-2", 151, 244, 7, LILAC, "window flower"),
    circle("box-flower-3", 166, 247, 6, WARM, "window flower"),
    circle("box-flower-4", 234, 246, 7, LILAC, "window flower"),
    circle("box-flower-5", 250, 244, 7, ROSE, "window flower"),
    circle("box-flower-6", 265, 247, 6, WARM, "window flower"),
    rect("tree-trunk", 339, 244, 15, 68, STONE, 4, "tree trunk"),
    circle("tree-canopy-1", 347, 222, 34, LEAF, "tree canopy"),
    circle("tree-canopy-2", 324, 239, 27, LEAF, "tree canopy"),
    circle("tree-canopy-3", 369, 241, 26, LEAF, "tree canopy"),
    ellipse("path-1", 200, 352, 30, 9, STONE, undefined, "stepping stone"),
    ellipse("path-2", 182, 372, 27, 8, STONE, undefined, "stepping stone"),
    ellipse("path-3", 218, 390, 29, 8, STONE, undefined, "stepping stone"),
    rect("fence-1", 16, 300, 8, 48, STONE, 2, "fence post"),
    rect("fence-2", 48, 300, 8, 48, STONE, 2, "fence post"),
    rect("fence-3", 80, 300, 8, 48, STONE, 2, "fence post"),
    rect("fence-rail-a", 12, 312, 80, 7, STONE, 2, "fence rail"),
    rect("fence-rail-b", 12, 332, 80, 7, STONE, 2, "fence rail"),
    ...flower("garden-f1", 44, 365, 12, 5, 0),
    ...flower("garden-f2", 76, 380, 11, 5, 20),
    ...flower("garden-f3", 338, 352, 12, 5, 0),
  ],
  details: [
    { d: "M 264 112 C 254 100 270 90 260 78 C 253 70 264 62 260 54", opacity: 0.55 },
    { d: "M 279 112 C 270 102 283 93 276 83", opacity: 0.45 },
  ],
  notes: [
    { regionId: "door", text: "You're more home than home can ever be." },
    { regionId: "window-left", text: "with you we're never away from home" },
  ],
};

const catWindow: Illustration = {
  id: "cat-window",
  title: "Cat by the window",
  subtitle: "the calm, the silence",
  regions: [
    rect("wall", 0, 0, 400, 400, WARM, undefined, "wall"),
    rect("window-frame", 56, 42, 288, 214, STONE, 8, "window frame"),
    rect("window-glass", 68, 54, 264, 190, SKY, 3, "window glass"),
    rect("pane-a", 70, 56, 129, 92, SKY, 2, "window pane"),
    rect("pane-b", 201, 56, 129, 92, SKY, 2, "window pane"),
    rect("pane-c", 70, 150, 129, 92, SKY, 2, "window pane"),
    rect("pane-d", 201, 150, 129, 92, SKY, 2, "window pane"),
    path("moon", "M 118 74 A 25 25 0 1 0 143 99 A 19 19 0 1 1 118 74 Z", WARM, undefined, "moon"),
    star("win-star-1", 234, 81, 7),
    star("win-star-2", 268, 113, 5),
    star("win-star-3", 212, 127, 4),
    path("curtain-left", "M 56 42 C 86 50 90 96 76 146 C 72 172 62 197 56 212 L 56 42 Z", ROSE, undefined, "curtain"),
    path("curtain-right", "M 344 42 C 314 50 310 96 324 146 C 328 172 338 197 344 212 L 344 42 Z", ROSE, undefined, "curtain"),
    rect("tie-left", 62, 137, 18, 9, LILAC, 4, "curtain tie"),
    rect("tie-right", 320, 137, 18, 9, LILAC, 4, "curtain tie"),
    rect("sill", 48, 252, 304, 14, STONE, 4, "window sill"),
    ellipse("rug", 214, 345, 150, 34, ROSE, undefined, "soft rug"),
    ellipse("cushion", 224, 297, 108, 42, LILAC, undefined, "cushion"),
    ellipse("cat-body", 234, 276, 88, 43, PAPER, undefined, "sleeping cat"),
    path("cat-tail", "M 306 281 C 336 278 342 309 315 314 C 299 317 294 304 304 299 C 312 295 322 300 318 306", PAPER, undefined, "cat tail"),
    circle("cat-head", 148, 261, 37, PAPER, "cat head"),
    poly("ear-left", "122,238 126,208 148,232", ROSE, undefined, "cat ear"),
    poly("ear-right", "158,231 180,211 179,243", ROSE, undefined, "cat ear"),
    ellipse("paw-1", 194, 304, 20, 10, PAPER, undefined, "front paw"),
    ellipse("paw-2", 226, 308, 19, 9, PAPER, undefined, "front paw"),
    ellipse("cheek", 131, 270, 9, 6, ROSE, undefined, "cheek"),
    path("plant-pot", "M 338 294 L 378 294 L 372 334 L 344 334 Z", STONE, undefined, "flower pot"),
    leaf("plant-leaf-1", 356, 292, 205, 0.6),
    leaf("plant-leaf-2", 362, 292, -25, 0.55),
    leaf("plant-leaf-3", 358, 290, 270, 0.5),
    rect("book-1", 18, 308, 62, 10, LILAC, 2, "book"),
    rect("book-2", 22, 318, 56, 9, SAGE_FILL(), 2, "book"),
    rect("book-3", 16, 327, 65, 10, ROSE, 2, "book"),
  ],
  details: [
    { d: "M 136 262 Q 144 269 152 262", width: 2 },
    { d: "M 121 268 L 103 264 M 121 273 L 104 275" },
    { d: "M 170 267 L 187 263 M 170 272 L 187 275" },
    { d: "M 317 282 L 325 279 M 320 289 L 330 289", opacity: 0.6 },
  ],
  notes: [
    { regionId: "cat-head", text: "the calm the silence." },
    { regionId: "rug", text: "breathe beautiful. i'm fluent in silence." },
    { regionId: "book-2", text: "i wanna sleep for 15 hours rn." },
  ],
};

function SAGE_FILL() {
  return "#e7eee0";
}

const nightSky: Illustration = {
  id: "night-sky",
  title: "A quiet night",
  subtitle: "you're my 1:11",
  regions: [
    rect("night-sky", 0, 0, 400, 400, SKY, undefined, "night sky"),
    path("moon", "M 246 58 A 65 65 0 1 0 311 123 A 49 49 0 1 1 246 58 Z", WARM, undefined, "crescent moon"),
    star("star-1", 78, 72, 9),
    star("star-2", 128, 115, 5),
    star("star-3", 353, 91, 7),
    star("star-4", 322, 162, 5),
    star("star-5", 62, 173, 6),
    star("star-6", 188, 53, 5),
    star("star-7", 290, 215, 4),
    star("star-8", 112, 46, 4),
    star("star-9", 368, 144, 4),
    star("star-10", 222, 106, 4),
    cloud("night-cloud-1", 44, 128, 0.8),
    cloud("night-cloud-2", 268, 44, 0.65),
    path("hill-far", "M 0 292 Q 100 256 202 292 Q 302 325 400 280 L 400 400 L 0 400 Z", LILAC, undefined, "distant hill"),
    path("hill-near", "M 0 340 Q 110 306 220 340 Q 320 370 400 332 L 400 400 L 0 400 Z", "#e9eee4", undefined, "meadow"),
    rect("tiny-house-body", 136, 266, 78, 62, WARM, 2, "little house"),
    poly("tiny-house-roof", "126,269 175,230 224,269", ROSE, undefined, "little roof"),
    rect("tiny-window", 153, 282, 20, 20, SKY, 2, "lit window"),
    path("tiny-door", "M 185 328 L 185 299 Q 185 289 194 289 Q 203 289 203 299 L 203 328 Z", STONE, undefined, "little door"),
    rect("tree-trunk", 292, 290, 10, 45, STONE, 3, "tree trunk"),
    circle("tree-crown-1", 297, 273, 27, LEAF, "tree crown"),
    circle("tree-crown-2", 277, 288, 20, LEAF, "tree crown"),
    circle("tree-crown-3", 316, 288, 19, LEAF, "tree crown"),
    ellipse("pond", 92, 362, 55, 17, SKY, undefined, "pond"),
    ...flower("night-f1", 52, 348, 10, 5, 0),
    ...flower("night-f2", 219, 367, 10, 5, 20),
    ...flower("night-f3", 356, 361, 10, 5, 0),
  ],
  details: [
    { d: "M 75 360 Q 92 353 108 360", opacity: 0.6 },
    { d: "M 81 368 Q 96 362 112 369", opacity: 0.5 },
  ],
  notes: [
    { regionId: "moon", text: "i think 11:11s are overrated so yes nolan you're my 1:11" },
    { regionId: "tiny-window", text: "time works beautifully around you" },
    { regionId: "star-5", text: "we're the people to tune in at 1am" },
  ],
};

const butterflyGarden: Illustration = {
  id: "butterfly-garden",
  title: "Butterfly garden",
  subtitle: "a place with you",
  regions: [
    rect("sky", 0, 0, 400, 400, SKY, undefined, "sky"),
    circle("sun", 54, 62, 26, WARM, "sun"),
    cloud("cloud-1", 148, 48, 0.85),
    cloud("cloud-2", 296, 82, 0.7),
    path("hill-back", "M 0 278 Q 110 244 210 280 Q 310 314 400 272 L 400 400 L 0 400 Z", LEAF, undefined, "green hill"),
    path("hill-front", "M 0 336 Q 130 305 240 340 Q 330 368 400 330 L 400 400 L 0 400 Z", "#eaf1e3", undefined, "meadow"),
    rect("fence-top", 14, 266, 372, 8, STONE, 3, "garden fence"),
    rect("fence-bottom", 14, 292, 372, 8, STONE, 3, "garden fence"),
    rect("post-1", 22, 258, 10, 54, STONE, 3, "fence post"),
    rect("post-2", 104, 258, 10, 54, STONE, 3, "fence post"),
    rect("post-3", 186, 258, 10, 54, STONE, 3, "fence post"),
    rect("post-4", 268, 258, 10, 54, STONE, 3, "fence post"),
    rect("post-5", 350, 258, 10, 54, STONE, 3, "fence post"),
    ellipse("step-1", 200, 318, 32, 9, STONE, undefined, "garden stone"),
    ellipse("step-2", 178, 348, 28, 8, STONE, undefined, "garden stone"),
    ellipse("step-3", 224, 380, 30, 8, STONE, undefined, "garden stone"),
    ...flower("bf-1", 62, 340, 15, 5, 0),
    ...flower("bf-2", 126, 372, 14, 5, 15),
    ...flower("bf-3", 322, 345, 15, 5, 0),
    ...flower("bf-4", 368, 378, 13, 5, 20),
    leaf("garden-leaf-1", 96, 356, 195, 0.7),
    leaf("garden-leaf-2", 292, 360, -15, 0.7),
    ellipse("butterfly-1-wing-a", 142, 142, 19, 25, ROSE, "rotate(-28 142 142)", "butterfly wing"),
    ellipse("butterfly-1-wing-b", 182, 142, 19, 25, LILAC, "rotate(28 182 142)", "butterfly wing"),
    ellipse("butterfly-1-wing-c", 148, 177, 14, 17, LILAC, "rotate(-20 148 177)", "butterfly wing"),
    ellipse("butterfly-1-wing-d", 176, 177, 14, 17, ROSE, "rotate(20 176 177)", "butterfly wing"),
    ellipse("butterfly-1-body", 162, 161, 5, 25, WARM, undefined, "butterfly body"),
    circle("butterfly-1-head", 162, 135, 6, WARM, "butterfly head"),
    ellipse("butterfly-2-wing-a", 272, 190, 14, 19, SKY, "rotate(-30 272 190)", "butterfly wing"),
    ellipse("butterfly-2-wing-b", 300, 190, 14, 19, WARM, "rotate(30 300 190)", "butterfly wing"),
    ellipse("butterfly-2-wing-c", 276, 214, 10, 13, WARM, "rotate(-20 276 214)", "butterfly wing"),
    ellipse("butterfly-2-wing-d", 296, 214, 10, 13, SKY, "rotate(20 296 214)", "butterfly wing"),
    ellipse("butterfly-2-body", 286, 202, 4, 19, STONE, undefined, "butterfly body"),
    circle("butterfly-2-head", 286, 181, 4.5, STONE, "butterfly head"),
    rect("tree-trunk", 344, 196, 14, 82, STONE, 4, "tree trunk"),
    circle("tree-crown-1", 351, 174, 36, LEAF, "tree crown"),
    circle("tree-crown-2", 328, 190, 26, LEAF, "tree crown"),
    circle("tree-crown-3", 374, 192, 25, LEAF, "tree crown"),
  ],
  details: [
    { d: "M 158 129 Q 150 116 144 113 M 166 129 Q 174 116 180 113" },
    { d: "M 283 177 Q 276 167 271 166 M 289 177 Q 296 167 301 166" },
  ],
  notes: [
    { regionId: "butterfly-1-body", text: "home. beach. library. supermarket. a place with you." },
    { regionId: "step-2", text: "Gariahat ka galliya it makes me happy" },
  ],
};

const bedroom: Illustration = {
  id: "bedroom",
  title: "A cozy corner",
  subtitle: "our jacket, our quiet",
  regions: [
    rect("wall", 0, 0, 400, 400, WARM, undefined, "wall"),
    path("floor", "M 0 300 L 400 300 L 400 400 L 0 400 Z", STONE, undefined, "floor"),
    rect("picture-frame", 44, 56, 72, 60, STONE, 3, "picture frame"),
    rect("picture-inner", 51, 63, 58, 46, LILAC, 2, "picture"),
    circle("picture-sun", 91, 77, 9, WARM, "picture sun"),
    path("picture-hill", "M 51 101 Q 72 88 91 101 Q 103 109 109 102 L 109 109 L 51 109 Z", LEAF, undefined, "picture hill"),
    rect("window-frame", 206, 42, 152, 134, STONE, 6, "window frame"),
    rect("window-glass", 216, 52, 132, 114, SKY, 3, "window glass"),
    rect("pane-1", 218, 54, 64, 55, SKY, 2, "window pane"),
    rect("pane-2", 282, 54, 64, 55, SKY, 2, "window pane"),
    rect("pane-3", 218, 109, 64, 55, SKY, 2, "window pane"),
    rect("pane-4", 282, 109, 64, 55, SKY, 2, "window pane"),
    cloud("bedroom-cloud", 290, 68, 0.5),
    path("curtain-left", "M 206 42 C 228 52 230 104 218 150 C 214 166 209 174 206 178 Z", ROSE, undefined, "curtain"),
    path("curtain-right", "M 358 42 C 336 52 334 104 346 150 C 350 166 355 174 358 178 Z", ROSE, undefined, "curtain"),
    rect("headboard", 30, 168, 210, 92, LILAC, 12, "headboard"),
    rect("mattress", 22, 232, 226, 66, PAPER, 8, "mattress"),
    path("blanket", "M 22 262 Q 110 246 248 264 L 248 300 Q 120 288 22 302 Z", SAGE_FILL(), undefined, "blanket"),
    path("blanket-fold", "M 22 262 Q 110 246 248 264 L 248 274 Q 110 256 22 273 Z", LEAF, undefined, "blanket fold"),
    ellipse("pillow-1", 76, 229, 48, 20, PAPER, "rotate(-6 76 229)", "pillow"),
    ellipse("pillow-2", 158, 229, 48, 20, PAPER, "rotate(5 158 229)", "pillow"),
    ellipse("rug", 168, 352, 138, 28, ROSE, undefined, "rug"),
    rect("nightstand", 268, 250, 88, 74, STONE, 5, "bedside table"),
    rect("drawer", 276, 266, 72, 24, WARM, 3, "drawer"),
    circle("drawer-knob", 312, 278, 4, STONE, "drawer knob"),
    rect("lamp-stem", 306, 210, 8, 42, STONE, 2, "lamp stem"),
    path("lamp-shade", "M 286 210 L 334 210 L 326 180 L 294 180 Z", butterFill(), undefined, "lamp shade"),
    rect("book-a", 276, 322, 56, 9, LILAC, 2, "book"),
    rect("book-b", 282, 331, 50, 9, ROSE, 2, "book"),
    path("plant-pot", "M 342 316 L 378 316 L 372 348 L 348 348 Z", STONE, undefined, "plant pot"),
    leaf("bed-leaf-1", 354, 314, 205, 0.55),
    leaf("bed-leaf-2", 362, 313, -25, 0.5),
    leaf("bed-leaf-3", 358, 311, 270, 0.45),
  ],
  details: [
    { d: "M 312 278 L 312 286", opacity: 0.6 },
    { d: "M 64 207 Q 80 214 96 207 M 146 207 Q 162 214 178 207", opacity: 0.6 },
  ],
  notes: [
    { regionId: "pillow-1", text: "#meinurjacket. while we game." },
    { regionId: "book-a", text: "where are the days we read harry potter to sleep guys" },
    { regionId: "blanket", text: "and curl under a blanket." },
  ],
};

function butterFill() {
  return "#f8e9cd";
}

const vaseTable: Illustration = {
  id: "vase-table",
  title: "Flowers on the table",
  subtitle: "cranberry coffee & chocolate",
  regions: [
    rect("wall", 0, 0, 400, 400, WARM, undefined, "wall"),
    rect("table-top", 0, 306, 400, 16, STONE, undefined, "table top"),
    path("table-cloth", "M 24 322 Q 200 340 376 322 L 366 400 L 34 400 Z", PAPER, undefined, "table cloth"),
    path("vase-body", "M 160 194 C 146 220 142 258 158 292 Q 200 306 242 292 C 258 258 254 220 240 194 Z", SKY, undefined, "vase"),
    rect("vase-neck", 182, 168, 36, 30, SKY, 3, "vase neck"),
    ellipse("vase-rim", 200, 168, 27, 9, PAPER, undefined, "vase rim"),
    path("vase-band", "M 155 254 Q 200 268 245 254 L 247 266 Q 200 280 153 266 Z", LILAC, undefined, "vase band"),
    path("stem-1", "M 197 170 C 186 140 160 116 128 100 L 132 95 C 166 110 192 138 203 169 Z", LEAF, undefined, "stem"),
    path("stem-2", "M 200 170 C 196 130 202 96 204 66 L 210 66 C 208 100 205 134 205 170 Z", LEAF, undefined, "stem"),
    path("stem-3", "M 204 170 C 216 138 242 114 274 102 L 277 108 C 246 122 220 145 209 170 Z", LEAF, undefined, "stem"),
    path("stem-4", "M 199 171 C 184 152 175 138 166 124 L 171 120 C 182 134 194 150 205 169 Z", LEAF, undefined, "stem"),
    leaf("vase-leaf-1", 173, 197, 195, 0.7),
    leaf("vase-leaf-2", 226, 199, -15, 0.7),
    leaf("vase-leaf-3", 185, 158, 170, 0.6),
    leaf("vase-leaf-4", 221, 155, 10, 0.6),
    ...flower("vf-1", 126, 96, 27, 6, 0),
    ...flower("vf-2", 204, 66, 31, 6, 20),
    ...flower("vf-3", 277, 104, 27, 6, 0),
    ...flower("vf-4", 164, 121, 20, 5, 0),
    rect("table-book-1", 30, 289, 92, 12, ROSE, 3, "book"),
    rect("table-book-2", 36, 301, 84, 11, LILAC, 3, "book"),
    path("candle", "M 314 274 L 346 274 L 342 306 L 318 306 Z", PAPER, undefined, "candle"),
    ellipse("candle-top", 330, 274, 16, 5, WARM, undefined, "candle top"),
    path("flame", "M 330 270 C 320 261 330 249 330 242 C 338 251 340 261 330 270 Z", WARM, undefined, "candle flame"),
    rect("small-frame", 56, 176, 62, 72, STONE, 3, "little frame"),
    rect("small-frame-inner", 62, 182, 50, 60, SKY, 2, "little picture"),
    circle("frame-moon", 94, 199, 10, WARM, "little moon"),
    star("frame-star", 75, 217, 5),
  ],
  notes: [
    { regionId: "vase-body", text: "Chilli oil is my favorite type of emotion" },
    { regionId: "flame", text: "yk i used to hv chocolate before every test as a tradition?" },
    { regionId: "table-book-1", text: "ugh dont make me crave starmarks" },
  ],
};

const housePath: Illustration = {
  id: "house-path",
  title: "The little house",
  subtitle: "home. library. a place with you.",
  regions: [
    rect("sky", 0, 0, 400, 400, SKY, undefined, "sky"),
    circle("sun", 72, 70, 27, WARM, "sun"),
    cloud("cloud-1", 150, 52, 0.8),
    cloud("cloud-2", 274, 88, 0.7),
    path("hill-back", "M 0 280 Q 100 250 200 282 Q 310 316 400 276 L 400 400 L 0 400 Z", LEAF, undefined, "hill"),
    path("lawn", "M 0 330 Q 120 300 240 336 Q 330 362 400 328 L 400 400 L 0 400 Z", "#eaf1e3", undefined, "lawn"),
    rect("house-body", 116, 166, 168, 148, WARM, 4, "house wall"),
    poly("roof", "102,170 200,90 298,170", ROSE, undefined, "roof"),
    rect("chimney", 246, 106, 20, 44, STONE, 2, "chimney"),
    rect("attic-window", 190, 132, 20, 20, SKY, 10, "attic window"),
    path("door", "M 182 314 L 182 244 Q 182 224 200 224 Q 218 224 218 244 L 218 314 Z", LILAC, undefined, "front door"),
    circle("door-knob", 209, 274, 3.5, WARM, "door knob"),
    rect("window-left", 132, 200, 42, 44, PAPER, 3, "window"),
    rect("window-right", 226, 200, 42, 44, PAPER, 3, "window"),
    rect("pane-l-1", 135, 203, 18, 19, SKY, 1, "pane"),
    rect("pane-l-2", 153, 203, 18, 19, SKY, 1, "pane"),
    rect("pane-l-3", 135, 222, 18, 19, SKY, 1, "pane"),
    rect("pane-l-4", 153, 222, 18, 19, SKY, 1, "pane"),
    rect("pane-r-1", 229, 203, 18, 19, SKY, 1, "pane"),
    rect("pane-r-2", 247, 203, 18, 19, SKY, 1, "pane"),
    rect("pane-r-3", 229, 222, 18, 19, SKY, 1, "pane"),
    rect("pane-r-4", 247, 222, 18, 19, SKY, 1, "pane"),
    path("awning", "M 124 274 L 276 274 L 266 288 L 134 288 Z", SAGE_FILL(), undefined, "little awning"),
    rect("fence-l-1", 12, 292, 9, 48, STONE, 3, "fence post"),
    rect("fence-l-2", 46, 292, 9, 48, STONE, 3, "fence post"),
    rect("fence-l-3", 80, 292, 9, 48, STONE, 3, "fence post"),
    rect("fence-r-1", 312, 292, 9, 48, STONE, 3, "fence post"),
    rect("fence-r-2", 346, 292, 9, 48, STONE, 3, "fence post"),
    rect("fence-l-rail", 8, 304, 85, 7, STONE, 3, "fence rail"),
    rect("fence-r-rail", 308, 304, 52, 7, STONE, 3, "fence rail"),
    ellipse("stone-1", 200, 334, 25, 8, STONE, undefined, "path stone"),
    ellipse("stone-2", 181, 356, 23, 7, STONE, undefined, "path stone"),
    ellipse("stone-3", 218, 376, 24, 7, STONE, undefined, "path stone"),
    ellipse("stone-4", 190, 396, 26, 7, STONE, undefined, "path stone"),
    rect("tree-trunk", 330, 228, 13, 78, STONE, 4, "tree trunk"),
    circle("tree-crown-1", 336, 206, 33, LEAF, "tree crown"),
    circle("tree-crown-2", 313, 222, 24, LEAF, "tree crown"),
    circle("tree-crown-3", 359, 223, 23, LEAF, "tree crown"),
    ...flower("hp-f1", 48, 364, 13, 5, 0),
    ...flower("hp-f2", 92, 380, 12, 5, 20),
    ...flower("hp-f3", 300, 365, 13, 5, 0),
    ...flower("hp-f4", 366, 379, 12, 5, 20),
  ],
  details: [
    { d: "M 258 108 C 248 96 264 86 256 74 C 250 65 262 58 258 50", opacity: 0.5 },
  ],
  notes: [
    { regionId: "attic-window", text: "You are at my house / And are my home" },
    { regionId: "stone-2", text: "stay happy happy" },
  ],
};

function bookSpines(prefix: string, x: number, y: number, count: number, totalWidth: number, height: number): Region[] {
  const fills = [ROSE, SKY, LILAC, WARM, LEAF, STONE];
  const widths = Array.from({ length: count }, (_, index) => 12 + ((index * 7) % 9));
  const sum = widths.reduce((total, width) => total + width, 0);
  let cursor = x;
  return widths.map((width, index) => {
    const adjusted = (width / sum) * totalWidth;
    const region = rect(
      `${prefix}-book-${index}`,
      cursor,
      y + (index % 3 === 0 ? 3 : 0),
      adjusted - 2,
      height - (index % 3 === 0 ? 3 : 0),
      fills[index % fills.length],
      1.5,
      "book spine",
    );
    cursor += adjusted;
    return region;
  });
}

function waveform(prefix: string, startX: number, y: number, count: number): Region[] {
  return Array.from({ length: count }, (_, index) => {
    const height = 8 + Math.abs(Math.sin(index * 0.7)) * 42 + (index % 5) * 4;
    return rect(
      `${prefix}-bar-${index}`,
      startX + index * 9,
      y - height / 2,
      5,
      height,
      index % 4 === 0 ? ROSE : index % 3 === 0 ? SKY : LILAC,
      2.5,
      "waveform bar",
    );
  });
}

function fairyLights(prefix: string, count: number, y: number): Region[] {
  return Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const x = 16 + progress * 368;
    const sag = y + Math.sin(progress * Math.PI) * 18;
    return circle(`${prefix}-light-${index}`, x, sag, 4.5, index % 3 === 0 ? "#f6dfa9" : "#fff3d8", "fairy light");
  });
}

const waxLetter: Illustration = {
  id: "wax-letter",
  title: "A letter with a flower seal",
  subtitle: "and with each we'd seal a flower",
  regions: [
    rect("desk", 0, 0, 400, 400, WARM, undefined, "old desk"),
    circle("coffee-ring-outer", 342, 74, 27, "#e6d2b7", "coffee ring"),
    circle("coffee-ring-inner", 342, 74, 20, WARM, "coffee ring centre"),
    rect("letter-paper", 54, 58, 274, 248, PAPER, 3, "handmade letter paper"),
    path("paper-edge", "M 54 286 L 328 286 L 322 306 L 60 306 Z", STONE, undefined, "deckled paper edge"),
    path("ribbon-left", "M 74 82 C 104 100 128 102 152 88 L 148 98 C 124 112 100 110 72 92 Z", LILAC, undefined, "ribbon"),
    path("ribbon-right", "M 326 82 C 296 100 272 102 248 88 L 252 98 C 276 112 300 110 328 92 Z", LILAC, undefined, "ribbon"),
    path("pressed-stem", "M 128 206 C 124 183 126 166 128 150 L 132 150 C 132 168 131 185 133 206 Z", LEAF, undefined, "pressed stem"),
    leaf("pressed-leaf-1", 126, 184, 190, 0.55),
    leaf("pressed-leaf-2", 130, 194, -20, 0.5),
    ...flower("pressed", 130, 143, 19, 6, 0),
    rect("stamp-block-1", 60, 222, 28, 26, "#e8cfae", 2, "typography stamp"),
    rect("stamp-block-2", 95, 222, 28, 26, "#d9c9ad", 2, "typography stamp"),
    rect("stamp-block-3", 60, 256, 28, 26, "#e5d2b4", 2, "typography stamp"),
    rect("stamp-block-4", 95, 256, 28, 26, "#d6c7ab", 2, "typography stamp"),
    circle("stamp-knob-1", 74, 218, 5, STONE, "stamp knob"),
    circle("stamp-knob-2", 109, 218, 5, STONE, "stamp knob"),
    circle("stamp-knob-3", 74, 252, 5, STONE, "stamp knob"),
    circle("stamp-knob-4", 109, 252, 5, STONE, "stamp knob"),
    rect("envelope", 224, 246, 146, 92, "#f6e9d2", 3, "envelope"),
    path("envelope-flap", "M 224 246 L 297 292 L 370 246 Z", PAPER, undefined, "envelope flap"),
    circle("envelope-clasp", 297, 276, 6, WARM, "envelope clasp"),
    circle("wax-seal", 200, 252, 29, "#c98f8b", "wax seal"),
    path("wax-drip-1", "M 181 272 C 180 284 186 288 190 280 Z", "#c98f8b", undefined, "wax drip"),
    path("wax-drip-2", "M 211 273 C 213 285 220 287 220 277 Z", "#c98f8b", undefined, "wax drip"),
    ...flower("seal-daisy", 200, 252, 11, 8, 12),
    circle("seal-centre-dot", 200, 252, 3.5, "#f5dfa6", "seal detail"),
    path("pen-nib", "M 306 130 L 320 118 L 333 134 L 314 148 Z", STONE, undefined, "fountain pen nib"),
    path("pen-barrel", "M 314 148 L 333 134 L 366 96 L 372 104 L 337 146 Z", "#5d6b78", undefined, "fountain pen barrel"),
    rect("pen-cap", 356, 86, 30, 12, "#4f5d69", 4, "pen cap"),
    path("pen-clip", "M 370 93 L 390 88 L 389 94 L 371 99 Z", "#8fa0ad", undefined, "pen clip"),
    circle("pen-nib-tip", 311, 143, 3, "#4a4139", "pen tip"),
    rect("ink-bottle", 278, 158, 46, 40, SKY, 5, "ink bottle"),
    rect("ink-lid", 288, 150, 26, 10, "#5d6b78", 3, "ink lid"),
    ellipse("ink-window", 301, 180, 13, 9, "#6c7d99", undefined, "ink window"),
    ellipse("petal-1", 173, 92, 8, 4, ROSE, "rotate(22 173 92)", "loose petal"),
    ellipse("petal-2", 242, 112, 7, 4, LILAC, "rotate(-18 242 112)", "loose petal"),
    ellipse("petal-3", 288, 188, 8, 4, ROSE, "rotate(40 288 188)", "loose petal"),
    ellipse("petal-4", 64, 170, 7, 4, LILAC, "rotate(-30 64 170)", "loose petal"),
    ellipse("petal-5", 344, 216, 7, 4, ROSE, "rotate(15 344 216)", "loose petal"),
    ...flower("corner-flower-1", 22, 24, 11, 5, 0),
    ...flower("corner-flower-2", 380, 350, 11, 5, 20),
    ...flower("corner-flower-3", 24, 372, 10, 5, 0),
  ],
  details: [
    { d: "M 74 112 C 130 104 190 106 244 100 M 74 130 C 150 122 212 126 286 118 M 74 148 C 140 142 190 146 244 140" , opacity: 0.55 },
    { d: "M 148 190 C 190 186 232 190 276 184 M 148 208 C 186 204 222 206 260 202", opacity: 0.45 },
    { d: "M 28 348 C 110 336 180 344 254 334", opacity: 0.35 },
    { d: "M 60 306 L 340 306" },
  ],
  notes: [
    { regionId: "wax-seal", text: "we used to send letters with wax seals? and with each we'd seal a flower." },
    { regionId: "seal-daisy-center", text: "i love love your notes even more / and i love love your stanzas even more" },
    { regionId: "letter-paper", text: "one chapter's yours one chapter's mine." },
    { regionId: "ink-bottle", text: "all my therapy." },
  ],
};

const fivePlaces: Illustration = {
  id: "five-places",
  title: "Five places I love",
  subtitle: "home. beach. library. supermarket. a place with you.",
  regions: [
    rect("parchment", 0, 0, 400, 400, "#f9f3e5", undefined, "old map paper"),
    path("arch-1", "M 25 158 L 25 66 Q 75 28 125 66 L 125 158 Z", PAPER, undefined, "home vignette frame"),
    path("arch-2", "M 150 158 L 150 66 Q 200 28 250 66 L 250 158 Z", PAPER, undefined, "beach vignette frame"),
    path("arch-3", "M 275 158 L 275 66 Q 325 28 375 66 L 375 158 Z", PAPER, undefined, "library vignette frame"),
    path("arch-4", "M 88 376 L 88 284 Q 138 246 188 284 L 188 376 Z", PAPER, undefined, "market vignette frame"),
    path("arch-5", "M 213 376 L 213 284 Q 263 246 313 284 L 313 376 Z", PAPER, undefined, "together vignette frame"),
    rect("home-sky", 28, 70, 94, 84, SKY, 2, "home sky"),
    rect("home-body", 48, 112, 56, 42, WARM, 3, "little home"),
    poly("home-roof", "42,114 76,84 110,114", ROSE, undefined, "home roof"),
    rect("home-chimney", 90, 88, 9, 18, STONE, 2, "chimney"),
    path("home-door", "M 68 154 L 68 132 Q 68 124 76 124 Q 84 124 84 132 L 84 154 Z", LILAC, undefined, "home door"),
    rect("home-window", 96, 126, 14, 14, SKY, 2, "home window"),
    circle("home-heart", 76, 139, 2.5, ROSE, "little heart"),
    rect("beach-sky", 153, 70, 94, 84, SKY, 2, "beach sky"),
    circle("beach-sun", 228, 88, 12, WARM, "beach sun"),
    path("beach-sea", "M 153 124 Q 175 116 200 124 Q 224 132 247 123 L 247 154 L 153 154 Z", "#bcd8dd", undefined, "sea"),
    path("beach-sand", "M 153 144 Q 200 136 247 146 L 247 154 L 153 154 Z", "#f0dcb5", undefined, "sand"),
    path("beach-umbrella", "M 170 118 Q 188 94 208 118 Z", ROSE, undefined, "beach umbrella"),
    rect("beach-pole", 188, 116, 3, 30, STONE, 1, "umbrella pole"),
    ellipse("beach-shell", 218, 145, 9, 5, PAPER, "rotate(-15 218 145)", "shell"),
    rect("library-sky", 278, 70, 94, 84, WARM, 2, "library wall"),
    rect("library-shelf", 282, 134, 86, 6, STONE, 2, "bookshelf"),
    ...bookSpines("lib-1", 286, 106, 6, 78, 28),
    rect("library-ladder-left", 350, 84, 4, 66, STONE, 2, "ladder rail"),
    rect("library-ladder-right", 366, 84, 4, 66, STONE, 2, "ladder rail"),
    rect("library-rung-1", 350, 96, 20, 4, STONE, 2, "ladder rung"),
    rect("library-rung-2", 350, 112, 20, 4, STONE, 2, "ladder rung"),
    rect("library-rung-3", 350, 128, 20, 4, STONE, 2, "ladder rung"),
    ...flower("lib-flower", 296, 92, 9, 5, 0),
    rect("market-sky", 91, 288, 94, 84, SKY, 2, "market sky"),
    path("market-awning", "M 91 300 L 185 300 L 179 312 L 97 312 Z", ROSE, undefined, "market awning"),
    rect("market-awning-stripe-1", 108, 300, 12, 12, PAPER, 1, "awning stripe"),
    rect("market-awning-stripe-2", 136, 300, 12, 12, PAPER, 1, "awning stripe"),
    rect("market-awning-stripe-3", 164, 300, 12, 12, PAPER, 1, "awning stripe"),
    path("market-basket", "M 110 330 L 166 330 L 158 358 L 118 358 Z", "#d8c3a0", undefined, "market basket"),
    path("market-handle", "M 120 330 Q 138 310 156 330", "none", undefined, "basket handle"),
    circle("market-apple-1", 124, 324, 8, ROSE, "apple"),
    circle("market-apple-2", 142, 321, 8, "#7f9a72", "apple"),
    circle("market-apple-3", 158, 325, 8, WARM, "apple"),
    rect("market-bag", 168, 328, 14, 28, PAPER, 2, "paper bag"),
    rect("together-sky", 216, 288, 94, 84, SKY, 2, "together sky"),
    rect("chair-left-back", 226, 316, 28, 34, LILAC, 6, "chair"),
    ellipse("chair-left-seat", 240, 352, 20, 6, LILAC, undefined, "chair seat"),
    rect("chair-right-back", 278, 316, 28, 34, SKY, 6, "chair"),
    ellipse("chair-right-seat", 292, 352, 20, 6, SKY, undefined, "chair seat"),
    ellipse("small-table", 266, 348, 18, 6, STONE, undefined, "small table"),
    circle("mug-left", 257, 339, 6, WARM, "left mug"),
    circle("mug-right", 276, 339, 6, ROSE, "right mug"),
    ...flower("together-flower", 266, 322, 8, 5, 0),
    star("map-star-1", 16, 190, 5),
    star("map-star-2", 384, 190, 5),
    star("map-star-3", 200, 188, 6),
    circle("compass-outer", 200, 200, 12, STONE, "compass"),
    circle("compass-inner", 200, 200, 6, WARM, "compass centre"),
    ...flower("map-flower-1", 20, 386, 10, 5, 0),
    ...flower("map-flower-2", 380, 386, 10, 5, 20),
  ],
  details: [
    { d: "M 75 158 Q 110 178 138 158 M 200 158 Q 235 178 263 158 M 325 158 Q 355 178 388 158", dash: "4 6", opacity: 0.7 },
    { d: "M 138 158 Q 165 200 168 284 M 263 158 Q 280 200 266 284", dash: "4 6", opacity: 0.7 },
    { d: "M 188 376 Q 200 388 213 376", dash: "3 5", opacity: 0.6 },
  ],
  notes: [
    { regionId: "arch-5", text: "home. beach. library. supermarket. a place with you." },
    { regionId: "beach-sun", text: "home. beach. library. supermarket. a place with you." },
    { regionId: "library-shelf", text: "ugh dont make me crave starmarks" },
    { regionId: "together-flower-center", text: "You're more home than home can ever be." },
  ],
};

const oneEleven: Illustration = {
  id: "one-eleven",
  title: "1:11 and the small hours",
  subtitle: "time works beautifully around you",
  regions: [
    rect("night", 0, 0, 400, 400, "#eef0f7", undefined, "night sky"),
    path("moon", "M 278 48 A 44 44 0 1 0 322 92 A 33 33 0 1 1 278 48 Z", WARM, undefined, "moon"),
    ...[
      [40, 42, 6], [96, 64, 4], [150, 30, 5], [206, 58, 4], [252, 30, 6], [342, 36, 5],
      [380, 92, 4], [30, 132, 5], [118, 146, 4], [186, 112, 5], [236, 154, 4], [352, 146, 6],
      [62, 202, 4], [148, 186, 5], [214, 208, 4], [340, 198, 5], [44, 258, 4], [180, 242, 4],
    ].map(([x, y, r], index) => star(`hour-star-${index}`, x, y, r)),
    circle("dream-hoop", 76, 92, 42, PAPER, "dreamcatcher hoop"),
    circle("dream-inner", 76, 92, 35, SKY, "dreamcatcher web"),
    circle("dream-bead-1", 76, 50, 4, ROSE, "dreamcatcher bead"),
    circle("dream-bead-2", 49, 72, 4, LILAC, "dreamcatcher bead"),
    circle("dream-bead-3", 103, 72, 4, WARM, "dreamcatcher bead"),
    circle("dream-bead-4", 49, 112, 4, LILAC, "dreamcatcher bead"),
    circle("dream-bead-5", 103, 112, 4, ROSE, "dreamcatcher bead"),
    path("dream-feather-1", "M 76 128 C 64 142 66 160 76 174 C 86 160 88 142 76 128 Z", PAPER, undefined, "feather"),
    path("dream-feather-2", "M 60 124 C 46 134 44 150 52 164 C 62 152 66 138 60 124 Z", LILAC, undefined, "feather"),
    path("dream-feather-3", "M 92 124 C 106 134 108 150 100 164 C 90 152 86 138 92 124 Z", ROSE, undefined, "feather"),
    cloud("hour-cloud-1", 250, 128, 0.7),
    rect("chart-paper", 24, 236, 132, 122, PAPER, 3, "star chart"),
    rect("chart-inner", 30, 242, 120, 110, SKY, 2, "star chart paper"),
    ...[[44, 260], [72, 260], [100, 260], [128, 260], [44, 292], [72, 292], [100, 292], [128, 292], [44, 324], [72, 324], [100, 324], [128, 324]].map(([x, y], index) => circle(`chart-dot-${index}`, x, y, 2.4, ROSE, "chart star")),
    ...flower("chart-flower", 54, 338, 10, 5, 0),
    circle("clock-outer", 300, 274, 66, PAPER, "clock face"),
    circle("clock-inner", 300, 274, 57, WARM, "clock face inner"),
    ...Array.from({ length: 12 }, (_, index) => {
      const angle = (index / 12) * Math.PI * 2;
      return circle(`clock-tick-${index}`, 300 + Math.sin(angle) * 48, 274 - Math.cos(angle) * 48, index % 3 === 0 ? 3 : 2, STONE, "clock tick");
    }),
    path("clock-hand-hour", "M 298 274 L 298 240 L 302 240 L 302 274 Z", "#6d635b", undefined, "clock hour hand"),
    path("clock-hand-minute", "M 299 275 L 320 264 L 322 268 L 301 278 Z", "#6d635b", undefined, "clock minute hand"),
    circle("clock-pin", 300, 274, 4, ROSE, "clock pin"),
    rect("skyline-1", 0, 348, 46, 52, "#d8dbe8", 2, "city building"),
    rect("skyline-2", 50, 326, 38, 74, "#ccd0e0", 2, "city building"),
    rect("skyline-3", 92, 354, 52, 46, "#d8dbe8", 2, "city building"),
    rect("skyline-4", 150, 314, 36, 86, "#ccd0e0", 2, "city building"),
    rect("skyline-5", 192, 346, 54, 54, "#d8dbe8", 2, "city building"),
    rect("skyline-6", 250, 330, 44, 70, "#ccd0e0", 2, "city building"),
    rect("skyline-7", 300, 352, 48, 48, "#d8dbe8", 2, "city building"),
    rect("skyline-8", 354, 322, 46, 78, "#ccd0e0", 2, "city building"),
    ...Array.from({ length: 16 }, (_, index) => {
      const x = 12 + index * 24;
      return rect(`city-window-${index}`, x, index % 2 ? 364 : 344, 8, 10, index % 3 === 0 ? WARM : SKY, 1, "lit window");
    }),
    rect("balcony-rail", 0, 382, 400, 6, STONE, 2, "balcony rail"),
    rect("balcony-post-1", 28, 366, 7, 34, STONE, 2, "balcony post"),
    rect("balcony-post-2", 188, 366, 7, 34, STONE, 2, "balcony post"),
    rect("balcony-post-3", 348, 366, 7, 34, STONE, 2, "balcony post"),
    circle("mug-one", 214, 373, 8, ROSE, "first mug"),
    circle("mug-two", 240, 373, 8, SKY, "second mug"),
  ],
  details: [
    { d: "M 76 58 L 76 126 M 48 76 Q 76 100 104 76 M 48 108 Q 76 84 104 108 M 46 92 Q 76 72 106 92", opacity: 0.6 },
    { d: "M 128 64 L 150 78 L 186 112 L 214 208 M 236 154 L 186 112 L 252 30", dash: "4 5", opacity: 0.75 },
    { d: "M 30 248 L 150 248 M 30 280 L 150 280 M 30 312 L 150 312 M 90 242 L 90 352", opacity: 0.5 },
    { d: "M 214 365 Q 220 357 226 365 M 240 365 Q 246 357 252 365", opacity: 0.6 },
  ],
  notes: [
    { regionId: "moon", text: "i think 11:11s are overrated so yes nolan you're my 1:11" },
    { regionId: "clock-inner", text: "time works beautifully around you" },
    { regionId: "dream-inner", text: "they capture nightmares stupid child they go outside the door" },
    { regionId: "mug-one", text: "if u reach home before 12 can we vc at 11 59 so i wish u. first." },
  ],
};

const ourJacket: Illustration = {
  id: "our-jacket",
  title: "Our jacket, while we game",
  subtitle: "just, our jacket",
  regions: [
    rect("room-wall", 0, 0, 400, 400, WARM, undefined, "room wall"),
    path("room-floor", "M 0 306 L 400 306 L 400 400 L 0 400 Z", STONE, undefined, "floor"),
    ...fairyLights("jacket", 11, 24),
    circle("game-glow", 332, 178, 76, SKY, "screen glow"),
    rect("game-screen", 284, 118, 104, 76, "#54627a", 5, "game screen"),
    rect("game-screen-inner", 290, 124, 92, 64, SKY, 3, "game"),
    path("game-heart-1", "M 306 140 Q 300 132 306 128 Q 312 132 306 140 Z", ROSE, undefined, "pixel heart"),
    path("game-heart-2", "M 322 140 Q 316 132 322 128 Q 328 132 322 140 Z", ROSE, undefined, "pixel heart"),
    rect("game-bar", 300, 166, 68, 6, LILAC, 3, "game bar"),
    circle("game-star", 358, 142, 6, WARM, "game star"),
    rect("chair-back", 92, 88, 176, 186, "#b4a2b8", 22, "chair back"),
    ellipse("chair-seat", 180, 282, 104, 26, "#a493ac", undefined, "chair seat"),
    rect("chair-leg-1", 108, 292, 10, 42, STONE, 3, "chair leg"),
    rect("chair-leg-2", 244, 292, 10, 42, STONE, 3, "chair leg"),
    path("jacket-body", "M 122 124 C 108 166 104 228 112 274 Q 180 292 250 274 C 258 226 252 166 238 124 Z", "#8fa58f", undefined, "our jacket"),
    path("jacket-sleeve-left", "M 124 132 C 92 146 68 182 58 224 L 84 236 C 94 198 112 168 140 152 Z", "#8fa58f", undefined, "jacket sleeve"),
    path("jacket-sleeve-right", "M 236 132 C 268 146 292 182 302 224 L 276 236 C 266 198 248 168 220 152 Z", "#8fa58f", undefined, "jacket sleeve"),
    path("jacket-collar-left", "M 148 124 L 180 152 L 164 166 L 132 134 Z", "#7d947d", undefined, "jacket collar"),
    path("jacket-collar-right", "M 212 124 L 180 152 L 196 166 L 228 134 Z", "#7d947d", undefined, "jacket collar"),
    path("jacket-zip", "M 180 152 L 180 278", "none", undefined, "zipper"),
    rect("jacket-pocket-left", 124, 214, 34, 24, "#7d947d", 5, "jacket pocket"),
    rect("jacket-pocket-right", 202, 214, 34, 24, "#7d947d", 5, "jacket pocket"),
    circle("jacket-button-1", 180, 186, 4, WARM, "jacket button"),
    circle("jacket-button-2", 180, 216, 4, WARM, "jacket button"),
    circle("jacket-button-3", 180, 246, 4, WARM, "jacket button"),
    rect("jacket-label", 226, 258, 24, 12, PAPER, 2, "inside label"),
    ellipse("hand-left", 74, 230, 14, 9, "#f3d8c6", "rotate(-20 74 230)", "hand in sleeve"),
    ellipse("hand-right", 286, 230, 14, 9, "#f3d8c6", "rotate(20 286 230)", "hand in sleeve"),
    path("controller-left", "M 36 252 Q 54 236 74 252 L 72 274 Q 54 284 38 274 Z", PaperFill(), undefined, "controller"),
    circle("controller-left-dpad", 48, 258, 6, STONE, "controller button"),
    circle("controller-left-a", 64, 264, 5, ROSE, "controller button"),
    circle("controller-left-b", 58, 272, 4, LILAC, "controller button"),
    path("controller-right", "M 286 252 Q 306 236 326 252 L 324 274 Q 306 284 288 274 Z", PaperFill(), undefined, "controller"),
    circle("controller-right-dpad", 298, 258, 6, STONE, "controller button"),
    circle("controller-right-a", 314, 264, 5, SKY, "controller button"),
    circle("controller-right-b", 308, 272, 4, LILAC, "controller button"),
    rect("low-table", 16, 324, 368, 12, "#c2a88c", 4, "low table"),
    rect("table-leg-1", 40, 336, 12, 52, "#a88e73", 3, "table leg"),
    rect("table-leg-2", 348, 336, 12, 52, "#a88e73", 3, "table leg"),
    path("lamp-shade", "M 330 302 L 374 302 L 366 272 L 338 272 Z", WARM, undefined, "lamp shade"),
    rect("lamp-stem", 352, 302, 5, 22, STONE, 2, "lamp stem"),
    ellipse("lamp-base", 354, 324, 18, 5, STONE, undefined, "lamp base"),
    rect("snack-bowl", 108, 306, 60, 18, SKY, 9, "snack bowl"),
    circle("snack-1", 122, 304, 6, WARM, "snack"),
    circle("snack-2", 138, 302, 6, ROSE, "snack"),
    circle("snack-3", 152, 305, 6, LILAC, "snack"),
    rect("book-flat", 206, 310, 72, 12, LILAC, 3, "book"),
    ellipse("rug", 200, 372, 150, 24, ROSE, undefined, "rug"),
    path("blanket", "M 112 274 Q 180 300 250 274 L 262 310 Q 180 332 100 310 Z", LILAC, undefined, "blanket"),
    path("blanket-fold", "M 112 274 Q 180 300 250 274 L 252 284 Q 180 310 110 284 Z", PAPER, undefined, "blanket fold"),
    rect("plant-pot", 20, 294, 28, 30, STONE, 4, "plant pot"),
    leaf("jacket-leaf-1", 34, 294, 205, 0.5),
    leaf("jacket-leaf-2", 38, 294, -25, 0.45),
  ],
  details: [
    { d: "M 16 34 Q 200 62 384 34", opacity: 0.6 },
    { d: "M 180 152 L 180 278", opacity: 0.7 },
    { d: "M 226 264 L 248 264", opacity: 0.6 },
  ],
  notes: [
    { regionId: "jacket-label", text: "#meinurjacket. while we game." },
    { regionId: "jacket-body", text: "if you need a blanket, jacket, coverings lemme know" },
    { regionId: "controller-left", text: "digital circuits, yes or no" },
    { regionId: "game-star", text: "we record our losses to you, we treasure them" },
  ],
};

function PaperFill() {
  return "#f2eee6";
}

const voiceNotes: Illustration = {
  id: "voice-notes",
  title: "Twenty minutes of your voice",
  subtitle: "im gonna play this every night before i sleep",
  regions: [
    rect("wall", 0, 0, 400, 400, WARM, undefined, "wall"),
    rect("shelf", 0, 84, 400, 8, STONE, 2, "shelf"),
    rect("note-card", 58, 26, 284, 56, PAPER, 4, "handwritten card"),
    path("note-ribbon", "M 74 70 Q 200 58 326 70 L 326 78 Q 200 66 74 78 Z", ROSE, undefined, "card ribbon"),
    ...flower("note-flower", 88, 54, 10, 5, 0),
    rect("tape-body", 38, 130, 324, 180, "#d9d2c6", 16, "voice note tape"),
    rect("tape-face", 48, 140, 304, 160, PAPER, 12, "tape face"),
    circle("reel-left", 112, 192, 38, STONE, "left reel"),
    circle("reel-left-inner", 112, 192, 16, PAPER, "left reel centre"),
    circle("reel-right", 288, 192, 38, STONE, "right reel"),
    circle("reel-right-inner", 288, 192, 16, PAPER, "right reel centre"),
    path("tape-window", "M 132 176 Q 200 160 268 176 L 268 212 Q 200 196 132 212 Z", LILAC, undefined, "tape window"),
    rect("tape-label", 96, 238, 208, 36, "#f6e8c8", 5, "tape label"),
    ...waveform("wave", 66, 224, 30),
    circle("play-button", 92, 282, 13, "#8fa58f", "play button"),
    poly("play-triangle", "88,275 88,289 99,282", PAPER, undefined, "play symbol"),
    rect("pause-one", 190, 274, 8, 16, ROSE, 2, "pause button"),
    rect("pause-two", 204, 274, 8, 16, ROSE, 2, "pause button"),
    circle("heart-button", 310, 282, 13, ROSE, "favourite button"),
    circle("heart-dot", 310, 282, 4, PAPER, "heart button centre"),
    circle("screw-1", 56, 148, 3, STONE, "screw"),
    circle("screw-2", 344, 148, 3, STONE, "screw"),
    circle("screw-3", 56, 292, 3, STONE, "screw"),
    circle("screw-4", 344, 292, 3, STONE, "screw"),
    path("sound-arc-1", "M 24 172 Q 10 192 24 212", "none", undefined, "sound wave"),
    path("sound-arc-2", "M 16 164 Q -4 192 16 220", "none", undefined, "sound wave"),
    path("sound-arc-3", "M 376 172 Q 390 192 376 212", "none", undefined, "sound wave"),
    path("sound-arc-4", "M 384 164 Q 404 192 384 220", "none", undefined, "sound wave"),
    rect("mug-body", 166, 332, 54, 44, SKY, 8, "mug"),
    ellipse("mug-top", 193, 332, 27, 9, PAPER, undefined, "mug top"),
    path("mug-handle", "M 218 342 Q 240 342 236 358 Q 232 370 218 366", "none", undefined, "mug handle"),
    path("steam-1", "M 182 322 Q 174 308 184 296", "none", undefined, "steam"),
    path("steam-2", "M 202 322 Q 194 308 204 296", "none", undefined, "steam"),
    star("voice-star-1", 34, 108, 5),
    star("voice-star-2", 366, 108, 5),
    star("voice-star-3", 200, 112, 6),
    ...flower("voice-flower-1", 24, 380, 11, 5, 0),
    ...flower("voice-flower-2", 376, 380, 11, 5, 20),
  ],
  details: [
    { d: "M 112 154 L 112 230 M 74 192 L 150 192 M 288 154 L 288 230 M 250 192 L 326 192", opacity: 0.6 },
    { d: "M 104 254 L 296 254", opacity: 0.4 },
  ],
  notes: [
    { regionId: "tape-label", text: "we got 20 mins of your voice it makes our day 200000x better" },
    { regionId: "heart-button", text: "im gonna play this every night before i sleep" },
    { regionId: "mug-body", text: "Can I steal your voice for 5 instead" },
    { regionId: "play-button", text: "did i tell you i LOVE LOVE your voice btw" },
  ],
};

const homePerson: Illustration = {
  id: "home-person",
  title: "More home than home",
  subtitle: "with you we're never away from home",
  regions: [
    rect("dusk", 0, 0, 400, 400, LILAC, undefined, "dusk sky"),
    star("home-star-1", 44, 48, 5),
    star("home-star-2", 118, 34, 4),
    star("home-star-3", 286, 44, 5),
    star("home-star-4", 356, 66, 4),
    star("home-star-5", 66, 116, 4),
    circle("porch-moon", 340, 46, 22, WARM, "moon"),
    path("hill-back", "M 0 292 Q 100 264 200 292 Q 300 320 400 284 L 400 400 L 0 400 Z", "#d9ddcb", undefined, "hill"),
    rect("house-wall", 66, 116, 268, 230, "#f3e7d3", 3, "house wall"),
    poly("house-roof", "50,120 200,42 350,120", ROSE, undefined, "roof"),
    rect("house-chimney", 270, 70, 20, 42, STONE, 3, "chimney"),
    rect("window-left-frame", 88, 154, 52, 54, PAPER, 4, "window frame"),
    rect("window-right-frame", 260, 154, 52, 54, PAPER, 4, "window frame"),
    rect("window-left-glass", 92, 158, 44, 46, WARM, 3, "lit window"),
    rect("window-right-glass", 264, 158, 44, 46, WARM, 3, "lit window"),
    rect("pane-l-a", 92, 158, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-l-b", 115, 158, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-l-c", 92, 182, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-l-d", 115, 182, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-r-a", 264, 158, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-r-b", 287, 158, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-r-c", 264, 182, 21, 22, "#f6dea8", 1, "pane"),
    rect("pane-r-d", 287, 182, 21, 22, "#f6dea8", 1, "pane"),
    path("doorway", "M 166 346 L 166 234 Q 166 198 200 198 Q 234 198 234 234 L 234 346 Z", WARM, undefined, "glowing doorway"),
    path("door", "M 174 346 L 174 236 Q 174 208 200 208 Q 226 208 226 236 L 226 346 Z", "#d6a99a", undefined, "door"),
    circle("door-knob", 216, 282, 4, WARM, "door knob"),
    circle("porch-light-glow", 200, 188, 20, "#f3d899", "porch light glow"),
    circle("porch-light", 200, 188, 8, PAPER, "porch light"),
    rect("step", 158, 346, 84, 12, STONE, 4, "doorstep"),
    ellipse("doormat", 200, 366, 50, 12, "#c9bba0", undefined, "doormat"),
    ellipse("slipper-left", 174, 374, 14, 7, ROSE, "rotate(-12 174 374)", "left slipper"),
    ellipse("slipper-right", 222, 374, 14, 7, SKY, "rotate(12 222 374)", "right slipper"),
    circle("mug-left", 182, 358, 7, PAPER, "left mug"),
    circle("mug-right", 216, 358, 7, PAPER, "right mug"),
    rect("fence-rail-a", 0, 286, 66, 7, STONE, 3, "fence"),
    rect("fence-rail-b", 334, 286, 66, 7, STONE, 3, "fence"),
    ellipse("path-stone-1", 200, 388, 32, 8, STONE, undefined, "path stone"),
    ellipse("path-stone-2", 148, 392, 22, 6, STONE, undefined, "path stone"),
    ellipse("path-stone-3", 252, 392, 22, 6, STONE, undefined, "path stone"),
    path("vine", "M 82 340 C 76 296 78 250 84 206", "none", undefined, "climbing vine"),
    ...[
      [80, 320, 195], [84, 300, -15], [80, 280, 185], [86, 260, -25], [82, 240, 190], [86, 220, -20],
    ].map(([x, y, rotation], index) => leaf(`home-vine-leaf-${index}`, x, y, rotation, 0.5)),
    ...flower("home-vine-flower-1", 80, 268, 9, 5, 0),
    ...flower("home-vine-flower-2", 86, 226, 9, 5, 20),
    rect("plant-pot-left", 20, 320, 30, 36, STONE, 4, "plant pot"),
    rect("plant-pot-right", 350, 320, 30, 36, STONE, 4, "plant pot"),
    leaf("home-pot-leaf-1", 34, 320, 205, 0.6),
    leaf("home-pot-leaf-2", 40, 320, -25, 0.55),
    leaf("home-pot-leaf-3", 364, 320, 205, 0.6),
    leaf("home-pot-leaf-4", 370, 320, -25, 0.55),
    rect("lantern-hook", 196, 168, 8, 20, STONE, 3, "lantern hook"),
    path("lantern-top", "M 190 186 L 210 186 L 206 194 L 194 194 Z", STONE, undefined, "lantern"),
    path("lantern-glass", "M 194 194 L 206 194 L 208 216 L 192 216 Z", WARM, undefined, "lantern glass"),
  ],
  details: [
    { d: "M 84 206 C 76 168 82 140 80 112", opacity: 0.5 },
    { d: "M 174 346 Q 200 336 226 346", opacity: 0.6 },
  ],
  notes: [
    { regionId: "doorway", text: "You are at my house / And are my home" },
    { regionId: "door", text: "You're more home than home can ever be." },
    { regionId: "slipper-left", text: "with you we're never away from home" },
    { regionId: "porch-light", text: "You're home you're comfort" },
  ],
};

const libraryCafe: Illustration = {
  id: "library-cafe",
  title: "A library café afternoon",
  subtitle: "good food, good books, quiet company",
  regions: [
    rect("wall", 0, 0, 400, 400, "#f7eddc", undefined, "café wall"),
    path("floor", "M 0 310 L 400 310 L 400 400 L 0 400 Z", STONE, undefined, "floor"),
    rect("window-frame", 22, 40, 108, 116, STONE, 6, "window frame"),
    rect("window-glass", 30, 48, 92, 100, SKY, 3, "window"),
    rect("pane-1", 32, 50, 44, 48, SKY, 2, "pane"),
    rect("pane-2", 76, 50, 44, 48, SKY, 2, "pane"),
    rect("pane-3", 32, 98, 44, 48, SKY, 2, "pane"),
    rect("pane-4", 76, 98, 44, 48, SKY, 2, "pane"),
    cloud("cafe-cloud", 52, 64, 0.5),
    path("curtain-left", "M 22 40 C 42 50 44 96 32 130 C 28 146 24 154 22 158 Z", ROSE, undefined, "curtain"),
    path("curtain-right", "M 130 40 C 110 50 108 96 120 130 C 124 146 128 154 130 158 Z", ROSE, undefined, "curtain"),
    rect("shelf-unit", 148, 36, 234, 210, "#c7ac8e", 5, "bookshelf"),
    rect("shelf-1", 154, 86, 222, 7, STONE, 2, "shelf"),
    rect("shelf-2", 154, 138, 222, 7, STONE, 2, "shelf"),
    rect("shelf-3", 154, 190, 222, 7, STONE, 2, "shelf"),
    rect("shelf-4", 154, 238, 222, 7, STONE, 2, "shelf"),
    ...bookSpines("cafe-shelf-1", 158, 54, 8, 214, 32),
    ...bookSpines("cafe-shelf-2", 158, 106, 8, 214, 32),
    ...bookSpines("cafe-shelf-3", 158, 158, 8, 214, 32),
    ...bookSpines("cafe-shelf-4", 158, 206, 8, 214, 32),
    rect("ladder-left", 328, 96, 5, 146, STONE, 2, "ladder rail"),
    rect("ladder-right", 352, 96, 5, 146, STONE, 2, "ladder rail"),
    rect("ladder-rung-1", 328, 116, 29, 5, STONE, 2, "ladder rung"),
    rect("ladder-rung-2", 328, 148, 29, 5, STONE, 2, "ladder rung"),
    rect("ladder-rung-3", 328, 180, 29, 5, STONE, 2, "ladder rung"),
    rect("ladder-rung-4", 328, 212, 29, 5, STONE, 2, "ladder rung"),
    path("lamp-cord", "M 200 0 L 200 62", "none", undefined, "lamp cord"),
    path("lamp-shade", "M 178 104 L 222 104 L 212 64 L 188 64 Z", WARM, undefined, "hanging lamp"),
    ellipse("lamp-glow", 200, 122, 40, 12, "#f6e7bd", undefined, "lamp glow"),
    rect("table", 20, 296, 300, 12, "#b99672", 3, "café table"),
    rect("table-leg-1", 42, 308, 10, 74, "#a28263", 3, "table leg"),
    rect("table-leg-2", 288, 308, 10, 74, "#a28263", 3, "table leg"),
    path("book-left-page", "M 176 288 Q 200 276 220 288 L 220 300 Q 200 288 176 300 Z", PAPER, undefined, "open book page"),
    path("book-right-page", "M 220 288 Q 240 276 264 288 L 264 300 Q 240 288 220 300 Z", PAPER, undefined, "open book page"),
    path("book-spine", "M 218 288 L 222 288 L 222 300 L 218 300 Z", STONE, undefined, "book spine"),
    path("bookmark", "M 232 288 L 238 288 L 236 308 L 232 304 Z", ROSE, undefined, "ribbon bookmark"),
    rect("mug-a", 84, 270, 30, 26, SKY, 6, "first mug"),
    ellipse("mug-a-top", 99, 270, 15, 5, PAPER, undefined, "mug top"),
    path("mug-a-handle", "M 112 276 Q 126 276 124 286 Q 122 294 112 292", "none", undefined, "mug handle"),
    rect("mug-b", 272, 270, 30, 26, ROSE, 6, "second mug"),
    ellipse("mug-b-top", 287, 270, 15, 5, PAPER, undefined, "mug top"),
    path("mug-b-handle", "M 300 276 Q 314 276 312 286 Q 310 294 300 292", "none", undefined, "mug handle"),
    ellipse("pastry", 144, 294, 20, 9, "#e8c48e", undefined, "coffee cake"),
    path("pastry-fold", "M 130 292 Q 144 284 158 292", "none", undefined, "pastry fold"),
    rect("menu-board", 352, 152, 44, 70, "#5e6b63", 4, "menu board"),
    rect("menu-inner", 356, 156, 36, 62, "#7d8d7e", 2, "menu"),
    path("plant-pot", "M 338 316 L 376 316 L 370 352 L 344 352 Z", STONE, undefined, "plant pot"),
    leaf("cafe-leaf-1", 352, 316, 205, 0.6),
    leaf("cafe-leaf-2", 360, 314, -25, 0.55),
    leaf("cafe-leaf-3", 356, 312, 270, 0.5),
    rect("chair-back", 52, 318, 62, 70, LILAC, 16, "chair"),
    ellipse("chair-seat", 83, 366, 38, 10, LILAC, undefined, "chair seat"),
    ellipse("rug", 200, 380, 150, 18, ROSE, undefined, "rug"),
    star("cafe-star-1", 14, 168, 4),
    star("cafe-star-2", 386, 118, 4),
  ],
  details: [
    { d: "M 164 96 L 364 96 M 164 148 L 364 148 M 164 200 L 364 200 M 164 248 L 364 248", opacity: 0.35 },
    { d: "M 88 262 Q 82 250 90 240 M 108 262 Q 102 250 110 240", opacity: 0.6 },
    { d: "M 278 262 Q 272 250 280 240 M 298 262 Q 292 250 300 240", opacity: 0.6 },
  ],
  notes: [
    { regionId: "menu-board", text: "good food (u can never go wrong w good food okay!) cafes :)" },
    { regionId: "window-glass", text: "pack up a bag get out of there and go study in a library nearby" },
    { regionId: "book-left-page", text: "we wrote a poem after 2 yrs." },
    { regionId: "mug-a", text: "the answer lied in the reflection of your cranberry coffee." },
  ],
};

const sunflowers: Illustration = {
  id: "sunflowers",
  title: "Sunflowers, not every girl",
  subtitle: "maybe you gave sunflowers to every girl",
  regions: [
    rect("wall", 0, 0, 400, 400, WARM, undefined, "warm wall"),
    rect("table", 0, 316, 400, 14, STONE, undefined, "table"),
    path("table-cloth", "M 30 330 Q 200 344 370 330 L 360 400 L 40 400 Z", PAPER, undefined, "table cloth"),
    path("stem-one", "M 176 320 C 170 270 152 218 118 160 L 126 157 C 160 214 178 266 182 320 Z", LEAF, undefined, "sunflower stem"),
    path("stem-two", "M 198 320 C 196 258 198 196 200 132 L 207 132 C 206 198 204 260 204 320 Z", LEAF, undefined, "sunflower stem"),
    path("stem-three", "M 220 320 C 228 268 246 216 280 166 L 286 172 C 250 224 232 274 226 320 Z", LEAF, undefined, "sunflower stem"),
    leaf("sun-leaf-1", 164, 258, 200, 0.75),
    leaf("sun-leaf-2", 226, 260, -20, 0.75),
    leaf("sun-leaf-3", 148, 210, 190, 0.65),
    leaf("sun-leaf-4", 252, 214, -10, 0.65),
    leaf("sun-leaf-5", 180, 292, 210, 0.6),
    leaf("sun-leaf-6", 220, 296, -30, 0.6),
    ...flower("sunflower-left", 120, 146, 42, 16, 0, "#f5e2ad"),
    ...flower("sunflower-middle", 202, 112, 48, 16, 11, "#f6d99a"),
    ...flower("sunflower-right", 284, 156, 42, 16, 0, "#f5e2ad"),
    circle("seed-left", 120, 146, 12, "#9b7c4f", "sunflower seeds"),
    circle("seed-middle", 202, 112, 14, "#9b7c4f", "sunflower seeds"),
    circle("seed-right", 284, 156, 12, "#9b7c4f", "sunflower seeds"),
    ...[[120, 146, 6], [202, 112, 7], [284, 156, 6]].flatMap(([cx, cy, r], flowerIndex) =>
      Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return circle(`seed-dot-${flowerIndex}-${index}`, cx + Math.sin(angle) * r, cy - Math.cos(angle) * r, 1.6, "#d8bd86", "seed");
      }),
    ),
    path("vase-body", "M 154 226 C 138 254 138 292 156 314 Q 200 326 244 314 C 262 292 262 254 246 226 Z", SKY, undefined, "ceramic vase"),
    rect("vase-neck", 178, 208, 44, 24, SKY, 4, "vase neck"),
    ellipse("vase-rim", 200, 208, 30, 9, PAPER, undefined, "vase rim"),
    path("vase-band", "M 150 276 Q 200 290 250 276 L 252 288 Q 200 302 148 288 Z", ROSE, undefined, "painted band"),
    rect("card", 42, 240, 76, 64, PAPER, 4, "little card"),
    ...flower("card-flower", 80, 264, 12, 5, 0),
    path("card-fold", "M 48 294 L 112 294", "none", undefined, "card line"),
    ellipse("saucer", 326, 306, 34, 8, PAPER, undefined, "saucer"),
    rect("coffee-cup", 306, 276, 40, 28, LILAC, 9, "coffee cup"),
    ellipse("coffee-top", 326, 276, 20, 6, "#9b7257", undefined, "coffee"),
    path("cup-handle", "M 344 282 Q 360 282 358 292 Q 356 300 344 298", "none", undefined, "cup handle"),
    rect("chocolate-1", 288, 344, 18, 18, "#7b5b48", 2, "chocolate square"),
    rect("chocolate-2", 307, 344, 18, 18, "#8f6a53", 2, "chocolate square"),
    rect("chocolate-3", 288, 363, 18, 18, "#8f6a53", 2, "chocolate square"),
    rect("chocolate-4", 307, 363, 18, 18, "#7b5b48", 2, "chocolate square"),
    ...Array.from({ length: 12 }, (_, index) => {
      const x = 46 + index * 6;
      const y = 360 + (index % 3) * 7;
      return circle(`loose-seed-${index}`, x, y, 2.2, "#9b7c4f", "sunflower seed");
    }),
    ...flower("corner-sun-1", 20, 22, 10, 5, 0),
    ...flower("corner-sun-2", 380, 22, 10, 5, 20),
  ],
  details: [
    { d: "M 72 250 L 88 250 M 72 258 L 100 258 M 72 266 L 82 266", opacity: 0.6 },
    { d: "M 310 292 Q 318 286 326 292 M 334 292 Q 342 286 350 292", opacity: 0.55 },
  ],
  notes: [
    { regionId: "sunflower-left-petal-0", text: "maybe you gave sunflowers to every girl" },
    { regionId: "vase-body", text: "i will admit i do" },
    { regionId: "card-flower-center", text: "Chocolates replaceable and edible you're permanent" },
    { regionId: "coffee-cup", text: "the answer lied in the reflection of your cranberry coffee." },
  ],
};

const CORE_ILLUSTRATIONS: Illustration[] = [
  bouquet,
  cottage,
  catWindow,
  nightSky,
  butterflyGarden,
  bedroom,
  vaseTable,
  housePath,
  waxLetter,
  fivePlaces,
  oneEleven,
  ourJacket,
  voiceNotes,
  homePerson,
  libraryCafe,
  sunflowers,
];

const FRAME_ACCENTS: Record<string, string> = {
  bouquet: ROSE,
  cottage: LEAF,
  "cat-window": LILAC,
  "night-sky": STONE,
  "butterfly-garden": ROSE,
  bedroom: LILAC,
  "vase-table": WARM,
  "house-path": LEAF,
  "wax-letter": "#d9a6a1",
  "five-places": SKY,
  "one-eleven": LILAC,
  "our-jacket": "#b9c9ab",
  "voice-notes": ROSE,
  "home-person": WARM,
  "library-cafe": "#d8c8b8",
  sunflowers: "#efd39a",
};

export const ILLUSTRATIONS: Illustration[] = CORE_ILLUSTRATIONS.map((illustration) => ({
  ...illustration,
  regions: [
    ...illustration.regions,
    ...ornateFrame(illustration.id, FRAME_ACCENTS[illustration.id] ?? ROSE),
  ],
}));

export const TOTAL_COLORABLE_REGIONS = ILLUSTRATIONS.reduce(
  (total, illustration) => total + illustration.regions.length,
  0,
);

export function getIllustration(id: string | null): Illustration | undefined {
  return ILLUSTRATIONS.find((illustration) => illustration.id === id);
}

export function regionBaseColors(illustration: Illustration): Record<string, string> {
  return Object.fromEntries(illustration.regions.map((region) => [region.id, region.fill]));
}

const PREVIEW_PALETTES = [
  ["#eab8b5", "#c9b6d8", "#f0d9a8", "#a9c8bb", "#b6c9dd"],
  ["#d8b4c8", "#b8d0b3", "#f1d6a2", "#adbfd6", "#e7b9ad"],
];

function hashId(id: string): number {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function previewColor(region: Region): string {
  const id = region.id.toLowerCase();
  if (region.fill === "none") return "none";
  const palette = PREVIEW_PALETTES[hashId(region.id) % PREVIEW_PALETTES.length];
  if (id.includes("-frame-")) return palette[hashId(id) % palette.length];
  if (id.includes("center") || id.includes("centre") || id.includes("inner")) return "#efd79d";
  if (id.includes("petal")) return palette[hashId(id) % palette.length];
  if (id.includes("leaf") || id.includes("tree") || id.includes("hill") || id.includes("grass") || id.includes("meadow") || id.includes("lawn") || id.includes("stem") || id.includes("blanket")) {
    return palette[3];
  }
  if (id.includes("sky") || id.includes("pane") || id.includes("window-glass") || id.includes("pond") || id.includes("vase") || id.includes("picture")) return palette[4];
  if (id.includes("moon") || id.includes("star") || id.includes("sun") || id.includes("flame") || id.includes("lamp")) return "#f0d8a1";
  if (id.includes("roof") || id.includes("bow") || id.includes("curtain") || id.includes("rug") || id.includes("cushion") || id.includes("wing")) return palette[0];
  if (id.includes("wall") || id.includes("door") || id.includes("body") || id.includes("mattress") || id.includes("pillow") || id.includes("cushion")) return palette[2];
  if (id.includes("seed") || id.includes("sunflower")) return "#efd39a";
  if (id.includes("jacket") || id.includes("sleeve") || id.includes("collar") || id.includes("vine") || id.includes("leaf")) return palette[3];
  if (id.includes("wave") || id.includes("tape") || id.includes("clock") || id.includes("chart") || id.includes("reel")) return palette[4];
  if (id.includes("chair") || id.includes("shelf") || id.includes("ladder") || id.includes("mug") || id.includes("cup") || id.includes("controller") || id.includes("desk") || id.includes("envelope") || id.includes("stamp") || id.includes("card")) return "#e8dcc9";
  if (id.includes("stone") || id.includes("fence") || id.includes("path") || id.includes("frame") || id.includes("table") || id.includes("wrap") || id.includes("pot") || id.includes("book") || id.includes("sill")) return "#e8dcc9";
  return palette[1];
}
