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

// cache ต่อ runeId — 24 ใบ, ไม่ dispose ระหว่างทอย
const cache = new Map<string, THREE.CanvasTexture>();

/**
 * วาดหน้าลูกเต๋าแบบ obsidian ดำ + กรอบทองแกะสลัก + รูนทองนูน (canvas 256×256)
 * ทุกลูกเป็นทองเหมือนกัน (ตามภาพอ้างอิง) — ทองอบไว้ใน texture ให้ดูเมทัลลิก
 */
export function runeFaceTexture(glyph: string, runeId: string): THREE.CanvasTexture {
  const hit = cache.get(runeId);
  if (hit) return hit;

  const size = 256;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const c = document.createElement("canvas");
  c.width = c.height = size;
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

  // 5) รูนทองนูน (engraved): เงายุบ → ทอง gradient แนวตั้ง → ขอบเข้ม
  ctx.font = '150px "Noto Sans Runic"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // เงายุบลง (ล่าง-ขวา)
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillText(glyph, cx + 2.5, cy + 3);
  // ทอง gradient แนวตั้ง (สว่างบน → เข้มล่าง ให้ดูนูน)
  const gtext = ctx.createLinearGradient(0, cy - 70, 0, cy + 70);
  gtext.addColorStop(0, "#fff6cf");
  gtext.addColorStop(0.45, "#eac35a");
  gtext.addColorStop(0.6, "#c8931f");
  gtext.addColorStop(1, "#e6bb52");
  ctx.fillStyle = gtext;
  ctx.fillText(glyph, cx, cy);
  // ขอบเข้มให้คมเหมือนแกะร่อง
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = "rgba(90,60,10,0.85)";
  ctx.strokeText(glyph, cx, cy);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(runeId, tex);
  return tex;
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
}
