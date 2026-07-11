import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import type { DiceMaterialStyle, DiceSymbol } from "../../data/diceSets";
import { octaFrame, type DiceShape } from "./diceShapes";
import {
  auraTexture,
  ensureRuneFont,
  faceTexture,
  galaxyTexture,
} from "./runeTextures";
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
              // แก้วโอปอลม่วง (ตามภาพอ้างอิง): กึ่งโปร่ง เรืองจากข้างใน
              roughness: 0.16,
              metalness: 0,
              transmission: 0.32,
              thickness: 0.4,
              ior: 1.4,
              clearcoat: 1,
              clearcoatRoughness: 0.08,
              envMapIntensity: 1.3,
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

  // กาแล็กซีหลายวงลอยวนในเนื้อแก้ว (เฉพาะ crystal) — sprite additive
  // คละขนาดหลากสี (tint texture ขาวกลางด้วยสีต่อวง) หมุน/โคจร (lissajous) สุ่มเฉพาะลูก
  const galaxies = useMemo(() => {
    if (materialStyle !== "crystal") return null;
    const TINTS = ["#c084fc", "#7dd3fc", "#f9a8d4", "#fcd34d", "#99f6e4"];
    return Array.from({ length: 5 }, (_, i) => ({
      mat: new THREE.SpriteMaterial({
        map: galaxyTexture(),
        color: new THREE.Color(TINTS[i % TINTS.length]),
        transparent: true,
        depthWrite: false,
        depthTest: false, // มองทะลุเนื้อแก้ว (glass เขียน depth ไว้ก่อน)
        blending: THREE.AdditiveBlending,
        opacity: 0.4 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
      }),
      scale: 0.12 + Math.random() * 0.24, // คละขนาดชัดเจน แต่ไม่ใหญ่จนคลุมลูก
      spin: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.9),
      freq: [
        0.25 + Math.random() * 0.25,
        0.2 + Math.random() * 0.25,
        0.3 + Math.random() * 0.25,
      ] as const,
      phase: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as const,
      amp: 0.11 + Math.random() * 0.06,
    }));
  }, [materialStyle]);
  const galaxyRefs = useRef<(THREE.Sprite | null)[]>([]);

  // ดวงดาวระยิบระยับในเนื้อแก้ว — points cloud หมุนช้า ๆ
  const stars = useMemo(() => {
    if (materialStyle !== "crystal") return null;
    const n = 46;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      // สุ่มในทรงกลมรัศมี ~0.27 (อยู่ในเนื้อ octahedron)
      const r = 0.27 * Math.cbrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const s = Math.sqrt(1 - z * z);
      pos[i * 3] = r * s * Math.cos(a);
      pos[i * 3 + 1] = r * s * Math.sin(a);
      pos[i * 3 + 2] = r * z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#efe4ff"),
      size: 0.026,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    return { geo, mat };
  }, [materialStyle]);
  const starsRef = useRef<THREE.Points>(null);

  // โครงทอง 12 สัน + หัวมุมทอง/เม็ดพลอยม่วง 6 จุด (เฉพาะ d8 คริสตัล — ตามภาพอ้างอิง)
  const frame = useMemo(
    () =>
      materialStyle === "crystal" && shape.id === "d8"
        ? octaFrame(DIE_SIZE)
        : null,
    [materialStyle, shape.id],
  );
  const goldMat = useMemo(
    () =>
      frame
        ? new THREE.MeshStandardMaterial({
            color: new THREE.Color("#e8c25a"),
            metalness: 1,
            roughness: 0.28,
            envMapIntensity: 1.6,
          })
        : null,
    [frame],
  );
  const gemMat = useMemo(
    () =>
      frame
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#c084fc"),
            roughness: 0.12,
            metalness: 0,
            clearcoat: 1,
            emissive: new THREE.Color("#a855f7"),
            emissiveIntensity: 0.35,
          })
        : null,
    [frame],
  );

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
    // ผิวเปล่งแสง — crystal เรืองในตัวคงที่ (กาแล็กซี/ดาวใน texture สว่างบนพื้นดำ)
    // ไม่เร่งแสงตอนทอยเสร็จตามที่เลือก; obsidian ยังเรืองตอน reveal เหมือนเดิม
    const em = materialStyle === "crystal" ? 0.6 : g * (0.3 + 0.5 * pulse);
    for (const m of materials) m.emissiveIntensity = em;
    if (materialStyle !== "crystal") {
      // halo sprite + แสงเปล่งลงโต๊ะ (เฉพาะ obsidian — crystal ไม่มี reveal glow)
      auraMat.opacity = g * (0.5 + 0.35 * pulse);
      if (spriteRef.current) {
        const s = 1.9 + g * (0.3 + 0.35 * pulse);
        spriteRef.current.scale.set(s, s, s);
      }
      if (lightRef.current) lightRef.current.intensity = g * (2.4 + 1.4 * pulse);
    }
    // กาแล็กซีลอยวนไปมา + หมุนตัวเอง (คงที่ ไม่ผูกกับ reveal)
    if (galaxies) {
      galaxies.forEach((gal, i) => {
        gal.mat.rotation += dt * gal.spin;
        gal.mat.opacity = 0.48 + 0.1 * Math.sin(t.current * 1.8 + gal.phase[0]);
        const sp = galaxyRefs.current[i];
        if (sp) {
          sp.position.set(
            gal.amp * Math.sin(t.current * gal.freq[0] + gal.phase[0]),
            gal.amp * Math.sin(t.current * gal.freq[1] + gal.phase[1]),
            gal.amp * Math.sin(t.current * gal.freq[2] + gal.phase[2]),
          );
        }
      });
    }
    // ดวงดาวหมุนช้า ๆ + ระยิบระยับ
    if (stars) {
      if (starsRef.current) {
        starsRef.current.rotation.y += dt * 0.22;
        starsRef.current.rotation.x += dt * 0.07;
      }
      stars.mat.opacity = 0.72 + 0.22 * Math.sin(t.current * 2.6);
    }
  });

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
      auraMat.dispose();
      galaxies?.forEach((gal) => gal.mat.dispose());
      if (stars) {
        stars.geo.dispose();
        stars.mat.dispose();
      }
      goldMat?.dispose();
      gemMat?.dispose();
      dieGeometry.dispose();
    };
  }, [materials, auraMat, galaxies, stars, goldMat, gemMat, dieGeometry]);

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
      {/* โครงทองตามสัน + หัวมุมทองฝังพลอยม่วง (ตามภาพอ้างอิง) */}
      {frame && goldMat && gemMat && (
        <group>
          {frame.edges.map((e, i) => (
            <mesh
              key={`edge-${i}`}
              position={e.position}
              quaternion={e.quaternion}
              material={goldMat}
            >
              <cylinderGeometry args={[0.022, 0.022, e.length, 8]} />
            </mesh>
          ))}
          {frame.vertices.map((v, i) => (
            <group key={`vert-${i}`}>
              <mesh position={v} material={goldMat}>
                <sphereGeometry args={[0.052, 12, 12]} />
              </mesh>
              {/* เม็ดพลอยม่วงบนหัวมุม ยื่นออกตามแนวจุดยอด */}
              <mesh
                position={[v[0] * 1.06, v[1] * 1.06, v[2] * 1.06]}
                material={gemMat}
              >
                <sphereGeometry args={[0.03, 10, 10]} />
              </mesh>
            </group>
          ))}
        </group>
      )}
      {/* กาแล็กซีหลายวง + ดวงดาว ลอยวนในลูกคริสตัล */}
      {galaxies?.map((gal, i) => (
        <sprite
          key={i}
          ref={(el) => {
            galaxyRefs.current[i] = el;
          }}
          material={gal.mat}
          scale={[gal.scale, gal.scale, gal.scale]}
          renderOrder={5}
        />
      ))}
      {stars && (
        <points geometry={stars.geo} material={stars.mat} ref={starsRef} renderOrder={4} />
      )}
      {/* ออร่า reveal — เฉพาะ obsidian (crystal ไม่เรืองแสงตอนทอยเสร็จ) */}
      {materialStyle !== "crystal" && (
        <>
          <sprite ref={spriteRef} material={auraMat} scale={[1.9, 1.9, 1.9]} />
          <pointLight
            ref={lightRef}
            color="#f5da27"
            distance={3}
            decay={2.5}
            intensity={0}
            castShadow={false}
          />
        </>
      )}
    </RigidBody>
  );
});

export default RuneDie;
