import type { Illustration, Region } from "./types";

const PAPER = "#fffdf7";
const LEAF = "#f1f5ec";
const SKY = "#f5fafd";
const WARM = "#fbf1df";
const STONE = "#f3efe8";
const ROSE = "#f9ece9";
const LILAC = "#f4f0fa";

const path = (id: string, d: string, fill = PAPER, transform?: string, label?: string): Region => ({
  type: "path", id, d, fill, transform, label,
});
const ellipse = (
  id: string, cx: number, cy: number, rx: number, ry: number,
  fill = PAPER, transform?: string, label?: string,
): Region => ({ type: "ellipse", id, cx, cy, rx, ry, fill, transform, label });
const circle = (id: string, cx: number, cy: number, r: number, fill = PAPER, label?: string): Region => ({
  type: "circle", id, cx, cy, r, fill, label,
});
const rect = (
  id: string, x: number, y: number, width: number, height: number,
  fill = PAPER, rx?: number, label?: string,
): Region => ({ type: "rect", id, x, y, width, height, fill, rx, label });
const poly = (id: string, points: string, fill = PAPER, transform?: string, label?: string): Region => ({
  type: "polygon", id, points, fill, transform, label,
});

function flower(prefix: string, cx: number, cy: number, r: number, count = 6, offset = 0, petalFill = PAPER): Region[] {
  const regions: Region[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = offset + (i * 360) / count;
    regions.push(ellipse(`${prefix}-petal-${i}`, cx, cy - r * 0.68, r * 0.32, r * 0.55, petalFill, `rotate(${angle} ${cx} ${cy})`, "petal"));
  }
  regions.push(circle(`${prefix}-inner`, cx, cy, r * 0.36, WARM, "flower middle"));
  regions.push(circle(`${prefix}-center`, cx, cy, r * 0.18, "#f7e9c6", "flower centre"));
  return regions;
}

function leaf(id: string, x: number, y: number, rotation: number, scale = 1, fill = LEAF): Region {
  return path(id, "M 0 0 C 6 -15 25 -19 35 -3 C 27 12 8 13 0 0 Z", fill, `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`, "leaf");
}

function star(id: string, cx: number, cy: number, r: number, fill = WARM): Region {
  const q = r * 0.2;
  return path(id, `M ${cx} ${cy - r} Q ${cx + q} ${cy - q} ${cx + r} ${cy} Q ${cx + q} ${cy + q} ${cx} ${cy + r} Q ${cx - q} ${cy + q} ${cx - r} ${cy} Q ${cx - q} ${cy - q} ${cx} ${cy - r} Z`, fill, undefined, "star");
}

function cloud(id: string, x: number, y: number, scale = 1): Region {
  return path(id, "M 8 36 C -3 36 -5 22 6 19 C 9 8 23 7 29 16 C 36 4 53 9 53 21 C 65 20 68 36 56 36 Z", PAPER, `translate(${x} ${y}) scale(${scale})`, "cloud");
}

function bookSpines(prefix: string, x: number, y: number, count: number, totalWidth: number, height: number): Region[] {
  const fills = [ROSE, SKY, LILAC, WARM, LEAF, STONE];
  const widths = Array.from({ length: count }, (_, index) => 12 + ((index * 7) % 9));
  const sum = widths.reduce((total, width) => total + width, 0);
  let cursor = x;
  return widths.map((width, index) => {
    const adjusted = (width / sum) * totalWidth;
    const region = rect(`${prefix}-book-${index}`, cursor, y + (index % 3 === 0 ? 3 : 0), adjusted - 2, height - (index % 3 === 0 ? 3 : 0), fills[index % fills.length], 1.5, "book spine");
    cursor += adjusted;
    return region;
  });
}

function waveform(prefix: string, startX: number, y: number, count: number): Region[] {
  return Array.from({ length: count }, (_, index) => {
    const height = 8 + Math.abs(Math.sin(index * 0.7)) * 42 + (index % 5) * 4;
    return rect(`${prefix}-bar-${index}`, startX + index * 9, y - height / 2, 5, height, index % 4 === 0 ? ROSE : index % 3 === 0 ? SKY : LILAC, 2.5, "waveform bar");
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

function petalRing(prefix: string, cx: number, cy: number, count: number, outer: number, fill = PAPER): Region[] {
  return Array.from({ length: count }, (_, index) =>
    ellipse(`${prefix}-ring-${index}`, cx, cy - outer * 0.64, outer * 0.27, outer * 0.44, fill, `rotate(${(index * 360) / count} ${cx} ${cy})`, "mandala petal"),
  );
}

function scallops(prefix: string, y: number, count: number, r: number, fill = ROSE): Region[] {
  return Array.from({ length: count }, (_, index) => ellipse(`${prefix}-scallop-${index}`, r + index * 2 * r, y, r, r * 0.65, fill, undefined, "lace scallop"));
}

function arches(prefix: string, x: number, y: number, count: number, width: number, height: number, fill = PAPER): Region[] {
  return Array.from({ length: count }, (_, index) => {
    const left = x + index * width;
    const right = left + width;
    return path(`${prefix}-arch-${index}`, `M ${left} ${y + height} L ${left} ${y + height * 0.45} Q ${(left + right) / 2} ${y - height * 0.2} ${right} ${y + height * 0.45} L ${right} ${y + height} Z`, fill, undefined, "arcade arch");
  });
}

function quilt(prefix: string, x: number, y: number, cols: number, rows: number, w: number, h: number): Region[] {
  const fills = [ROSE, LILAC, LEAF, SKY, WARM, STONE];
  const regions: Region[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = x + col * w + (row % 2) * (w / 2) + w / 2;
      const cy = y + row * h + h / 2;
      regions.push(poly(`${prefix}-tile-${row}-${col}`, `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`, fills[(row + col) % fills.length], undefined, "quilt patch"));
    }
  }
  return regions;
}

function spiralDots(prefix: string, cx: number, cy: number, count: number, maxR: number): Region[] {
  return Array.from({ length: count }, (_, index) => {
    const t = index / count;
    const angle = t * Math.PI * 8;
    const radius = 5 + t * maxR;
    return circle(`${prefix}-dot-${index}`, cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 2.2 + (index % 3) * 0.6, index % 4 === 0 ? ROSE : WARM, "spiral dot");
  });
}

function beads(prefix: string, x: number, y: number, count: number, radius: number): Region[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return circle(`${prefix}-bead-${index}`, x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 5.5, index % 3 === 0 ? ROSE : index % 3 === 1 ? LILAC : SKY, "bead");
  });
}

const quillInk: Illustration = {
  id: "quill-ink",
  title: "Quills and mixed ink",
  subtitle: "we used to like mix immiscible inks",
  regions: [
    rect("ink-desk", 0, 0, 400, 400, WARM, undefined, "old desk"),
    circle("ink-pool-outer", 200, 122, 88, LILAC, "ink pool"),
    circle("ink-pool-middle", 200, 122, 66, SKY, "ink pool middle"),
    circle("ink-pool-inner", 200, 122, 44, ROSE, "ink pool centre"),
    ...spiralDots("ink-swirl", 200, 122, 34, 38),
    rect("bottle-body", 52, 216, 92, 104, SKY, 10, "ink bottle"),
    rect("bottle-shoulder", 60, 200, 76, 24, SKY, 6, "ink bottle shoulder"),
    rect("bottle-neck", 82, 182, 32, 22, STONE, 4, "bottle neck"),
    rect("bottle-cap", 76, 168, 44, 18, "#8b8175", 4, "bottle cap"),
    rect("bottle-label", 62, 242, 72, 54, PAPER, 4, "ink label"),
    path("bottle-ink-line", "M 62 258 Q 98 250 134 258", "none", undefined, "label line"),
    path("bottle-ink-line-2", "M 62 272 Q 98 264 134 272", "none", undefined, "label line"),
    circle("ink-drop-1", 158, 232, 5, LILAC, "ink drop"),
    circle("ink-drop-2", 170, 256, 3, SKY, "ink drop"),
    circle("ink-drop-3", 156, 274, 4, ROSE, "ink drop"),
    path("feather-spine", "M 258 336 Q 292 252 336 116", "none", undefined, "quill spine"),
    ...Array.from({ length: 12 }, (_, index) => {
      const t = index / 11;
      const x = 258 + t * 78;
      const y = 336 - t * 220;
      return ellipse(`quill-barb-left-${index}`, x - 11, y, 14 - t * 7, 5, index % 2 ? LILAC : ROSE, `rotate(${-42 + t * 14} ${x - 11} ${y})`, "feather barb");
    }),
    ...Array.from({ length: 12 }, (_, index) => {
      const t = index / 11;
      const x = 258 + t * 78;
      const y = 336 - t * 220;
      return ellipse(`quill-barb-right-${index}`, x + 11, y, 14 - t * 7, 5, index % 2 ? SKY : WARM, `rotate(${42 - t * 14} ${x + 11} ${y})`, "feather barb");
    }),
    path("quill-tip", "M 252 344 L 260 326 L 264 338 Z", STONE, undefined, "quill nib"),
    rect("pen-barrel", 226, 292, 88, 20, "#c8b6a0", 8, "fountain pen"),
    rect("pen-section", 206, 294, 22, 16, STONE, 4, "pen section"),
    poly("pen-nib", "206,292 186,302 206,312", "#d8c8b8", undefined, "pen nib"),
    rect("pen-clip", 266, 284, 8, 30, "#9c8b78", 3, "pen clip"),
    rect("pen-band", 286, 292, 6, 20, WARM, 2, "pen band"),
    rect("paper-sheet", 138, 286, 196, 92, PAPER, 3, "letter sheet"),
    ...Array.from({ length: 6 }, (_, index) => rect(`paper-line-${index}`, 152, 302 + index * 12, 160 - (index % 2) * 24, 2, STONE, 1, "ink line")),
    rect("wax-block", 32, 48, 72, 64, ROSE, 6, "wax block"),
    circle("wax-drop-a", 118, 58, 9, "#d9a6a1", "wax drop"),
    circle("wax-drop-b", 136, 78, 5, "#e3b7b1", "wax drop"),
    circle("wax-drop-c", 120, 92, 7, "#d9a6a1", "wax drop"),
    ...flower("ink-flower-left", 28, 372, 12, 5, 0),
    ...flower("ink-flower-right", 372, 372, 12, 5, 18),
    star("ink-star", 342, 56, 6),
  ],
  details: [
    { d: "M 70 182 Q 200 168 330 184", opacity: 0.4 },
    { d: "M 148 316 L 288 316 M 148 340 L 264 340", opacity: 0.35 },
  ],
  notes: [
    { regionId: "ink-pool-inner", text: "we used to like mix immiscible inks to produce patterned outputs" },
    { regionId: "bottle-label", text: "was always the calligraphy guy, and old catholic fonts" },
    { regionId: "pen-clip", text: "we have the worst handwriting in the batch" },
  ],
};

const chocolateBox: Illustration = {
  id: "chocolate-box",
  title: "A box of chocolates",
  subtitle: "chocolate makes everything wrong right.",
  regions: [
    rect("choc-table", 0, 0, 400, 400, WARM, undefined, "table"),
    rect("box-shadow", 44, 76, 320, 252, "#e6d8c4", 14, "box shadow"),
    rect("box-lid", 52, 54, 296, 62, ROSE, 12, "box lid"),
    rect("box-lid-band", 52, 78, 296, 16, LILAC, 4, "lid ribbon"),
    path("box-bow-left", "M 196 78 Q 160 46 160 66 Q 160 84 196 78 Z", LILAC, undefined, "bow loop"),
    path("box-bow-right", "M 204 78 Q 240 46 240 66 Q 240 84 204 78 Z", LILAC, undefined, "bow loop"),
    circle("box-bow-knot", 200, 78, 9, ROSE, "bow knot"),
    rect("box-tray", 52, 116, 296, 204, STONE, 12, "chocolate tray"),
    rect("box-inner", 62, 126, 276, 184, "#efe4d2", 8, "tray lining"),
    ...Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 5 }, (_, col) => {
        const index = row * 5 + col;
        const cx = 90 + col * 55;
        const cy = 154 + row * 45;
        const shape = index % 4;
        if (shape === 0) return circle(`choc-${index}`, cx, cy, 17, index % 2 ? "#9c6f55" : "#8a5f49", "chocolate truffle");
        if (shape === 1) return rect(`choc-${index}`, cx - 16, cy - 14, 32, 28, "#a8795b", 4, "chocolate square");
        if (shape === 2) return poly(`choc-${index}`, `${cx},${cy - 17} ${cx + 17},${cy} ${cx},${cy + 17} ${cx - 17},${cy}`, "#9b6b50", undefined, "chocolate diamond");
        return ellipse(`choc-${index}`, cx, cy, 18, 13, "#b08465", undefined, "chocolate oval");
      }),
    ).flat(),
    ...Array.from({ length: 20 }, (_, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      return circle(`choc-mark-${index}`, 90 + col * 55, 154 + row * 45, 4.5, "#d9b793", "chocolate mark");
    }),
    circle("cranberry-choc", 328, 128, 14, "#a45c66", "cranberry chocolate"),
    circle("cranberry-centre", 328, 128, 5, ROSE, "cranberry centre"),
    rect("wrapper-1", 30, 330, 58, 30, LILAC, 5, "wrapper"),
    poly("wrapper-end-1", "30,330 14,318 14,372 30,360", SKY, undefined, "wrapper end"),
    rect("wrapper-2", 310, 336, 60, 28, ROSE, 5, "wrapper"),
    poly("wrapper-end-2", "370,336 388,324 388,376 370,364", LILAC, undefined, "wrapper end"),
    path("choc-card", "M 132 348 L 268 348 L 262 390 L 138 390 Z", PAPER, undefined, "little card"),
    ...flower("choc-card-flower", 200, 366, 11, 5, 0),
    star("choc-star-1", 24, 40, 5),
    star("choc-star-2", 376, 40, 5),
    circle("cocoa-bean-1", 40, 262, 7, "#8a5f49", "cocoa bean"),
    circle("cocoa-bean-2", 360, 262, 7, "#8a5f49", "cocoa bean"),
    ...flower("choc-flower-left", 26, 300, 10, 5, 0),
    ...flower("choc-flower-right", 374, 300, 10, 5, 20),
  ],
  details: [
    { d: "M 70 250 L 330 250 M 70 294 L 330 294", opacity: 0.35 },
    { d: "M 140 360 L 260 360", opacity: 0.45 },
  ],
  notes: [
    { regionId: "choc-mark-0", text: "yk i used to hv chocolate before every test as a tradition?" },
    { regionId: "box-lid-band", text: "chocolate makes everything wrong right." },
    { regionId: "cranberry-choc", text: "cranberry chocolate, always." },
  ],
};

const fallLeaves: Illustration = {
  id: "fall-leaves",
  title: "Almost the only season",
  subtitle: "we hate all seasons except maybe fall",
  regions: [
    rect("fall-sky", 0, 0, 400, 400, WARM, undefined, "fall sky"),
    circle("fall-sun", 324, 72, 34, "#f2dba8", "soft sun"),
    cloud("fall-cloud", 26, 46, 0.85),
    path("fall-hill-back", "M 0 268 Q 120 232 220 268 Q 320 304 400 262 L 400 400 L 0 400 Z", "#e5d8bd", undefined, "far hill"),
    path("fall-hill-front", "M 0 318 Q 160 284 320 318 Q 380 330 400 320 L 400 400 L 0 400 Z", "#d8c7a6", undefined, "near hill"),
    path("tree-trunk", "M 62 330 C 58 272 62 224 66 172 L 82 172 C 84 226 86 280 88 330 Z", "#b99a7d", undefined, "tree trunk"),
    path("tree-branch-a", "M 74 232 Q 122 200 158 172", "none", undefined, "branch"),
    path("tree-branch-b", "M 72 264 Q 32 232 14 200", "none", undefined, "branch"),
    ...petalRing("fall-crown", 76, 158, 16, 76, "#e8c8a0"),
    ...petalRing("fall-crown-inner", 76, 158, 10, 48, "#d9b38f"),
    circle("fall-crown-centre", 76, 158, 14, "#c99a72", "tree crown centre"),
    ...Array.from({ length: 22 }, (_, index) => {
      const x = 18 + ((index * 47) % 360);
      const y = 40 + ((index * 71) % 300);
      return leaf(`fall-leaf-${index}`, x, y, (index * 37) % 360, 0.5 + (index % 3) * 0.12, index % 3 === 0 ? "#e8c8a0" : index % 3 === 1 ? "#d9a98d" : "#c9b07d");
    }),
    ...Array.from({ length: 8 }, (_, index) => ellipse(`fall-ground-leaf-${index}`, 40 + index * 44, 356 + (index % 2) * 18, 15, 7, index % 2 ? "#c9a07f" : "#dcb98d", `rotate(${index % 2 ? 12 : -14} ${40 + index * 44} ${356 + (index % 2) * 18})`, "fallen leaf")),
    path("acorn-cap-1", "M 154 326 Q 166 312 178 326 Z", "#a98362", undefined, "acorn cap"),
    ellipse("acorn-body-1", 166, 334, 11, 14, "#c7a77e", undefined, "acorn"),
    path("acorn-cap-2", "M 306 342 Q 318 328 330 342 Z", "#a98362", undefined, "acorn cap"),
    ellipse("acorn-body-2", 318, 350, 11, 14, "#c7a77e", undefined, "acorn"),
    ellipse("pumpkin-body", 276, 356, 44, 30, "#e2b27f", undefined, "pumpkin"),
    ellipse("pumpkin-stripe-a", 264, 356, 10, 29, "#d19e70", undefined, "pumpkin stripe"),
    ellipse("pumpkin-stripe-b", 288, 356, 10, 29, "#d19e70", undefined, "pumpkin stripe"),
    path("pumpkin-stem", "M 272 328 Q 276 314 284 322", "none", undefined, "pumpkin stem"),
    path("scarf-tail", "M 196 292 Q 228 312 250 296 L 246 316 Q 222 332 194 312 Z", ROSE, undefined, "scarf"),
    rect("scarf-fringe-1", 198, 312, 4, 10, ROSE, 2, "scarf fringe"),
    rect("scarf-fringe-2", 208, 316, 4, 10, ROSE, 2, "scarf fringe"),
    rect("scarf-fringe-3", 218, 318, 4, 10, ROSE, 2, "scarf fringe"),
    ...flower("fall-flower-left", 24, 374, 10, 5, 0),
    ...flower("fall-flower-right", 376, 374, 10, 5, 20),
    star("fall-star", 226, 62, 5),
  ],
  details: [
    { d: "M 40 300 Q 200 282 360 300", opacity: 0.35 },
    { d: "M 74 232 Q 122 200 158 172 M 72 264 Q 32 232 14 200", opacity: 0.5 },
  ],
  notes: [
    { regionId: "fall-crown-centre", text: "we hate all seasons except maybe fall" },
    { regionId: "pumpkin-body", text: "the light in fall feels softer somehow" },
    { regionId: "scarf-tail", text: "stay a little longer, it's nice here" },
  ],
};

const bookshopWindow: Illustration = {
  id: "bookshop-window",
  title: "The bookshop window",
  subtitle: "ugh dont make me crave starmarks",
  regions: [
    rect("shop-wall", 0, 0, 400, 400, STONE, undefined, "shop wall"),
    path("shop-awning", "M 0 34 Q 200 68 400 34 L 400 66 Q 200 100 0 66 Z", ROSE, undefined, "striped awning"),
    ...Array.from({ length: 10 }, (_, index) => poly(`awning-stripe-${index}`, `${index * 40},40 ${index * 40 + 20},48 ${index * 40 + 20},80 ${index * 40},72`, index % 2 ? PAPER : "#eed7d1", undefined, "awning stripe")),
    rect("shop-window-frame", 26, 88, 348, 224, "#b99a7d", 10, "window frame"),
    rect("shop-glass", 38, 100, 324, 200, SKY, 6, "shop window"),
    rect("shop-shelf-1", 48, 148, 304, 8, "#b99a7d", 3, "shelf"),
    rect("shop-shelf-2", 48, 214, 304, 8, "#b99a7d", 3, "shelf"),
    rect("shop-shelf-3", 48, 280, 304, 8, "#b99a7d", 3, "shelf"),
    ...bookSpines("shop-shelf-books-1", 52, 112, 12, 296, 36),
    ...bookSpines("shop-shelf-books-2", 52, 178, 12, 296, 36),
    ...bookSpines("shop-shelf-books-3", 52, 244, 12, 296, 36),
    path("display-book-left", "M 152 292 Q 180 280 200 292 L 200 304 Q 180 292 152 304 Z", PAPER, undefined, "display book"),
    path("display-book-right", "M 200 292 Q 220 280 248 292 L 248 304 Q 220 292 200 304 Z", PAPER, undefined, "display book"),
    rect("shop-sign", 132, 320, 136, 34, WARM, 5, "shop sign"),
    path("shop-sign-post", "M 196 354 L 196 372", "none", undefined, "sign post"),
    rect("shop-door", 314, 320, 62, 68, LILAC, 6, "shop door"),
    circle("shop-door-window", 345, 342, 16, SKY, "door window"),
    rect("shop-step", 304, 386, 80, 10, "#c9bba0", 3, "shop step"),
    rect("shop-plant-pot", 56, 330, 34, 40, STONE, 5, "plant pot"),
    ...flower("shop-plant", 73, 330, 15, 6, 0),
    ellipse("shop-cat-body", 280, 288, 20, 13, "#d9b48f", undefined, "shop cat"),
    circle("shop-cat-head", 262, 274, 12, "#d9b48f", "shop cat head"),
    poly("shop-cat-ear-1", "252,266 256,252 264,264", "#d9b48f", undefined, "cat ear"),
    poly("shop-cat-ear-2", "264,264 272,252 274,266", "#d9b48f", undefined, "cat ear"),
    star("shop-star-1", 20, 148, 4),
    star("shop-star-2", 380, 148, 4),
    ...flower("shop-flower-left", 22, 382, 10, 5, 0),
    ...flower("shop-flower-right", 378, 382, 10, 5, 20),
  ],
  details: [
    { d: "M 38 132 L 362 132 M 38 260 L 362 260", opacity: 0.35 },
    { d: "M 152 298 Q 180 288 200 298 Q 220 288 248 298", opacity: 0.5 },
  ],
  notes: [
    { regionId: "shop-glass", text: "ugh dont make me crave starmarks" },
    { regionId: "display-book-left", text: "a whole quiet afternoon in one shelf" },
    { regionId: "shop-cat-body", text: "the cat in the window stayed a while" },
  ],
};

const movieNight: Illustration = {
  id: "movie-night",
  title: "A movie night in",
  subtitle: "letterbox review when ur done <3",
  regions: [
    rect("movie-room", 0, 0, 400, 400, LILAC, undefined, "dark room"),
    ...fairyLights("movie-lights", 14, 34),
    rect("screen-frame", 42, 74, 316, 184, "#8b8175", 8, "screen frame"),
    rect("screen", 52, 84, 296, 164, SKY, 4, "screen"),
    circle("screen-moon", 300, 116, 22, WARM, "screen moon"),
    path("screen-hill", "M 52 210 Q 130 172 208 210 Q 278 244 348 202 L 348 248 L 52 248 Z", "#c8d4bd", undefined, "screen hill"),
    star("screen-star-1", 92, 112, 4),
    star("screen-star-2", 142, 134, 3),
    star("screen-star-3", 226, 106, 4),
    rect("popcorn-bowl", 54, 296, 92, 58, ROSE, 10, "popcorn bowl"),
    ellipse("popcorn-rim", 100, 296, 46, 12, PAPER, undefined, "popcorn bowl rim"),
    ...Array.from({ length: 14 }, (_, index) => circle(`popcorn-${index}`, 70 + (index % 7) * 10, 282 + Math.floor(index / 7) * 10, 6.5, WARM, "popcorn")),
    rect("ticket-1", 226, 300, 72, 34, WARM, 4, "movie ticket"),
    rect("ticket-2", 248, 338, 72, 34, ROSE, 4, "movie ticket"),
    circle("ticket-hole-1", 236, 317, 3, PAPER, "ticket punch"),
    circle("ticket-hole-2", 288, 317, 3, PAPER, "ticket punch"),
    rect("review-card", 128, 330, 96, 54, PAPER, 5, "review card"),
    ...Array.from({ length: 4 }, (_, index) => rect(`review-line-${index}`, 140, 342 + index * 10, 72 - (index % 2) * 16, 2, STONE, 1, "review line")),
    star("review-star", 212, 340, 6),
    rect("remote-body", 332, 290, 32, 60, STONE, 6, "remote"),
    circle("remote-button-1", 348, 306, 6, ROSE, "remote button"),
    circle("remote-button-2", 348, 326, 6, SKY, "remote button"),
    path("blanket-fold", "M 18 350 Q 96 330 178 352 L 172 400 L 24 400 Z", LEAF, undefined, "blanket"),
    ...quilt("movie-quilt", 28, 358, 4, 2, 32, 18),
    rect("film-reel-1", 26, 88, 26, 26, STONE, 4, "film reel"),
    rect("film-reel-2", 348, 88, 26, 26, STONE, 4, "film reel"),
    ...flower("movie-flower-left", 24, 372, 9, 5, 0),
    ...flower("movie-flower-right", 376, 372, 9, 5, 20),
  ],
  details: [
    { d: "M 52 246 L 348 246", opacity: 0.5 },
    { d: "M 20 350 Q 96 330 178 352", opacity: 0.45 },
  ],
  notes: [
    { regionId: "screen", text: "We watching a movieee" },
    { regionId: "review-card", text: "letterbox review when ur done <3" },
    { regionId: "remote-button-1", text: "fast forward" },
  ],
};

const poemPage: Illustration = {
  id: "poem-page",
  title: "A poem after two years",
  subtitle: "the first week of us",
  regions: [
    rect("poem-desk", 0, 0, 400, 400, WARM, undefined, "desk"),
    rect("poem-sheet", 46, 42, 308, 306, PAPER, 4, "poem paper"),
    path("poem-torn-edge", "M 46 330 L 354 330 L 348 348 L 52 348 Z", STONE, undefined, "deckled edge"),
    circle("poem-ink-blot", 320, 84, 11, LILAC, "ink blot"),
    circle("poem-ink-dot", 336, 96, 4, LILAC, "ink dot"),
    path("poem-flourish", "M 70 84 Q 102 62 134 84 Q 102 106 70 84 Z", ROSE, undefined, "ink flourish"),
    ...Array.from({ length: 11 }, (_, index) => rect(`poem-line-${index}`, 70, 110 + index * 19, index % 3 === 2 ? 190 : 254, 3, index % 4 === 0 ? "#c9b6d8" : STONE, 1, "poem line")),
    path("poem-heart", "M 286 268 Q 296 254 306 268 Q 316 254 326 268 Q 326 284 306 298 Q 286 284 286 268 Z", ROSE, undefined, "little heart"),
    leaf("poem-leaf-1", 78, 296, 210, 0.55),
    leaf("poem-leaf-2", 90, 300, -20, 0.5),
    ...flower("poem-pressed", 84, 292, 12, 5, 0),
    rect("poem-bookmark", 300, 42, 12, 110, LILAC, 3, "ribbon bookmark"),
    poly("poem-bookmark-tail", "300,152 312,152 306,168", LILAC, undefined, "bookmark tail"),
    rect("candle-holder", 356, 250, 30, 12, STONE, 3, "candle holder"),
    rect("candle-body", 362, 202, 18, 48, WARM, 4, "candle"),
    path("candle-flame", "M 371 202 Q 362 186 371 176 Q 380 186 371 202 Z", "#f0d8a1", undefined, "candle flame"),
    rect("envelope-body", 30, 236, 92, 60, PAPER, 4, "envelope"),
    path("envelope-flap", "M 30 236 L 76 268 L 122 236", "none", undefined, "envelope flap"),
    circle("envelope-seal", 76, 268, 9, "#d9a6a1", "wax seal"),
    rect("pencil-body", 322, 330, 62, 12, "#d9c8b0", 4, "pencil"),
    poly("pencil-tip", "384,330 396,336 384,342", STONE, undefined, "pencil tip"),
    ...flower("poem-flower-left", 24, 372, 10, 5, 0),
    ...flower("poem-flower-right", 376, 372, 10, 5, 20),
    star("poem-star", 200, 32, 5),
  ],
  details: [
    { d: "M 70 106 L 324 106", opacity: 0.4 },
    { d: "M 30 236 L 76 268 L 122 236", opacity: 0.6 },
  ],
  notes: [
    { regionId: "poem-line-5", text: "first week of our relationship we wrote a poem after 2 yrs." },
    { regionId: "envelope-seal", text: "nobody trusts the other entirely in the beginning" },
    { regionId: "poem-heart", text: "and now, we tell you most of it" },
  ],
};

const voiceCall: Illustration = {
  id: "voice-call",
  title: "A little voice call",
  subtitle: "works like magic, 100% recommend",
  regions: [
    rect("call-room", 0, 0, 400, 400, SKY, undefined, "room"),
    rect("call-window", 28, 34, 132, 118, PAPER, 8, "window frame"),
    rect("call-glass", 36, 42, 116, 102, SKY, 4, "window glass"),
    cloud("call-cloud", 52, 62, 0.5),
    circle("call-moon", 130, 64, 14, WARM, "moon through window"),
    rect("call-phone", 176, 54, 100, 176, STONE, 16, "phone"),
    rect("call-screen", 184, 68, 84, 148, LILAC, 12, "call screen"),
    circle("call-avatar", 226, 112, 26, ROSE, "call avatar"),
    path("call-avatar-hair", "M 204 102 Q 226 82 248 102", "none", undefined, "avatar hair"),
    rect("call-status", 198, 156, 56, 12, PAPER, 6, "call status"),
    ...waveform("call-wave", 32, 208, 34),
    rect("headband", 96, 274, 208, 18, STONE, 9, "headphone band"),
    ellipse("earcup-left", 92, 306, 26, 32, LILAC, undefined, "left earcup"),
    ellipse("earcup-right", 308, 306, 26, 32, LILAC, undefined, "right earcup"),
    rect("mic-boom", 292, 326, 8, 28, STONE, 3, "microphone boom"),
    circle("mic-tip", 296, 356, 9, ROSE, "microphone"),
    rect("buds-case", 172, 336, 60, 42, PAPER, 10, "buds case"),
    circle("bud-left", 188, 348, 7, SKY, "earbud"),
    circle("bud-right", 216, 348, 7, SKY, "earbud"),
    rect("call-mug", 32, 336, 44, 44, ROSE, 8, "mug"),
    path("call-mug-handle", "M 74 346 Q 90 346 88 360 Q 86 372 74 370", "none", undefined, "mug handle"),
    ...flower("call-flower-left", 366, 372, 10, 5, 0),
    ...flower("call-flower-right", 24, 292, 9, 5, 20),
    star("call-star-1", 356, 72, 5),
    star("call-star-2", 374, 112, 4),
  ],
  details: [
    { d: "M 184 84 Q 226 72 268 84", opacity: 0.4 },
    { d: "M 32 208 L 366 208", opacity: 0.3 },
  ],
  notes: [
    { regionId: "call-screen", text: "we turned on daisy's vc yesterday" },
    { regionId: "call-status", text: "works like magic 100% recommend it to patients" },
    { regionId: "mic-tip", text: "we had to switch to external microphone" },
  ],
};

const molecules: Illustration = {
  id: "molecules",
  title: "Molecules in the mind",
  subtitle: "clear after I VISUALISE MOLECULES",
  regions: [
    rect("molecule-board", 0, 0, 400, 400, PAPER, undefined, "notebook page"),
    ...Array.from({ length: 16 }, (_, index) => rect(`molecule-grid-v-${index}`, 20 + index * 24, 20, 1, 360, LEAF, 0, "grid line")),
    ...Array.from({ length: 16 }, (_, index) => rect(`molecule-grid-h-${index}`, 20, 20 + index * 24, 360, 1, LEAF, 0, "grid line")),
    circle("benzene-a", 200, 116, 46, LILAC, "benzene ring"),
    circle("benzene-b", 200, 116, 32, PAPER, "benzene inner"),
    ...beads("benzene-atoms", 200, 116, 6, 46),
    path("bond-1", "M 246 116 Q 284 100 306 122", "none", undefined, "bond"),
    path("bond-2", "M 306 122 Q 330 142 320 174", "none", undefined, "bond"),
    circle("atom-o", 306, 122, 13, ROSE, "oxygen atom"),
    circle("atom-n", 320, 174, 13, SKY, "nitrogen atom"),
    circle("atom-h-1", 282, 84, 9, WARM, "hydrogen atom"),
    circle("atom-h-2", 344, 174, 9, WARM, "hydrogen atom"),
    circle("atom-h-3", 308, 212, 9, WARM, "hydrogen atom"),
    ...beads("small-ring-atoms", 106, 264, 5, 34),
    circle("small-ring", 106, 264, 34, STONE, "small ring"),
    path("chain-bond-1", "M 140 264 L 188 264", "none", undefined, "chain bond"),
    path("chain-bond-2", "M 226 264 L 274 264", "none", undefined, "chain bond"),
    circle("chain-atom-1", 188, 264, 16, LILAC, "chain atom"),
    circle("chain-atom-2", 274, 264, 16, ROSE, "chain atom"),
    circle("chain-atom-3", 314, 264, 12, SKY, "chain atom"),
    path("chain-bond-3", "M 290 264 L 302 264", "none", undefined, "chain bond"),
    rect("flask-neck", 58, 306, 16, 46, SKY, 3, "flask neck"),
    path("flask-body", "M 46 352 Q 34 372 46 388 Q 66 396 86 388 Q 98 372 86 352 Z", LILAC, undefined, "flask"),
    circle("flask-bubble-1", 60, 376, 5, PAPER, "bubble"),
    circle("flask-bubble-2", 74, 382, 4, PAPER, "bubble"),
    rect("test-tube", 320, 306, 18, 74, SKY, 8, "test tube"),
    circle("test-tube-bottom", 329, 380, 9, SKY, "test tube bottom"),
    star("molecule-star-1", 376, 48, 5),
    star("molecule-star-2", 24, 48, 5),
    ...flower("molecule-flower-left", 24, 372, 9, 5, 0),
    ...flower("molecule-flower-right", 376, 372, 9, 5, 20),
  ],
  details: [
    { d: "M 246 116 Q 284 100 306 122 Q 330 142 320 174", opacity: 0.55 },
    { d: "M 140 264 L 188 264 M 226 264 L 274 264 M 290 264 L 302 264", opacity: 0.55 },
  ],
  notes: [
    { regionId: "benzene-b", text: "clear after I VISUALISE MOLECULES" },
    { regionId: "atom-n", text: "i find it difficult when i cannot see things in my mind" },
    { regionId: "small-ring", text: "stereochemistry notes, shared quietly" },
  ],
};

const rakhiThread: Illustration = {
  id: "rakhi-thread",
  title: "A thread on your wrist",
  subtitle: "rakhi ke liyeee",
  regions: [
    rect("rakhi-table", 0, 0, 400, 400, WARM, undefined, "table"),
    ellipse("wrist-a", 200, 210, 96, 54, PAPER, undefined, "wrist"),
    ellipse("wrist-b", 200, 210, 74, 38, "#f7e6d6", undefined, "wrist shading"),
    rect("thread-a", 76, 198, 248, 8, ROSE, 4, "thread"),
    rect("thread-b", 76, 216, 248, 8, LILAC, 4, "thread"),
    rect("thread-c", 76, 234, 248, 8, SKY, 4, "thread"),
    ...beads("rakhi-beads", 200, 218, 16, 74),
    circle("rakhi-centre", 200, 218, 20, "#d9a6a1", "rakhi centre"),
    ...flower("rakhi-flower", 200, 218, 13, 7, 0),
    path("diya-base", "M 38 330 Q 66 350 94 330 Z", STONE, undefined, "diya"),
    path("diya-flame", "M 66 330 Q 56 306 66 292 Q 76 306 66 330 Z", "#f0d8a1", undefined, "diya flame"),
    star("diya-spark-1", 44, 286, 4),
    star("diya-spark-2", 88, 292, 4),
    rect("rakhi-choc-box", 274, 300, 92, 66, ROSE, 8, "chocolate box"),
    rect("rakhi-choc-lid", 274, 300, 92, 18, LILAC, 6, "chocolate box lid"),
    circle("rakhi-choc-1", 294, 338, 9, "#9c6f55", "chocolate"),
    circle("rakhi-choc-2", 322, 338, 9, "#a8795b", "chocolate"),
    circle("rakhi-choc-3", 350, 338, 9, "#9b6b50", "chocolate"),
    ...Array.from({ length: 14 }, (_, index) => ellipse(`rice-grain-${index}`, 46 + (index * 23) % 290, 372 + (index % 3) * 6, 6, 3, PAPER, `rotate(${(index * 31) % 180} ${46 + (index * 23) % 290} ${372 + (index % 3) * 6})`, "rice grain")),
    ...scallops("rakhi-lace", 92, 9, 20, LILAC),
    ...flower("rakhi-flower-left", 24, 92, 11, 5, 0),
    ...flower("rakhi-flower-right", 376, 92, 11, 5, 20),
    star("rakhi-star", 200, 66, 6),
  ],
  details: [
    { d: "M 76 210 L 324 210 M 76 226 L 324 226 M 76 242 L 324 242", opacity: 0.4 },
    { d: "M 38 330 Q 66 350 94 330", opacity: 0.5 },
  ],
  notes: [
    { regionId: "thread-b", text: "rakhi ke liyeee" },
    { regionId: "rakhi-choc-box", text: "aapko yaad hai humne aapko chocolates bheje the?" },
    { regionId: "rakhi-centre", text: "still just us, in the end" },
  ],
};

const gingerCat: Illustration = {
  id: "ginger-cat",
  title: "The ginger cat day",
  subtitle: "world ginger cat day, obviously",
  regions: [
    rect("cat-room", 0, 0, 400, 400, SKY, undefined, "room"),
    rect("cat-window", 26, 30, 150, 132, PAPER, 8, "window frame"),
    rect("cat-window-glass", 34, 38, 134, 116, SKY, 4, "window glass"),
    circle("cat-window-moon", 140, 62, 16, WARM, "moon"),
    star("cat-window-star-1", 60, 60, 4),
    star("cat-window-star-2", 84, 84, 3),
    ellipse("cat-cushion", 200, 306, 118, 42, ROSE, undefined, "cushion"),
    ellipse("cat-cushion-inner", 200, 306, 92, 30, "#e8cdc8", undefined, "cushion middle"),
    ellipse("cat-body", 224, 262, 76, 48, "#d9a878", undefined, "ginger cat body"),
    ellipse("cat-belly", 224, 276, 52, 30, "#edcba4", undefined, "cat belly"),
    ...Array.from({ length: 5 }, (_, index) => path(`cat-stripe-${index}`, `M ${190 + index * 18} 224 Q ${196 + index * 18} 244 ${190 + index * 18} 258`, "none", undefined, "cat stripe")),
    circle("cat-head", 158, 218, 42, "#d9a878", "cat head"),
    poly("cat-ear-1", "126,194 132,156 158,188", "#d9a878", undefined, "cat ear"),
    poly("cat-ear-2", "170,188 194,156 192,196", "#d9a878", undefined, "cat ear"),
    poly("cat-ear-inner-1", "134,190 137,170 150,189", ROSE, undefined, "ear inner"),
    poly("cat-ear-inner-2", "174,189 187,170 186,192", ROSE, undefined, "ear inner"),
    ellipse("cat-muzzle-l", 146, 232, 14, 10, PAPER, undefined, "muzzle"),
    ellipse("cat-muzzle-r", 170, 232, 14, 10, PAPER, undefined, "muzzle"),
    circle("cat-nose", 158, 226, 5, ROSE, "cat nose"),
    circle("cat-eye-l", 142, 210, 5, "#8b8175", "cat eye"),
    circle("cat-eye-r", 174, 210, 5, "#8b8175", "cat eye"),
    ...Array.from({ length: 3 }, (_, index) => path(`cat-whisker-l-${index}`, `M 136 ${230 + index * 6} L 104 ${224 + index * 10}`, "none", undefined, "whisker")),
    ...Array.from({ length: 3 }, (_, index) => path(`cat-whisker-r-${index}`, `M 180 ${230 + index * 6} L 212 ${224 + index * 10}`, "none", undefined, "whisker")),
    path("cat-tail", "M 292 274 Q 342 262 330 212 Q 322 186 300 194", "none", undefined, "cat tail"),
    circle("yarn-ball", 328, 344, 30, LILAC, "yarn ball"),
    path("yarn-thread", "M 300 340 Q 276 328 262 344", "none", undefined, "yarn thread"),
    ...Array.from({ length: 8 }, (_, index) => ellipse(`yarn-wrap-${index}`, 328, 344, 28, 6, index % 2 ? ROSE : SKY, `rotate(${index * 22} 328 344)`, "yarn wrap")),
    ...Array.from({ length: 6 }, (_, index) => ellipse(`paw-${index}`, 40 + index * 12, 370 - (index % 2) * 14, 7, 8, "#d9a878", undefined, "paw print")),
    ...flower("cat-flower-left", 24, 92, 10, 5, 0),
    ...flower("cat-flower-right", 376, 92, 10, 5, 20),
    star("cat-star-1", 356, 48, 5),
  ],
  details: [
    { d: "M 190 224 Q 196 244 190 258 M 208 224 Q 214 244 208 258 M 226 224 Q 232 244 226 258 M 244 224 Q 250 244 244 258 M 262 224 Q 268 244 262 258", opacity: 0.6 },
    { d: "M 292 274 Q 342 262 330 212 Q 322 186 300 194", opacity: 0.6 },
  ],
  notes: [
    { regionId: "cat-cushion", text: "i want a little pet to tease and irritate" },
    { regionId: "cat-ear-inner-1", text: "world ginger cat day" },
    { regionId: "yarn-ball", text: "one day, maybe, a small chaotic friend" },
  ],
};

const midnightRadio: Illustration = {
  id: "midnight-radio",
  title: "Tuned in at 1am",
  subtitle: "we're the people to tune in at 1am",
  regions: [
    rect("radio-room", 0, 0, 400, 400, LILAC, undefined, "night room"),
    circle("radio-moon", 330, 60, 30, WARM, "moon"),
    ...Array.from({ length: 18 }, (_, index) => star(`radio-star-${index}`, 20 + (index * 67) % 360, 20 + (index * 41) % 190, 3 + (index % 3))),
    rect("radio-body", 46, 158, 308, 176, "#c9b49a", 14, "radio body"),
    rect("radio-face", 58, 170, 284, 152, WARM, 10, "radio face"),
    rect("radio-speaker", 72, 206, 116, 100, STONE, 8, "speaker"),
    ...Array.from({ length: 25 }, (_, index) => circle(`speaker-hole-${index}`, 84 + (index % 5) * 22, 220 + Math.floor(index / 5) * 20, 6, "#b7a78f", "speaker hole")),
    rect("radio-dial-panel", 206, 196, 122, 40, PAPER, 6, "dial panel"),
    ...Array.from({ length: 12 }, (_, index) => rect(`dial-tick-${index}`, 214 + index * 9, 200, 2, 8, STONE, 1, "dial tick")),
    path("dial-pointer", "M 282 232 L 288 202 L 294 232 Z", ROSE, undefined, "dial pointer"),
    circle("dial-knob", 266, 268, 22, STONE, "dial knob"),
    circle("dial-knob-inner", 266, 268, 12, PAPER, "dial knob centre"),
    circle("tuning-knob", 330, 268, 16, STONE, "tuning knob"),
    path("radio-antenna", "M 330 158 Q 350 92 372 54", "none", undefined, "antenna"),
    circle("antenna-tip", 372, 54, 4, WARM, "antenna tip"),
    rect("radio-handle", 168, 144, 66, 14, STONE, 7, "radio handle"),
    ...waveform("radio-wave", 62, 132, 30),
    rect("radio-mug", 320, 348, 44, 40, ROSE, 8, "late mug"),
    path("radio-mug-handle", "M 362 356 Q 378 356 376 370 Q 374 382 362 380", "none", undefined, "mug handle"),
    path("radio-steam", "M 332 344 Q 324 332 334 320", "none", undefined, "steam"),
    ...flower("radio-flower-left", 24, 372, 10, 5, 0),
    ...flower("radio-flower-right", 376, 372, 10, 5, 20),
  ],
  details: [
    { d: "M 72 306 L 188 306 M 72 288 L 188 288", opacity: 0.35 },
    { d: "M 330 158 Q 350 92 372 54", opacity: 0.6 },
  ],
  notes: [
    { regionId: "radio-dial-panel", text: "we're the people to tune in at 1am" },
    { regionId: "radio-moon", text: "superproductive evenings, nights, midnights" },
    { regionId: "radio-mug", text: "still awake, still here" },
  ],
};

const newspaper: Illustration = {
  id: "newspaper",
  title: "Our names in the paper",
  subtitle: "the Telegraph, of all places",
  regions: [
    rect("news-table", 0, 0, 400, 400, WARM, undefined, "table"),
    rect("news-sheet-a", 24, 30, 208, 300, PAPER, 3, "newspaper page"),
    rect("news-sheet-b", 222, 44, 160, 286, "#fbf6ea", 3, "second page"),
    rect("news-masthead", 36, 42, 184, 30, STONE, 2, "masthead"),
    rect("news-headline", 36, 82, 184, 22, "#e5d8c4", 2, "headline bar"),
    rect("news-photo", 36, 114, 184, 78, SKY, 3, "photo"),
    circle("news-photo-face-1", 82, 148, 18, "#d9c2af", "portrait one"),
    circle("news-photo-face-2", 176, 148, 18, "#d9c2af", "portrait two"),
    path("news-photo-hill", "M 36 176 Q 128 154 220 176 L 220 192 L 36 192 Z", "#c8d4bd", undefined, "photo hill"),
    ...Array.from({ length: 12 }, (_, index) => rect(`news-line-a-${index}`, 36 + (index % 2) * 8, 204 + index * 10, index % 3 === 0 ? 128 : 168, 3, STONE, 1, "news line")),
    rect("news-headline-b", 234, 56, 136, 18, "#e5d8c4", 2, "headline bar"),
    ...Array.from({ length: 14 }, (_, index) => rect(`news-line-b-${index}`, 234, 86 + index * 17, 136 - (index % 4) * 18, 3, STONE, 1, "news line")),
    rect("news-clipping", 258, 320, 108, 56, PAPER, 3, "clipping"),
    rect("news-clipping-inner", 266, 328, 92, 40, WARM, 2, "clipping text"),
    circle("news-seal", 312, 338, 11, "#d9a6a1", "wax seal"),
    path("news-fold", "M 232 44 L 232 330", "none", undefined, "fold line"),
    rect("news-coffee", 34, 344, 54, 44, SKY, 8, "coffee cup"),
    ellipse("news-coffee-top", 61, 344, 27, 8, PAPER, undefined, "coffee top"),
    path("news-coffee-handle", "M 86 352 Q 102 352 100 366 Q 98 378 86 376", "none", undefined, "cup handle"),
    path("news-scissors-1", "M 356 344 L 336 380", "none", undefined, "scissor blade"),
    path("news-scissors-2", "M 336 344 L 356 380", "none", undefined, "scissor blade"),
    circle("news-scissor-hole-1", 352, 382, 6, ROSE, "scissor handle"),
    circle("news-scissor-hole-2", 340, 382, 6, LILAC, "scissor handle"),
    ...flower("news-flower-left", 20, 372, 9, 5, 0),
    ...flower("news-flower-right", 380, 268, 9, 5, 20),
    star("news-star", 188, 350, 5),
  ],
  details: [
    { d: "M 232 44 L 232 330", opacity: 0.5 },
    { d: "M 36 82 L 220 82 M 234 56 L 370 56", opacity: 0.4 },
  ],
  notes: [
    { regionId: "news-headline", text: "our names are already on the telgraph together" },
    { regionId: "news-seal", text: "marriage certificate when?~" },
    { regionId: "news-clipping", text: "cut this one out, keep it somewhere safe" },
  ],
};

const humanFood: Illustration = {
  id: "human-food",
  title: "Human food, please",
  subtitle: "get human food asap",
  regions: [
    rect("food-table", 0, 0, 400, 400, WARM, undefined, "table"),
    circle("thali", 200, 206, 168, "#e8dcc9", "steel thali"),
    circle("thali-inner", 200, 206, 150, "#f5efe3", "thali inner"),
    circle("rice-mound", 138, 186, 48, PAPER, "rice"),
    ...Array.from({ length: 18 }, (_, index) => ellipse(`rice-grain-food-${index}`, 104 + (index * 17) % 68, 156 + (index * 23) % 60, 5, 2.5, "#fdfaf3", `rotate(${(index * 40) % 180} ${104 + (index * 17) % 68} ${156 + (index * 23) % 60})`, "rice grain")),
    circle("dal-bowl", 252, 176, 46, SKY, "dal bowl"),
    circle("dal-surface", 252, 176, 36, "#e8cf9a", "dal"),
    ...Array.from({ length: 6 }, (_, index) => circle(`dal-bit-${index}`, 236 + (index * 13) % 32, 164 + (index * 9) % 24, 4, "#d9bd86", "dal bit")),
    ...Array.from({ length: 7 }, (_, index) => rect(`paneer-${index}`, 112 + (index % 4) * 22, 252 + Math.floor(index / 4) * 22, 18, 18, PAPER, 3, "paneer cube")),
    ellipse("maggi-bowl", 292, 276, 54, 34, ROSE, undefined, "maggi bowl"),
    ellipse("maggi-inner", 292, 276, 44, 26, "#e8c48e", undefined, "maggi"),
    ...Array.from({ length: 8 }, (_, index) => path(`noodle-${index}`, `M ${262 + index * 8} 268 Q ${270 + index * 8} 258 ${278 + index * 8} 268`, "none", undefined, "noodle")),
    rect("spoon-handle", 40, 196, 12, 74, STONE, 6, "spoon handle"),
    ellipse("spoon-bowl", 46, 200, 14, 10, STONE, undefined, "spoon bowl"),
    rect("fork-handle", 356, 196, 10, 74, STONE, 5, "fork handle"),
    ...Array.from({ length: 4 }, (_, index) => rect(`fork-tine-${index}`, 356 + index * 3, 184, 2, 14, STONE, 1, "fork tine")),
    ellipse("egg-white", 176, 320, 34, 22, PAPER, undefined, "egg white"),
    circle("egg-yolk", 176, 320, 12, "#f0cf86", "egg yolk"),
    path("chilli", "M 338 330 Q 356 344 342 372 Q 326 356 338 330 Z", "#c8796f", undefined, "green chilli"),
    path("chilli-stem", "M 338 330 L 334 318", "none", undefined, "chilli stem"),
    path("honey-drizzle", "M 96 148 Q 118 132 142 146", "none", undefined, "honey"),
    rect("water-glass", 40, 300, 40, 66, SKY, 6, "water glass"),
    ellipse("water-top", 60, 300, 20, 6, PAPER, undefined, "water surface"),
    ...flower("food-flower-left", 24, 92, 10, 5, 0),
    ...flower("food-flower-right", 376, 92, 10, 5, 20),
    star("food-star", 200, 56, 6),
  ],
  details: [
    { d: "M 262 268 Q 270 258 278 268 M 270 276 Q 278 266 286 276 M 278 284 Q 286 274 294 284", opacity: 0.6 },
    { d: "M 96 148 Q 118 132 142 146", opacity: 0.6 },
  ],
  notes: [
    { regionId: "dal-surface", text: "get human food asap" },
    { regionId: "rice-mound", text: "rice dal paneer, actual human food" },
    { regionId: "maggi-inner", text: "egg, sugar/honey and spicy green chillis" },
    { regionId: "maggi-bowl", text: "maggi is a classification of itself" },
  ],
};

const diaryBook: Illustration = {
  id: "diary-book",
  title: "The books we keep",
  subtitle: "go in the books",
  regions: [
    rect("diary-desk", 0, 0, 400, 400, WARM, undefined, "desk"),
    rect("diary-cover", 78, 40, 244, 320, "#b39a80", 14, "diary cover"),
    rect("diary-cover-inner", 88, 50, 224, 300, "#c7ae94", 10, "diary cover detail"),
    rect("diary-pages", 100, 56, 200, 288, PAPER, 6, "diary pages"),
    rect("diary-spine", 78, 40, 18, 320, "#9c8269", 8, "diary spine"),
    ...Array.from({ length: 5 }, (_, index) => rect(`diary-stitch-${index}`, 84, 72 + index * 60, 8, 14, STONE, 3, "spine stitch")),
    rect("diary-clasp", 296, 176, 34, 48, STONE, 6, "diary clasp"),
    circle("diary-lock", 313, 194, 8, ROSE, "diary lock"),
    path("diary-key", "M 310 280 Q 336 268 344 288", "none", undefined, "key"),
    circle("diary-key-ring", 344, 288, 8, STONE, "key ring"),
    rect("diary-key-bit", 338, 296, 14, 8, STONE, 2, "key bit"),
    ...Array.from({ length: 10 }, (_, index) => rect(`diary-line-${index}`, 118, 78 + index * 24, index % 3 === 2 ? 132 : 168, 2, STONE, 1, "diary line")),
    path("diary-torn-note", "M 130 300 Q 180 286 230 300 L 226 326 Q 180 312 134 326 Z", WARM, undefined, "torn note"),
    ...flower("diary-pressed", 180, 306, 10, 5, 0),
    rect("diary-pencil", 330, 330, 56, 10, "#d9c8b0", 4, "pencil"),
    poly("diary-pencil-tip", "386,330 398,335 386,340", STONE, undefined, "pencil tip"),
    rect("diary-inkpot", 26, 306, 42, 62, SKY, 8, "ink pot"),
    circle("diary-inkpot-lid", 47, 306, 21, STONE, "ink pot lid"),
    star("diary-star-1", 30, 60, 5),
    star("diary-star-2", 368, 60, 5),
    ...flower("diary-flower-left", 24, 244, 9, 5, 0),
    ...flower("diary-flower-right", 376, 244, 9, 5, 20),
  ],
  details: [
    { d: "M 118 78 L 286 78 M 118 102 L 286 102", opacity: 0.35 },
    { d: "M 130 300 Q 180 286 230 300", opacity: 0.5 },
  ],
  notes: [
    { regionId: "diary-cover", text: "go in the books" },
    { regionId: "diary-pages", text: "obsidian diary hehe" },
    { regionId: "diary-lock", text: "and the ones we don't, we just forget" },
  ],
};

const racetrackArt: Illustration = {
  id: "racetrack-art",
  title: "The racetrack at nine",
  subtitle: "an art i made when i was 9, daisy",
  regions: [
    rect("art-paper", 0, 0, 400, 400, PAPER, undefined, "old art paper"),
    rect("art-frame", 22, 22, 356, 356, STONE, 10, "competition frame"),
    rect("art-sheet", 34, 34, 332, 332, WARM, 6, "drawing sheet"),
    ellipse("track-outer", 200, 216, 138, 106, "#e8dcc9", undefined, "racetrack outer"),
    ellipse("track-inner", 200, 216, 96, 68, LEAF, undefined, "racetrack grass"),
    ...Array.from({ length: 16 }, (_, index) => rect(`track-dash-${index}`, 74 + index * 17, 214 + Math.sin(index * 0.8) * 34, 8, 3, PAPER, 1, "track dash")),
    path("car-one-body", "M 118 196 L 168 196 L 176 208 L 168 220 L 118 220 L 110 208 Z", ROSE, undefined, "little car one"),
    circle("car-one-wheel-a", 128, 224, 9, STONE, "wheel"),
    circle("car-one-wheel-b", 160, 224, 9, STONE, "wheel"),
    rect("torn-shirt", 112, 176, 28, 20, SKY, 4, "torn clothes"),
    path("torn-shirt-tear", "M 120 176 L 126 190 L 132 176", "none", undefined, "tear"),
    path("car-two-body", "M 232 196 L 282 196 L 290 208 L 282 220 L 232 220 L 224 208 Z", LILAC, undefined, "little car two"),
    circle("car-two-wheel-a", 242, 224, 9, STONE, "wheel"),
    circle("car-two-wheel-b", 274, 224, 9, STONE, "wheel"),
    circle("hotwheels", 258, 178, 12, WARM, "hotwheels in hand"),
    rect("hotwheels-stripe", 250, 176, 16, 4, ROSE, 2, "hotwheels stripe"),
    path("crayon-sun", "M 300 62 Q 320 46 340 62 Q 356 66 340 82 Q 320 96 300 82 Q 288 66 300 62 Z", "#f0d8a1", undefined, "crayon sun"),
    ...Array.from({ length: 12 }, (_, index) => path(`sun-ray-${index}`, `M ${320 + Math.cos(index * Math.PI / 6) * 46} ${72 + Math.sin(index * Math.PI / 6) * 46} L ${320 + Math.cos(index * Math.PI / 6) * 58} ${72 + Math.sin(index * Math.PI / 6) * 58}`, "none", undefined, "sun ray")),
    cloud("art-cloud-1", 58, 74, 0.55),
    cloud("art-cloud-2", 152, 96, 0.4),
    path("ribbon-left", "M 196 326 Q 164 306 168 322 Q 172 336 196 326 Z", ROSE, undefined, "competition ribbon"),
    path("ribbon-right", "M 204 326 Q 236 306 232 322 Q 228 336 204 326 Z", ROSE, undefined, "competition ribbon"),
    circle("ribbon-medal", 200, 326, 12, "#f0d8a1", "medal"),
    ...Array.from({ length: 10 }, (_, index) => star(`art-star-${index}`, 48 + (index * 37) % 310, 52 + (index * 53) % 280, 3 + (index % 2))),
    ...flower("art-flower-left", 26, 374, 9, 5, 0),
    ...flower("art-flower-right", 374, 374, 9, 5, 20),
  ],
  details: [
    { d: "M 110 208 L 176 208 M 224 208 L 290 208", opacity: 0.5 },
    { d: "M 196 326 Q 164 306 168 322 M 204 326 Q 236 306 232 322", opacity: 0.55 },
  ],
  notes: [
    { regionId: "art-sheet", text: "i made an art when i was 9, daisy" },
    { regionId: "torn-shirt", text: "one in torn clothes, one with a hotwheels in hand" },
    { regionId: "ribbon-medal", text: "and i was so proud of it" },
  ],
};

const bookBinding: Illustration = {
  id: "book-binding",
  title: "A book bound by hand",
  subtitle: "old papers, new stitches",
  regions: [
    rect("bind-desk", 0, 0, 400, 400, WARM, undefined, "worktable"),
    ...quilt("bind-canvas", 0, 0, 8, 8, 50, 50),
    rect("bind-cover-back", 74, 46, 252, 310, "#a98f77", 12, "book cover"),
    rect("bind-cover-front", 92, 46, 234, 310, "#c1a68c", 10, "front cover"),
    rect("bind-page-block", 108, 58, 202, 286, PAPER, 5, "page block"),
    rect("bind-spine", 74, 46, 20, 310, "#937760", 7, "book spine"),
    ...Array.from({ length: 9 }, (_, index) => rect(`bind-stitch-${index}`, 80, 66 + index * 32, 10, 14, STONE, 3, "binding stitch")),
    ...Array.from({ length: 9 }, (_, index) => path(`bind-thread-${index}`, `M 90 ${73 + index * 32} Q 106 ${64 + index * 32} 118 ${73 + index * 32}`, "none", undefined, "thread")),
    rect("bind-corner-tl", 92, 46, 30, 30, STONE, 4, "corner protector"),
    rect("bind-corner-tr", 296, 46, 30, 30, STONE, 4, "corner protector"),
    rect("bind-corner-bl", 92, 326, 30, 30, STONE, 4, "corner protector"),
    rect("bind-corner-br", 296, 326, 30, 30, STONE, 4, "corner protector"),
    rect("bind-label", 148, 92, 122, 54, WARM, 5, "spine label"),
    ...Array.from({ length: 3 }, (_, index) => rect(`bind-label-line-${index}`, 160, 106 + index * 14, 98 - (index % 2) * 20, 3, STONE, 1, "label line")),
    circle("bind-wax-seal", 209, 300, 22, "#d9a6a1", "wax seal"),
    ...flower("bind-seal-flower", 209, 300, 11, 5, 0),
    rect("bind-ribbon", 288, 58, 12, 130, LILAC, 4, "ribbon bookmark"),
    poly("bind-ribbon-tail", "288,188 300,188 294,206", LILAC, undefined, "ribbon tail"),
    path("bind-awl", "M 344 132 L 366 186", "none", undefined, "awl"),
    rect("bind-awl-handle", 336, 108, 18, 30, "#9c8269", 6, "awl handle"),
    path("bind-needle", "M 42 208 L 68 232", "none", undefined, "needle"),
    circle("bind-needle-eye", 42, 208, 3, STONE, "needle eye"),
    path("bind-loose-thread", "M 68 232 Q 90 246 108 226", "none", undefined, "loose thread"),
    circle("bind-wax-drop-1", 44, 306, 8, "#d9a6a1", "wax drop"),
    circle("bind-wax-drop-2", 58, 322, 5, "#e3b7b1", "wax drop"),
    ...flower("bind-flower-left", 24, 70, 10, 5, 0),
    ...flower("bind-flower-right", 376, 370, 10, 5, 20),
    star("bind-star", 372, 60, 5),
  ],
  details: [
    { d: "M 90 73 Q 106 64 118 73 M 90 105 Q 106 96 118 105 M 90 137 Q 106 128 118 137", opacity: 0.6 },
    { d: "M 68 232 Q 90 246 108 226", opacity: 0.6 },
  ],
  notes: [
    { regionId: "bind-cover-front", text: "we loved old papers painted upon by oil and acrylic" },
    { regionId: "bind-wax-seal", text: "custom wax seals for your personal touch" },
    { regionId: "bind-spine", text: "rebinds, and old catholic fonts" },
  ],
};

export const MORE_ILLUSTRATIONS: Illustration[] = [
  quillInk,
  chocolateBox,
  fallLeaves,
  bookshopWindow,
  movieNight,
  poemPage,
  voiceCall,
  molecules,
  rakhiThread,
  gingerCat,
  midnightRadio,
  newspaper,
  humanFood,
  diaryBook,
  racetrackArt,
  bookBinding,
];

export const MORE_FRAME_ACCENTS: Record<string, string> = {
  "quill-ink": LILAC,
  "chocolate-box": ROSE,
  "fall-leaves": "#dcb98d",
  "bookshop-window": SKY,
  "movie-night": LILAC,
  "poem-page": ROSE,
  "voice-call": SKY,
  molecules: LEAF,
  "rakhi-thread": ROSE,
  "ginger-cat": "#d9a878",
  "midnight-radio": LILAC,
  newspaper: STONE,
  "human-food": WARM,
  "diary-book": "#c7ae94",
  "racetrack-art": ROSE,
  "book-binding": WARM,
};
