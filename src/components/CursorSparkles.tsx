import { useEffect, useRef } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: "pink" | "purple" | "gold";
}

const HUE_COLOR: Record<Sparkle["hue"], string> = {
  pink: "#F76AA0",
  purple: "#8D6EB7",
  gold: "#F6C453",
};
const HUES = Object.keys(HUE_COLOR) as Sparkle["hue"][];

/** เอฟเฟกต์ประกายดาวลอยตามเมาส์ ให้ความรู้สึกเหมือนกำลังใช้ไม้กายสิทธิ์ */
export default function CursorSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawn = useRef(0);
  const nextId = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // ข้ามบนมือถือ/แตะหน้าจอ

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn.current < 45) return; // จำกัดความถี่ ไม่ให้สร้าง node รัวเกินไป
      lastSpawn.current = now;

      const container = containerRef.current;
      if (!container) return;

      const sparkle: Sparkle = {
        id: nextId.current++,
        x: e.clientX + (Math.random() - 0.5) * 14,
        y: e.clientY + (Math.random() - 0.5) * 14,
        size: 6 + Math.random() * 8,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
      };

      const el = document.createElement("span");
      el.textContent = "✦";
      el.setAttribute("aria-hidden", "true");
      el.className = "cursor-sparkle";
      el.style.left = `${sparkle.x}px`;
      el.style.top = `${sparkle.y}px`;
      el.style.fontSize = `${sparkle.size}px`;
      el.style.color = HUE_COLOR[sparkle.hue];
      container.appendChild(el);

      window.setTimeout(() => el.remove(), 650);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    />
  );
}
