import { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  RigidBody,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import { runeById, type RuneId } from "../../data/runes";
import { ensureRuneFont, runeFaceTexture } from "./runeTextures";
import { DIE_SIZE } from "./dicePhysics";

interface RuneDieProps {
  /** 6 รูนที่แจกให้หน้าลูกเต๋าลูกนี้ (index 0-5 ตรงกับ +X,-X,+Y,-Y,+Z,-Z) */
  faces: RuneId[];
  position: [number, number, number];
  onCollide?: (payload: CollisionEnterPayload) => void;
}

const RuneDie = forwardRef<RapierRigidBody, RuneDieProps>(function RuneDie(
  { faces, position, onCollide },
  ref,
) {
  // วัสดุเมทัลลิก: ทองอบใน map, ตัวลูกดำมัน — สะท้อนแสงจาก Environment ในซีน
  const materials = useMemo(
    () =>
      Array.from(
        { length: 6 },
        () =>
          new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.9,
            envMapIntensity: 1.7,
          }),
      ),
    [],
  );

  // เปลี่ยน texture ทุกครั้งที่หน้าไพ่ถูกแจกใหม่ (ก่อนยิง impulse รอบถัดไป)
  // วาดหลังฟอนต์พร้อมเสมอ กัน cache เก็บ glyph ที่เป็นกล่องเปล่า (tofu)
  useEffect(() => {
    let cancelled = false;
    void ensureRuneFont().then(() => {
      if (cancelled) return;
      faces.forEach((id, i) => {
        const rune = runeById(id);
        materials[i].map = runeFaceTexture(rune.glyph, rune.id);
        materials[i].needsUpdate = true;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [faces, materials]);

  useEffect(() => {
    return () => materials.forEach((m) => m.dispose());
  }, [materials]);

  return (
    <RigidBody
      ref={ref}
      colliders="cuboid"
      ccd
      position={position}
      restitution={0.3}
      friction={0.6}
      linearDamping={0.3}
      angularDamping={0.45}
      onCollisionEnter={onCollide}
    >
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[DIE_SIZE, DIE_SIZE, DIE_SIZE]} />
      </mesh>
    </RigidBody>
  );
});

export default RuneDie;
