import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import type { DiceMaterialStyle, DiceSymbol } from "../../data/diceSets";
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
  /** สไตล์วัสดุ: obsidian ดำทอง / crystal ใสหักเหแสง */
  materialStyle: DiceMaterialStyle;
  position: [number, number, number];
  onCollide?: (payload: CollisionEnterPayload) => void;
  /** เรืองแสงหลังทอยเสร็จ (phase === "revealed") */
  glow?: boolean;
}

const RuneDie = forwardRef<RapierRigidBody, RuneDieProps>(function RuneDie(
  { faces, shape, setId, materialStyle, position, onCollide, glow = false },
  ref,
) {
  // obsidian: เมทัลลิกทองอบใน map ตัวลูกดำมัน / crystal: แก้วใส transmission
  // หักเหฉากหลังจริง เนื้อออกม่วงอ่อนตาม attenuation
  const materials = useMemo(
    () =>
      Array.from({ length: shape.faceCount }, () =>
        materialStyle === "crystal"
          ? new THREE.MeshPhysicalMaterial({
              roughness: 0.12,
              metalness: 0,
              transmission: 1,
              thickness: 0.55,
              ior: 1.45,
              clearcoat: 1,
              clearcoatRoughness: 0.06,
              envMapIntensity: 1.2,
              attenuationColor: new THREE.Color("#a98ef5"),
              attenuationDistance: 0.9,
              emissive: new THREE.Color("#ffffff"),
              emissiveIntensity: 0,
            })
          : new THREE.MeshStandardMaterial({
              roughness: 0.3,
              metalness: 0.9,
              envMapIntensity: 1.7,
              emissive: new THREE.Color("#ffffff"),
              emissiveIntensity: 0,
            }),
      ),
    [shape.faceCount, materialStyle],
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
        const style = materialStyle === "crystal" ? "crystal" : "gold";
        const tex = faceTexture(
          sym.glyph,
          `${setId}:${sym.id}:${shape.frame}:${style}`,
          shape.frame,
          style,
        );
        materials[i].map = tex;
        // emissiveMap = texture เดียวกัน → ส่วนสว่างของหน้าเปล่งแสงตอน reveal
        materials[i].emissiveMap = tex;
        materials[i].needsUpdate = true;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [faces, materials, setId, shape.frame, materialStyle]);

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
    // ผิวเปล่งแสง — crystal ลดแรงลง ไม่ให้ขาววาบจน glyph จม
    const em =
      g * (0.3 + 0.5 * pulse) * (materialStyle === "crystal" ? 0.28 : 1);
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
