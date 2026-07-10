import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const POOL = 120; // จำนวนอนุภาคสูงสุดในพูล
const PER_BURST = 14; // อนุภาคต่อการชน 1 ครั้ง
const LIFE = 0.36; // อายุอนุภาค (วินาที)
const GOLD = new THREE.Color("#ffdf8a");

// ขอบเขตที่ประกายยังโชว์ได้ — เลยขอบนี้/ต่ำกว่าพื้น = ดับทันที กันทิ้งรอยบนฉาก
const FLOOR_Y = 0.06; // ระดับผิว felt
const CEIL_Y = 7;
const HALF_X = 4.1;
const HALF_Z = 2.8;
const PARKED_Y = -1000; // เก็บอนุภาคที่ตายไว้ใต้ฉาก

export interface SparkBurstHandle {
  emit: (x: number, y: number, z: number) => void;
}

// sprite จุดกลมนุ่ม (radial gradient) ให้ประกายดูเป็นแสงกลม ไม่ใช่สี่เหลี่ยม
function sparkSprite(): THREE.CanvasTexture {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * ประกายแสงทองแบบ pool — เรียก emit(x,y,z) ตอนลูกเต๋าชนกัน
 * อนุภาคพุ่งออก + ตกด้วยแรงโน้มถ่วง + จางเป็นดำ (additive blending = หายไป)
 */
const SparkBurst = forwardRef<SparkBurstHandle>(function SparkBurst(_props, ref) {
  const positions = useMemo(() => new Float32Array(POOL * 3), []);
  const colors = useMemo(() => new Float32Array(POOL * 3), []);
  const vel = useMemo(() => new Float32Array(POOL * 3), []);
  const life = useMemo(() => new Float32Array(POOL), []); // 0 = ตาย
  const cursor = useRef(0);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  const sprite = useMemo(() => sparkSprite(), []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.2,
        map: sprite,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [sprite],
  );

  useEffect(() => {
    return () => {
      geom.dispose();
      mat.dispose();
      sprite.dispose();
    };
  }, [geom, mat, sprite]);

  useImperativeHandle(
    ref,
    () => ({
      emit(x, y, z) {
        for (let k = 0; k < PER_BURST; k++) {
          const i = cursor.current;
          cursor.current = (cursor.current + 1) % POOL;
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;
          // พุ่งออกทุกทิศ เอียงขึ้น — ความเร็วพอประมาณให้ประกายอยู่ใกล้ลูกเต๋า
          const a = Math.random() * Math.PI * 2;
          const speed = 1.3 + Math.random() * 1.8;
          vel[i * 3] = Math.cos(a) * speed;
          vel[i * 3 + 1] = 1.4 + Math.random() * 1.8;
          vel[i * 3 + 2] = Math.sin(a) * speed;
          life[i] = LIFE * (0.7 + Math.random() * 0.3);
          colors[i * 3] = GOLD.r;
          colors[i * 3 + 1] = GOLD.g;
          colors[i * 3 + 2] = GOLD.b;
        }
        geom.attributes.position.needsUpdate = true;
        geom.attributes.color.needsUpdate = true;
      },
    }),
    [positions, colors, vel, life, geom],
  );

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    let dirty = false;
    for (let i = 0; i < POOL; i++) {
      if (life[i] <= 0) continue;
      dirty = true;
      life[i] -= step;
      vel[i * 3 + 1] -= 9 * step; // แรงโน้มถ่วง
      const px = (positions[i * 3] += vel[i * 3] * step);
      const py = (positions[i * 3 + 1] += vel[i * 3 + 1] * step);
      const pz = (positions[i * 3 + 2] += vel[i * 3 + 2] * step);
      // ดับเมื่อหมดอายุ หรือถึงพื้น/เลยขอบกระดาน — กันประกายทิ้งรอยบนฉาก
      const outOfBounds =
        py < FLOOR_Y ||
        py > CEIL_Y ||
        px < -HALF_X ||
        px > HALF_X ||
        pz < -HALF_Z ||
        pz > HALF_Z;
      if (life[i] <= 0 || outOfBounds) {
        life[i] = 0;
        positions[i * 3 + 1] = PARKED_Y; // เก็บออกไปใต้ฉาก
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0;
        continue;
      }
      const f = life[i] / LIFE; // จางตามอายุ
      colors[i * 3] = GOLD.r * f;
      colors[i * 3 + 1] = GOLD.g * f;
      colors[i * 3 + 2] = GOLD.b * f;
    }
    if (dirty) {
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }
  });

  return <points geometry={geom} material={mat} frustumCulled={false} />;
});

export default SparkBurst;
