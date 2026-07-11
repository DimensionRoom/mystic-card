import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import type { DiceShapeId } from "../../data/diceSets";

// จุด UV ของหน้าสามเหลี่ยม (apex บน) — ต้องตรงกับกรอบที่วาดใน runeTextures.triangle
export const TRI_UV = {
  apex: [0.5, 0.94] as const,
  left: [0.07, 0.14] as const,
  right: [0.93, 0.14] as const,
};

export interface DiceShape {
  id: DiceShapeId;
  faceCount: number;
  /** normal ต่อหน้า (local) — index ตรงกับ material group ของ geometry */
  faceNormals: readonly THREE.Vector3[];
  /** สไตล์กรอบ texture ของหน้า */
  frame: "square" | "triangle";
  makeGeometry: (size: number) => THREE.BufferGeometry;
  collider: "cuboid" | "hull";
}

// ─── d6: ลูกบาศก์ขอบมน (ของเดิม) ───
const BOX_NORMALS: readonly THREE.Vector3[] = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

// ─── d8: octahedron 8 หน้าสามเหลี่ยม ───
// เครื่องหมาย (sx,sy,sz) 8 ชุด — ลำดับนี้คือลำดับ material group / faceNormals
const OCTA_SIGNS: readonly [number, number, number][] = [
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
];

const OCTA_NORMALS: readonly THREE.Vector3[] = OCTA_SIGNS.map(
  ([sx, sy, sz]) => new THREE.Vector3(sx, sy, sz).normalize(),
);

/**
 * สร้าง octahedron แบบ 8 material groups + UV ต่อหน้า (ให้ texture หนึ่งใบต่อหน้า)
 * จุดยอด 6 จุด (±r,0,0),(0,±r,0),(0,0,±r) — หน้า (sx,sy,sz) คือสามเหลี่ยมของ
 * จุดยอดแกนละจุดตามเครื่องหมาย; สลับ winding ตาม parity ให้ normal ชี้ออกเสมอ
 */
function makeOctahedron(radius: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const geo = new THREE.BufferGeometry();

  OCTA_SIGNS.forEach(([sx, sy, sz], i) => {
    const vx = [sx * radius, 0, 0];
    const vy = [0, sy * radius, 0];
    const vz = [0, 0, sz * radius];
    // parity บวก → (vx,vy,vz) ทวนเข็มเมื่อมองจากนอก; ลบ → สลับสองตัวท้าย
    const tri = sx * sy * sz > 0 ? [vx, vy, vz] : [vx, vz, vy];
    positions.push(...tri[0], ...tri[1], ...tri[2]);
    const n = OCTA_NORMALS[i];
    for (let k = 0; k < 3; k++) normals.push(n.x, n.y, n.z);
    uvs.push(...TRI_UV.apex, ...TRI_UV.left, ...TRI_UV.right);
    geo.addGroup(i * 3, 3, i);
  });

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return geo;
}

const SHAPES: Record<DiceShapeId, DiceShape> = {
  d6: {
    id: "d6",
    faceCount: 6,
    faceNormals: BOX_NORMALS,
    frame: "square",
    makeGeometry: (size) => new RoundedBoxGeometry(size, size, size, 4, 0.12),
    collider: "cuboid",
  },
  d8: {
    id: "d8",
    faceCount: 8,
    faceNormals: OCTA_NORMALS,
    frame: "triangle",
    // circumradius ~0.72×size ให้ scale ใกล้ลูกบาศก์เดิม (จูนด้วยตาแล้ว)
    makeGeometry: (size) => makeOctahedron(size * 0.72),
    collider: "hull",
  },
};

export function diceShapeById(id: DiceShapeId): DiceShape {
  return SHAPES[id];
}
