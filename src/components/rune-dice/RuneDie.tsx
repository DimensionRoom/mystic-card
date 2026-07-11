import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import type { DiceSymbol } from "../../data/diceSets";
import type { DiceShape } from "./diceShapes";
import { auraTexture, ensureRuneFont, faceTexture } from "./runeTextures";
import { DIE_SIZE } from "./dicePhysics";

interface RuneDieProps {
  /** สัญลักษณ์ที่แจกให้หน้าลูกเต๋าลูกนี้ (ยาว = shape.faceCount, index ตรง material group) */
  faces: DiceSymbol[];
  /** ทรงลูกเต๋า (d6 ลูกบาศก์ / d8 octahedron) จาก diceShapes */
  shape: DiceShape;
  /** id ชุดลูกเต๋า — ใช้เป็นส่วนของ cache key ให้ texture ไม่ชนกันข้ามชุด */
  setId: string;
  position: [number, number, number];
  onCollide?: (payload: CollisionEnterPayload) => void;
  /** เรืองแสงหลังทอยเสร็จ (phase === "revealed") */
  glow?: boolean;
}

const RuneDie = forwardRef<RapierRigidBody, RuneDieProps>(function RuneDie(
  { faces, shape, setId, position, onCollide, glow = false },
  ref,
) {
  // วัสดุเมทัลลิก: ทองอบใน map, ตัวลูกดำมัน — สะท้อนแสงจาก Environment ในซีน
  const materials = useMemo(
    () =>
      Array.from(
        { length: shape.faceCount },
        () =>
          new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.9,
            envMapIntensity: 1.7,
            emissive: new THREE.Color("#ffffff"),
            emissiveIntensity: 0,
          }),
      ),
    [shape.faceCount],
  );

  // เรขาคณิตตามทรง — ทั้งสองทรงคงกลุ่มวัสดุรายหน้า + UV รายหน้า
  const dieGeometry = useMemo(() => shape.makeGeometry(DIE_SIZE), [shape]);

  // เปลี่ยน texture ทุกครั้งที่หน้าถูกแจกใหม่ (ก่อนยิง impulse รอบถัดไป)
  // วาดหลังฟอนต์พร้อมเสมอ กัน cache เก็บ glyph ที่เป็นกล่องเปล่า (tofu)
  useEffect(() => {
    let cancelled = false;
    void ensureRuneFont().then(() => {
      if (cancelled) return;
      faces.forEach((sym, i) => {
        if (i >= materials.length) return;
        const tex = faceTexture(
          sym.glyph,
          `${setId}:${sym.id}:${shape.frame}`,
          shape.frame,
        );
        materials[i].map = tex;
        // emissiveMap = texture เดียวกัน → เฉพาะทองเปล่งแสง แผงดำเรือง ≈ 0
        materials[i].emissiveMap = tex;
        materials[i].needsUpdate = true;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [faces, materials, setId, shape.frame]);

  // วัสดุ sprite ออร่า (ทองเรือง โปร่งขอบ) — เริ่มโปร่งใส
  const auraMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: auraTexture(),
        color: new THREE.Color("#833ef1"),
        transparent: true,
        depthWrite: true, // ให้ sprite เขียน depth buffer → ถูกบังโดยลูกเต๋า
        depthTest: false, // ไม่ให้พื้นโต๊ะบัง sprite → ไม่มีเส้นตรงตัดแสง
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    [],
  );

  // ค่อย ๆ เพิ่ม/ลดออร่าตาม glow — ผิวเรือง + halo sprite + แสงเปล่งลงโต๊ะ เต้นนุ่ม ๆ
  const t = useRef(0);
  const gRef = useRef(0); // 0..1 ระดับออร่าปัจจุบัน (ramp นุ่ม)
  const spriteRef = useRef<THREE.Sprite>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((_, dt) => {
    t.current += dt;
    gRef.current += ((glow ? 1 : 0) - gRef.current) * Math.min(dt * 4, 1);
    const g = gRef.current;
    const pulse = 0.5 + 0.5 * Math.sin(t.current * 3);
    // ผิวทองเปล่งแสง
    const em = g * (0.3 + 0.5 * pulse);
    for (const m of materials) m.emissiveIntensity = em;
    // halo sprite
    auraMat.opacity = g * (0.5 + 0.35 * pulse);
    if (spriteRef.current) {
      const s = 1.9 + g * (0.3 + 0.35 * pulse);
      spriteRef.current.scale.set(s, s, s);
    }
    // แสงออร่าเปล่งลงพื้นโต๊ะรอบ ๆ
    if (lightRef.current) lightRef.current.intensity = g * (2.4 + 1.4 * pulse);
  });

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
      auraMat.dispose();
      dieGeometry.dispose();
    };
  }, [materials, auraMat, dieGeometry]);

  return (
    <RigidBody
      ref={ref}
      colliders={shape.collider}
      ccd
      position={position}
      restitution={0.3}
      friction={0.6}
      linearDamping={0.3}
      angularDamping={0.45}
      onCollisionEnter={onCollide}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={dieGeometry}
        material={materials}
      />
      {/* ออร่ารอบลูกเต๋า — sprite billboard หันเข้ากล้องเสมอ */}
      <sprite ref={spriteRef} material={auraMat} scale={[1.9, 1.9, 1.9]} />
      {/* แสงออร่าเปล่งลงโต๊ะ (ไม่ทำเงา) */}
      <pointLight
        ref={lightRef}
        color="#f5da27"
        distance={3}
        decay={2.5}
        intensity={0}
        castShadow={false}
      />
    </RigidBody>
  );
});

export default RuneDie;
