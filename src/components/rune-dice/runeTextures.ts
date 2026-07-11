import * as THREE from "three";

// โหลดฟอนต์ Noto Sans Runic ครั้งเดียว (macOS/Windows ไม่มี glyph บล็อก Runic ครบ)
let fontPromise: Promise<void> | null = null;
export function ensureRuneFont(): Promise<void> {
  fontPromise ??= new FontFace(
    "Noto Sans Runic",
    'url(/fonts/NotoSansRunic-Regular.woff2) format("woff2")',
  )
    .load()
    .then(async (f) => {
      document.fonts.add(f);
      // canvas 2d ยังไม่เห็นฟอนต์จนกว่าจะ load ที่ขนาดที่ใช้จริง
      await document.fonts.load('148px "Noto Sans Runic"');
    })
    .catch(() => {
      // ถ้าโหลดฟอนต์ไม่ได้ ปล่อยให้ระบบ fallback — glyph อาจไม่ขึ้น แต่ไม่ crash
    });
  return fontPromise;
}

// gradient ทองเมทัลลิก (แนวทแยง) — highlight → ทอง → ทองเข้ม ให้ดูมีประกาย
function goldGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): CanvasGradient {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#fff3c4");
  g.addColorStop(0.28, "#e8c25a");
  g.addColorStop(0.5, "#c8931f");
  g.addColorStop(0.72, "#e8c25a");
  g.addColorStop(1, "#8a5f14");
  return g;
}

// ลวดลายมุม (bracket + หัวหอก + เพชรเล็ก) วาดที่มุมกรอบทอง หมุนตามมุม
function cornerOrnament(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rot: number,
  gold: string | CanvasGradient,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = gold;
  ctx.fillStyle = gold;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // L-bracket
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(0, 0);
  ctx.lineTo(30, 0);
  ctx.stroke();
  // หัวหอกปลายทั้งสองข้าง
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(-5, 23);
  ctx.moveTo(0, 30);
  ctx.lineTo(5, 23);
  ctx.moveTo(30, 0);
  ctx.lineTo(23, -5);
  ctx.moveTo(30, 0);
  ctx.lineTo(23, 5);
  ctx.stroke();
  // เพชรเล็กที่มุม
  ctx.beginPath();
  ctx.moveTo(9, 0);
  ctx.lineTo(0, -9);
  ctx.lineTo(-9, 0);
  ctx.lineTo(0, 9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// cache ต่อ cacheKey (`${set}:${symbol}:${frame}`) — ไม่ dispose ระหว่างทอย
const cache = new Map<string, THREE.CanvasTexture>();

// ฟอนต์วาด glyph: รูนใช้ Noto Sans Runic (โหลดเอง) ส่วนราศี/ดาวเคราะห์
// พึ่ง system symbol fonts (VS-15 ในสตริงบังคับ text presentation แล้ว)
const GLYPH_FONT = '"Noto Sans Runic", "Apple Symbols", "Segoe UI Symbol", sans-serif';

/**
 * วาดหน้าลูกเต๋าแบบ obsidian ดำ + กรอบทองแกะสลัก + glyph ทองนูน (canvas 256×256)
 * frame "square" = หน้าลูกบาศก์ d6, "triangle" = หน้า octahedron d8
 * (พิกัดสามเหลี่ยมต้องตรงกับ TRI_UV ใน diceShapes.ts)
 */
export function faceTexture(
  glyph: string,
  cacheKey: string,
  frame: "square" | "triangle" = "square",
  style: "gold" | "crystal" = "gold",
): THREE.CanvasTexture {
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const c2 = document.createElement("canvas");
  c2.width = c2.height = 256;
  const tex =
    style === "crystal"
      ? drawCrystalTriangleFace(c2, glyph)
      : frame === "triangle"
        ? drawTriangleFace(c2, glyph)
        : drawSquareFace(c2, glyph);
  cache.set(cacheKey, tex);
  return tex;
}

function drawSquareFace(c: HTMLCanvasElement, glyph: string): THREE.CanvasTexture {
  const size = 256;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const ctx = c.getContext("2d")!;

  // 1) พื้นทองเต็มสี่เหลี่ยม (ถึงมุมทุกมุม) — ขอบลูกบาศก์จึงเป็นทองเต็ม ไม่มีช่องดำ
  ctx.fillStyle = goldGradient(ctx, 0, 0, size, size);
  ctx.fillRect(0, 0, size, size);

  // 2) แผงดำเว้ากรอบทอง
  const inset = 22;
  const panel = ctx.createLinearGradient(0, inset, 0, size - inset);
  panel.addColorStop(0, "#211d18");
  panel.addColorStop(1, "#0a0908");
  ctx.fillStyle = panel;
  ctx.beginPath();
  ctx.roundRect(inset, inset, size - 2 * inset, size - 2 * inset, 20);
  ctx.fill();

  // เงาในกรอบ (ให้แผงดูยุบลง)
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(inset + 1.5, inset + 1.5, size - 2 * inset - 3, size - 2 * inset - 3, 18);
  ctx.stroke();

  // 3) เส้นทองบางด้านในแผง
  const hair = inset + 14;
  ctx.strokeStyle = goldGradient(ctx, hair, hair, size - hair, size - hair);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(hair, hair, size - 2 * hair, size - 2 * hair, 12);
  ctx.stroke();

  // 4) ลวดลายมุม 4 มุม
  const gold = goldGradient(ctx, 0, 0, size, size);
  const m = hair + 6;
  cornerOrnament(ctx, m, m, 0, gold);
  cornerOrnament(ctx, size - m, m, Math.PI / 2, gold);
  cornerOrnament(ctx, size - m, size - m, Math.PI, gold);
  cornerOrnament(ctx, m, size - m, -Math.PI / 2, gold);

  // 5) glyph ทองนูน (engraved): เงายุบ → ทอง gradient แนวตั้ง → ขอบเข้ม
  engraveGlyph(ctx, glyph, cx, cy, 150);

  return toTexture(c);
}

/** วาด glyph สไตล์แกะสลัก (เงายุบ + gradient + ขอบคม) — palette ทอง หรือ ม่วงคริสตัล */
function engraveGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  cx: number,
  cy: number,
  px: number,
  palette: "gold" | "violet" = "gold",
): void {
  ctx.font = `${px}px ${GLYPH_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // เงายุบลง (ล่าง-ขวา)
  ctx.fillStyle = palette === "violet" ? "rgba(30,10,70,0.35)" : "rgba(0,0,0,0.6)";
  ctx.fillText(glyph, cx + 2.5, cy + 3);
  // gradient แนวตั้ง (สว่างบน → เข้มล่าง ให้ดูนูน)
  const g = ctx.createLinearGradient(0, cy - px * 0.47, 0, cy + px * 0.47);
  if (palette === "violet") {
    // ม่วงเข้มบนแก้วใส — อ่านชัดแบบ stained glass
    g.addColorStop(0, "#8b5cf6");
    g.addColorStop(0.5, "#6d28d9");
    g.addColorStop(1, "#4c1d95");
  } else {
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#ffffff");
    g.addColorStop(1, "#ffffff");
    g.addColorStop(1, "#ffffff");
  }
  ctx.fillStyle = g;
  ctx.fillText(glyph, cx, cy);
  // ขอบเข้มให้คมเหมือนแกะร่อง
  ctx.lineWidth = 1.6;
  ctx.strokeStyle =
    palette === "violet" ? "rgba(45,15,95,0.9)" : "rgba(90,60,10,0.85)";
  ctx.strokeText(glyph, cx, cy);
}

function toTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * หน้าสามเหลี่ยม (d8): พื้นทองเต็มผืน + แผงดำสามเหลี่ยมเว้ากรอบ + glyph ที่ centroid
 * พิกัดสามเหลี่ยม (apex บน) ตรงกับ TRI_UV ใน diceShapes.ts:
 * apex(128,15) left(18,220) right(238,220) บน canvas 256 (แกน y กลับจาก UV)
 */
function drawTriangleFace(c: HTMLCanvasElement, glyph: string): THREE.CanvasTexture {
  const size = 256;
  const ctx = c.getContext("2d")!;

  // จุดยอดสามเหลี่ยมตาม UV (v → y = (1-v)*size)
  const A = { x: 0.5 * size, y: (1 - 0.94) * size }; // apex
  const L = { x: 0.07 * size, y: (1 - 0.14) * size };
  const R = { x: 0.93 * size, y: (1 - 0.14) * size };

  // 1) พื้นทองเต็มผืน — ขอบ/สันของ octahedron จึงเป็นทองเสมอ
  ctx.fillStyle = goldGradient(ctx, 0, 0, size, size);
  ctx.fillRect(0, 0, size, size);

  // 2) แผงดำสามเหลี่ยมหดเข้าจากขอบ (คงกรอบทองหนาไว้)
  const cx = (A.x + L.x + R.x) / 3;
  const cy = (A.y + L.y + R.y) / 3;
  const shrink = (p: { x: number; y: number }, k: number) => ({
    x: cx + (p.x - cx) * k,
    y: cy + (p.y - cy) * k,
  });
  const a1 = shrink(A, 0.8);
  const l1 = shrink(L, 0.8);
  const r1 = shrink(R, 0.8);
  const panel = ctx.createLinearGradient(0, a1.y, 0, l1.y);
  panel.addColorStop(0, "#211d18");
  panel.addColorStop(1, "#0a0908");
  ctx.fillStyle = panel;
  ctx.beginPath();
  ctx.moveTo(a1.x, a1.y);
  ctx.lineTo(l1.x, l1.y);
  ctx.lineTo(r1.x, r1.y);
  ctx.closePath();
  ctx.fill();
  // เงาในกรอบ (แผงดูยุบลง)
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3) เส้นทองบางด้านในแผง
  const a2 = shrink(A, 0.66);
  const l2 = shrink(L, 0.66);
  const r2 = shrink(R, 0.66);
  ctx.strokeStyle = goldGradient(ctx, l2.x, a2.y, r2.x, l2.y);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(a2.x, a2.y);
  ctx.lineTo(l2.x, l2.y);
  ctx.lineTo(r2.x, r2.y);
  ctx.closePath();
  ctx.stroke();

  // เพชรเล็กที่มุมทั้งสาม (ลวดลายแบบเดียวกับมุมกรอบ d6)
  ctx.fillStyle = goldGradient(ctx, 0, 0, size, size);
  for (const p of [shrink(A, 0.52), shrink(L, 0.52), shrink(R, 0.52)]) {
    ctx.beginPath();
    ctx.moveTo(p.x + 7, p.y);
    ctx.lineTo(p.x, p.y - 7);
    ctx.lineTo(p.x - 7, p.y);
    ctx.lineTo(p.x, p.y + 7);
    ctx.closePath();
    ctx.fill();
  }

  // 4) glyph ที่ centroid (เล็กกว่า d6 เพราะพื้นที่สามเหลี่ยมแคบกว่า)
  engraveGlyph(ctx, glyph, cx, cy + 14, 96);

  return toTexture(c);
}

/**
 * หน้าคริสตัลจักรวาล (d8): อวกาศดำสนิท มีกาแล็กซีจิ๋วคละขนาดหลากสี
 * กระจายรอบหน้า + ดาวหลากสีระยิบ + glyph ทองแกะสลักตรงกลาง
 */
function drawCrystalTriangleFace(
  c: HTMLCanvasElement,
  glyph: string,
): THREE.CanvasTexture {
  const size = 256;
  const ctx = c.getContext("2d")!;

  const A = { x: 0.5 * size, y: (1 - 0.94) * size };
  const L = { x: 0.07 * size, y: (1 - 0.14) * size };
  const R = { x: 0.93 * size, y: (1 - 0.14) * size };
  const cx = (A.x + L.x + R.x) / 3;
  const cy = (A.y + L.y + R.y) / 3;

  // 1) พื้นอวกาศดำสนิท (แต้มน้ำเงินม่วงจาง ๆ ตรงกลางกันแบนเกิน)
  const body = ctx.createRadialGradient(cx, cy, 6, cx, cy, size * 0.66);
  body.addColorStop(0, "#12081f");
  body.addColorStop(0.55, "#080312");
  body.addColorStop(1, "#000000");
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);

  // 2) กาแล็กซีจิ๋วคละขนาดหลากสี กระจายรอบหน้า (เว้นกลางไว้ให้ glyph)
  const MINI_GALAXIES: [number, number, number, string, string][] = [
    // [x, y, ขนาด, สีแขนหลัก, สีแกน]
    [cx - 52, cy - 26, 20, "192,132,252", "255,240,255"], // ม่วง
    [cx + 46, cy - 34, 15, "125,211,252", "230,250,255"], // ฟ้า
    [cx + 52, cy + 34, 18, "249,168,212", "255,240,246"], // ชมพู
    [cx - 40, cy + 46, 13, "252,211,77", "255,250,230"], // ทอง
    [cx + 2, cy - 62, 11, "153,246,228", "240,255,252"], // เขียวมิ้นต์
  ];
  for (const [gx, gy, gr, rgb, coreRgb] of MINI_GALAXIES) {
    // แขนก้นหอย 2 ข้างของกาแล็กซีจิ๋ว
    const tilt = Math.random() * Math.PI;
    for (let arm = 0; arm < 2; arm++) {
      const offset = arm * Math.PI + tilt;
      for (let t = 0; t < 3.6; t += 0.09) {
        const rr = 2 + (t / 3.6) * gr;
        const ang = t * 1.7 + offset;
        const fade = 1 - t / 3.6;
        ctx.fillStyle = `rgba(${rgb},${(0.55 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(
          gx + rr * Math.cos(ang),
          gy + rr * Math.sin(ang) * 0.8,
          (gr / 9) * fade + 0.6,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    const cg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr * 0.55);
    cg.addColorStop(0, `rgba(${coreRgb},0.9)`);
    cg.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = cg;
    ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
  }

  // 3) ดาว: จุดเล็กหลากสีทั่วหน้า + ประกาย 4 แฉกไม่กี่ดวง
  const STAR_TINTS = ["255,255,255", "216,180,254", "165,224,252", "254,215,170"];
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const tint = STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)];
    ctx.fillStyle = `rgba(${tint},${0.35 + Math.random() * 0.6})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.5 + Math.random() * 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  const sparkle = (x: number, y: number, s: number) => {
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    ctx.stroke();
  };
  sparkle(cx - 52, cy + 30, 7);
  sparkle(cx + 48, cy - 26, 6);
  sparkle(cx + 20, cy + 58, 5);
  sparkle(cx - 18, cy - 60, 5);

  // 5) glyph ทองแกะสลัก (เหมือนตราทองบนหน้าในภาพอ้างอิง)
  engraveGlyph(ctx, glyph, cx, cy + 14, 96, "gold");

  return toTexture(c);
}

/**
 * สัญลักษณ์ทองเรืองแสง (โผล่หลังลูกคริสตัลแตก) — พื้นโปร่งใส
 * glow ทองนุ่มด้านหลัง + glyph ทองแกะสลักตัวใหญ่
 */
export function glyphBurstTexture(glyph: string): THREE.CanvasTexture {
  const key = `burst:${glyph}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const s = 256;
  const cx = s / 2;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;

  // แสงเรืองทองนุ่มรอบสัญลักษณ์
  const halo = ctx.createRadialGradient(cx, cx, 0, cx, cx, s * 0.5);
  halo.addColorStop(0, "rgb(21, 6, 18)");
  halo.addColorStop(0.2, "rgb(44, 11, 53)");
  halo.addColorStop(1, "rgba(72, 16, 68, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, s, s);

  // glyph ทองแกะสลักตัวใหญ่กลางภาพ
  engraveGlyph(ctx, glyph, cx, cx + 6, 200, "gold");

  const tex = toTexture(c);
  cache.set(key, tex);
  return tex;
}

// กาแล็กซีก้นหอยในลูกเต๋าคริสตัล — sprite หมุนวนอยู่กลางเนื้อแก้ว
let galaxyTex: THREE.CanvasTexture | null = null;
export function galaxyTexture(): THREE.CanvasTexture {
  if (galaxyTex) return galaxyTex;
  const s = 256;
  const cx = s / 2;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;

  // แกนกลางเรืองขาว — texture เป็นโทนขาวกลาง ๆ เพื่อให้ tint สีต่อ sprite ได้
  const core = ctx.createRadialGradient(cx, cx, 0, cx, cx, 46);
  core.addColorStop(0, "rgba(255,255,255,0.95)");
  core.addColorStop(0.35, "rgba(245,240,255,0.7)");
  core.addColorStop(1, "rgba(235,230,255,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, s, s);

  // แขนก้นหอย 3 แขน (logarithmic spiral) โทนขาวนวล จางปลาย
  const ARM_COLORS = ["255,250,255", "245,240,255", "235,240,255"];
  for (let arm = 0; arm < 3; arm++) {
    const offset = (arm * Math.PI * 2) / 3;
    const rgb = ARM_COLORS[arm];
    for (let t = 0; t < 4.6; t += 0.055) {
      const r = 8 + t * 21;
      const a = t * 1.35 + offset;
      const x = cx + r * Math.cos(a);
      const y = cx + r * Math.sin(a);
      const fade = 1 - t / 4.6;
      ctx.fillStyle = `rgba(${rgb},${(0.75 * fade).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 7 * fade + 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ดาวประกายเล็ก ๆ โปรยทั่ว
  for (let i = 0; i < 46; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 14 + Math.random() * 100;
    ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(
      cx + r * Math.cos(a),
      cx + r * Math.sin(a),
      0.6 + Math.random() * 1.1,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  galaxyTex = new THREE.CanvasTexture(c);
  galaxyTex.colorSpace = THREE.SRGBColorSpace;
  return galaxyTex;
}

// ออร่ารอบลูกเต๋า — radial gradient ทองนุ่ม โปร่งขอบ (ใช้กับ sprite)
let auraTex: THREE.CanvasTexture | null = null;
export function auraTexture(): THREE.CanvasTexture {
  if (auraTex) return auraTex;
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.22, "rgba(255,226,150,0.6)");
  g.addColorStop(0.55, "rgba(255,205,120,0.2)");
  g.addColorStop(1, "rgba(255,205,120,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  auraTex = new THREE.CanvasTexture(c);
  auraTex.colorSpace = THREE.SRGBColorSpace;
  return auraTex;
}

/** felt สีม่วงเข้มมีวงทอง + ดาว (พื้นโต๊ะ) — CanvasTexture ไม่ต้องใช้ไฟล์ภาพ */
let feltTex: THREE.CanvasTexture | null = null;
export function feltTexture(): THREE.CanvasTexture {
  if (feltTex) return feltTex;

  const w = 512;
  const h = 352;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    30,
    w / 2,
    h / 2,
    Math.max(w, h) / 1.4,
  );
  g.addColorStop(0, "#3d2b60");
  g.addColorStop(1, "#241a44");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(230,190,110,0.4)"; // วงทองบาง
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,240,210,0.25)"; // ดาวเล็ก ๆ
  for (let i = 0; i < 30; i++) {
    const r = 0.5 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2);
    ctx.fill();
  }

  feltTex = new THREE.CanvasTexture(c);
  feltTex.colorSpace = THREE.SRGBColorSpace;
  return feltTex;
}

/** คืน texture ทั้งหมดตอน unmount board */
export function disposeRuneTextures(): void {
  cache.forEach((t) => t.dispose());
  cache.clear();
  feltTex?.dispose();
  feltTex = null;
  auraTex?.dispose();
  auraTex = null;
  galaxyTex?.dispose();
  galaxyTex = null;
}
