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

// cache texture ต่อ (runeId + สีเน้น) — สูงสุด 24×3 = 72 ใบ, ไม่ dispose ระหว่างทอย
const cache = new Map<string, THREE.CanvasTexture>();

/** วาดหน้าลูกเต๋า: พื้นงาช้าง + glyph รูนสีเน้น ลงบน canvas 256×256 */
export function runeFaceTexture(
  glyph: string,
  runeId: string,
  accent: string,
): THREE.CanvasTexture {
  const key = `${runeId}:${accent}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#fdf6ee"; // เนื้อลูกเต๋าสีงาช้าง
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 44);
  ctx.fill();

  ctx.strokeStyle = "rgba(124,90,232,0.22)"; // ขอบนูนบาง ๆ
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(9, 9, size - 18, size - 18, 36);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = '148px "Noto Sans Runic"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, size / 2, size / 2 + 6);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/** felt สีม่วงมีวงทอง + ดาว (พื้นโต๊ะ) — CanvasTexture ไม่ต้องใช้ไฟล์ภาพ */
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
  g.addColorStop(0, "#4a3572");
  g.addColorStop(1, "#2e2153");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(240,200,140,0.35)"; // วงทองบาง
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.25)"; // ดาวเล็ก ๆ
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
