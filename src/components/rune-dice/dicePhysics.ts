import * as THREE from "three";
import type { RapierRigidBody } from "@react-three/rapier";

// ค่าฟิสิกส์ทั้งหมดปรับจูนให้ลูกเต๋าขนาด 0.9 ตกลงบนโต๊ะ กระเด้ง 2-3 ครั้ง
// ชนกัน แล้วหยุดใน ~1.5-3 วินาที (ใช้คู่กับ gravity [0,-18,0] และ damping ใน RuneDie)
export const DIE_SIZE = 0.9;

/** จุดเกิด 3 ลูกเหนือโต๊ะ — วางใกล้กันให้ตกมากระทบกันบ่อย (เกิดประกายแสง) */
export const SPAWN: [number, number, number][] = [
  [-0.95, 3.6, 0.2],
  [0, 4.3, -0.35],
  [0.95, 4.0, 0.25],
];
export const SPAWN_JITTER = 0.3; // ± สุ่มบน x/z
export const IMPULSE_XZ = 1.4; // แรงเหวี่ยงแนวราบสูงสุด
export const IMPULSE_Y: [number, number] = [-1.0, -0.2]; // กระแทกลง
export const TORQUE_MAX = 0.25; // แรงบิดต่อแกน
export const TORQUE_MIN_MAG = 0.08; // การันตีว่าหมุนเห็นได้ชัด
export const SETTLE_TIMEOUT_MS = 6000;

// ตำแหน่งวางนิ่งบนโต๊ะ (สถานะเริ่มต้น ก่อนทอยครั้งแรก)
export const REST_SPOTS: [number, number, number][] = [
  [-1.2, DIE_SIZE / 2 + 0.01, 0],
  [0, DIE_SIZE / 2 + 0.01, 0.6],
  [1.2, DIE_SIZE / 2 + 0.01, -0.3],
];

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** รีเซ็ตลูกเต๋าไปจุดเกิด สุ่มหมุน แล้วยิง impulse + torque ให้กลิ้ง */
export function throwDie(
  rb: RapierRigidBody,
  spawn: [number, number, number],
): void {
  const x = spawn[0] + rand(-SPAWN_JITTER, SPAWN_JITTER);
  const z = spawn[2] + rand(-SPAWN_JITTER, SPAWN_JITTER);
  rb.setTranslation({ x, y: spawn[1], z }, true);

  const q = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
    ),
  );
  rb.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
  rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
  rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

  rb.applyImpulse(
    {
      x: rand(-IMPULSE_XZ, IMPULSE_XZ) - x * 0.5, // ดึงเข้ากลางโต๊ะ ให้ลูกมาชนกัน
      y: rand(IMPULSE_Y[0], IMPULSE_Y[1]),
      z: rand(-IMPULSE_XZ, IMPULSE_XZ) - z * 0.5,
    },
    true,
  );

  const torque = () => {
    const v = rand(-TORQUE_MAX, TORQUE_MAX);
    return Math.abs(v) < TORQUE_MIN_MAG ? Math.sign(v || 1) * TORQUE_MIN_MAG : v;
  };
  rb.applyTorqueImpulse({ x: torque(), y: torque(), z: torque() }, true);
}

/** สะกิดลูกเต๋าที่ตะแคง (พิงกำแพง/พิงลูกอื่น) ให้หงายใหม่ */
export function nudgeDie(rb: RapierRigidBody): void {
  rb.wakeUp();
  rb.applyImpulse({ x: rand(-0.3, 0.3), y: 0.9, z: rand(-0.3, 0.3) }, true);
  rb.applyTorqueImpulse({ x: rand(-0.1, 0.1), y: 0, z: rand(-0.1, 0.1) }, true);
}

// normal ของ 6 หน้า (local) → index วัสดุ ตรงกับลำดับ group ของ BoxGeometry
// [+X, -X, +Y, -Y, +Z, -Z]
const FACE_NORMALS: ReadonlyArray<readonly [THREE.Vector3, number]> = [
  [new THREE.Vector3(1, 0, 0), 0],
  [new THREE.Vector3(-1, 0, 0), 1],
  [new THREE.Vector3(0, 1, 0), 2],
  [new THREE.Vector3(0, -1, 0), 3],
  [new THREE.Vector3(0, 0, 1), 4],
  [new THREE.Vector3(0, 0, -1), 5],
];
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const _tmp = new THREE.Vector3();
const _q = new THREE.Quaternion();

/**
 * อ่านว่าหน้าไหนหงายขึ้น: หมุน normal ทั้ง 6 ด้วย quaternion โลกของลูกเต๋า
 * แล้วเลือกอันที่ dot กับ (0,1,0) มากสุด — confidence ≈ 1.0 เมื่อวางเรียบสนิท
 */
export function readUpFace(rb: RapierRigidBody): {
  faceIndex: number;
  confidence: number;
} {
  const r = rb.rotation();
  _q.set(r.x, r.y, r.z, r.w);
  let faceIndex = 0;
  let confidence = -Infinity;
  for (const [normal, idx] of FACE_NORMALS) {
    const dot = _tmp.copy(normal).applyQuaternion(_q).dot(WORLD_UP);
    if (dot > confidence) {
      confidence = dot;
      faceIndex = idx;
    }
  }
  return { faceIndex, confidence };
}

/** true เมื่อความเร็วเชิงเส้น/เชิงมุมต่ำกว่าเกณฑ์ (นิ่งพอ) */
export function isCalm(rb: RapierRigidBody): boolean {
  const lv = rb.linvel();
  const av = rb.angvel();
  return (
    Math.hypot(lv.x, lv.y, lv.z) < 0.12 && Math.hypot(av.x, av.y, av.z) < 0.25
  );
}
