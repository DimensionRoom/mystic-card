import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import { symbolById, type DiceSetDef } from "../../data/diceSets";
import { diceShapeById, type DiceShape } from "./diceShapes";
import type { DieResult, RollPhase } from "./useDiceRoll";
import RuneDie from "./RuneDie";
import SparkBurst, { type SparkBurstHandle } from "./SparkBurst";
import {
  disposeRuneTextures,
  ensureRuneFont,
  feltTexture,
} from "./runeTextures";
import {
  isCalm,
  nudgeDie,
  readUpFace,
  REST_SPOTS,
  SETTLE_TIMEOUT_MS,
  SPAWN,
  throwDie,
} from "./dicePhysics";

const CALM_FRAMES = 18;
const MIN_CONFIDENCE = 0.85;
const MAX_NUDGES = 2;

interface RuneDiceBoardProps {
  rollId: number;
  phase: RollPhase;
  /** ชุดลูกเต๋าที่เลือก (กำหนดทรง + สัญลักษณ์) */
  set: DiceSetDef;
  /** symbolId[3][faceCount] */
  assignment: string[][];
  /** ผลหลัง settle — ใช้บอกลูกเต๋าคริสตัลว่าแตกแล้วโชว์สัญลักษณ์ไหน */
  results: DieResult[];
  /** ตัวคูณความแรงของการทอย (อ่านตอนทอยจริง) */
  power: number;
  onSettling: () => void;
  onSettled: (results: DieResult[]) => void;
}

/** ควบคุมการทอย + ตรวจจับการหยุด — อยู่ใน <Physics> ใช้ refs ร่วมกับลูกเต๋า */
function DiceController({
  rollId,
  phase,
  assignment,
  shape,
  dieRefs,
  powerRef,
  onSettling,
  onSettled,
}: {
  rollId: number;
  phase: RollPhase;
  assignment: string[][];
  shape: DiceShape;
  dieRefs: React.MutableRefObject<RapierRigidBody | null>[];
  powerRef: React.MutableRefObject<number>;
  onSettling: () => void;
  onSettled: (results: DieResult[]) => void;
}) {
  const startedAt = useRef(0);
  const calmFrames = useRef(0);
  const nudges = useRef<number[]>([0, 0, 0]);
  const doneRef = useRef(false);

  // ทอยเมื่อ rollId เปลี่ยน (ข้ามค่าเริ่มต้น 0) — รอฟอนต์พร้อมก่อนใน robbระยะแรก
  useEffect(() => {
    if (rollId === 0) return;
    let cancelled = false;
    void ensureRuneFont().then(() => {
      if (cancelled) return;
      dieRefs.forEach((ref, i) => {
        if (ref.current) throwDie(ref.current, SPAWN[i], powerRef.current);
      });
      startedAt.current = performance.now();
      calmFrames.current = 0;
      nudges.current = [0, 0, 0];
      doneRef.current = false;
      onSettling();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollId]);

  useFrame(() => {
    if (phase !== "settling" || doneRef.current) return;
    const bodies = dieRefs.map((r) => r.current);
    if (bodies.some((b) => !b)) return;
    const dice = bodies as RapierRigidBody[];

    const timedOut = performance.now() - startedAt.current > SETTLE_TIMEOUT_MS;
    const calm = dice.every(isCalm);
    calmFrames.current = calm ? calmFrames.current + 1 : 0;
    const rested =
      dice.every((rb) => rb.isSleeping()) || calmFrames.current >= CALM_FRAMES;
    if (!rested && !timedOut) return;

    const reads = dice.map((rb) => readUpFace(rb, shape.faceNormals));
    const cocked = reads.findIndex((r) => r.confidence < MIN_CONFIDENCE);
    if (cocked !== -1 && !timedOut && nudges.current[cocked] < MAX_NUDGES) {
      nudges.current[cocked] += 1;
      nudgeDie(dice[cocked]);
      calmFrames.current = 0;
      return;
    }

    doneRef.current = true;
    onSettled(
      reads.map((r, die) => ({
        die,
        symbolId: assignment[die][r.faceIndex],
      })),
    );
  });

  return null;
}

function Table() {
  const felt = useMemo(() => feltTexture(), []);
  // ปูภาพพื้นโต๊ะจาก /img/rune-board-moon.png ถ้ามี — ไม่มีไฟล์ก็ใช้ felt ที่วาดเองแทน
  // สำคัญ: ชื่อไฟล์นี้ต้องมีอยู่จริงใน public/img และตรงกับที่ commit ไป
  // (ไม่งั้น Vercel จะ 404 แล้ว fallback เป็น felt) — เปลี่ยนภาพให้เปลี่ยนชื่อไฟล์ด้วยเพื่อเลี่ยง cache
  const [boardMap, setBoardMap] = useState<THREE.Texture>(felt);
  useEffect(() => {
    let disposed = false;
    new THREE.TextureLoader().load(
      "/img/rune-board-moon.png",
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        setBoardMap(tex);
      },
      undefined,
      () => {
        /* ไม่มีไฟล์ → คง felt เดิม */
      },
    );
    return () => {
      disposed = true;
    };
  }, [felt]);

  return (
    <group>
      {/* ขอบโต๊ะ (visual) — สีเข้มเข้ากับกรอบภาพพื้น */}
      <RoundedBox
        args={[9.6, 0.8, 6.6]}
        radius={0.24}
        smoothness={4}
        position={[0, -0.4, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#f4c300" roughness={0.95} metalness={0} />
      </RoundedBox>
      {/* พื้นโต๊ะด้านบน */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[9.0, 6.0]} />
        <meshStandardMaterial
          map={boardMap}
          emissive="#8800ff"
          emissiveMap={boardMap}
          emissiveIntensity={0.35}
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/** พื้น + กำแพงล่องหน 4 ด้าน + เพดาน — ลูกเต๋าหลุดไม่ได้ */
function Bounds() {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[4.6, 0.4, 3.2]}
          position={[0, -0.4, 0]}
          restitution={0.35}
          friction={0.9}
        />
      </RigidBody>
      <RigidBody type="fixed" colliders={false} restitution={0.4} friction={0.1}>
        <CuboidCollider args={[0.4, 4, 3.4]} position={[-4.4, 3.6, 0]} />
        <CuboidCollider args={[0.4, 4, 3.4]} position={[4.4, 3.6, 0]} />
        <CuboidCollider args={[4.8, 4, 0.4]} position={[0, 3.6, -3.0]} />
        <CuboidCollider args={[4.8, 4, 0.4]} position={[0, 3.6, 3.0]} />
        <CuboidCollider args={[4.8, 0.4, 3.4]} position={[0, 7.4, 0]} />
      </RigidBody>
    </>
  );
}

export default function RuneDiceBoard({
  rollId,
  phase,
  set,
  assignment,
  results,
  power,
  onSettling,
  onSettled,
}: RuneDiceBoardProps) {
  const d0 = useRef<RapierRigidBody | null>(null);
  const d1 = useRef<RapierRigidBody | null>(null);
  const d2 = useRef<RapierRigidBody | null>(null);
  const dieRefs = useMemo(() => [d0, d1, d2], []);
  const sparkRef = useRef<SparkBurstHandle>(null);
  const shape = diceShapeById(set.shapeId);
  // อ่านความแรงล่าสุดตอนทอย โดยไม่ต้อง re-render canvas
  const powerRef = useRef(power);
  powerRef.current = power;

  useEffect(() => {
    void ensureRuneFont();
    return () => disposeRuneTextures();
  }, []);

  // ประกายแสงเฉพาะตอนลูกเต๋าชนกันเอง แรงพอ (ไม่พ่นตอนแตะพื้น/สั่นตอนหยุด)
  const handleCollide = useCallback(
    (payload: CollisionEnterPayload) => {
      const target = payload.target.rigidBody;
      const other = payload.other.rigidBody;
      if (!target || !other) return;
      const bodies = dieRefs.map((r) => r.current);
      if (!bodies.includes(other)) return; // ต้องชนลูกเต๋าด้วยกัน
      const lv = target.linvel();
      if (Math.hypot(lv.x, lv.y, lv.z) < 2.2) return; // กรองการชนเบา ๆ
      const a = target.translation();
      const b = other.translation();
      sparkRef.current?.emit((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    },
    [dieRefs],
  );

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 7, 8], fov: 40, near: 0.1, far: 60 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0.4)}
    >
      <ambientLight intensity={0.5} color="#cdbdf2" />
      <directionalLight
        position={[4, 9, 3]}
        intensity={1.6}
        color="#fff3d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* fill อุ่นจากทางกล้อง ให้หน้าลูกเต๋าฝั่งกล้องเป็นทองสว่าง ไม่ดำ */}
      <directionalLight position={[0, 3, 8]} intensity={0.8} color="#ffe6b0" />
      <spotLight
        position={[-5, 6, -3]}
        intensity={0.7}
        color="#ffcf8a"
        angle={0.7}
      />

      {/* Environment inline (ไม่โหลด HDR ภายนอก) ให้ทองมีแสงสะท้อนดูเมทัลลิกทุกหน้า */}
      <Environment resolution={128}>
        <Lightformer
          intensity={3}
          position={[0, 4, -3]}
          scale={[12, 6, 1]}
          color="#fff2d0"
        />
        <Lightformer
          intensity={2.4}
          position={[0, 2, 7]}
          scale={[10, 6, 1]}
          color="#ffdca0"
        />
        <Lightformer
          intensity={1.6}
          position={[-5, 2, 3]}
          scale={[6, 6, 1]}
          color="#ffcf8a"
        />
        <Lightformer
          intensity={1.6}
          position={[5, 2, 3]}
          scale={[6, 6, 1]}
          color="#ffcf8a"
        />
        <Lightformer
          intensity={1.2}
          position={[0, -3, 0]}
          scale={[8, 8, 1]}
          color="#8a6bd8"
        />
      </Environment>

      {/* ประกายแสงทอง — พ่นตอนลูกเต๋ากระทบกัน */}
      <SparkBurst ref={sparkRef} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -18, 0]}>
          <Table />
          <Bounds />
          {assignment.map((faceIds, i) => {
            const res =
              phase === "revealed"
                ? results.find((r) => r.die === i)
                : undefined;
            return (
              <RuneDie
                key={`${set.id}-${i}`}
                ref={dieRefs[i]}
                faces={faceIds.map((id) => symbolById(set, id))}
                shape={shape}
                setId={set.id}
                materialStyle={set.material}
                position={REST_SPOTS[i]}
                onCollide={handleCollide}
                glow={phase === "revealed"}
                revealSymbol={res ? symbolById(set, res.symbolId) : undefined}
              />
            );
          })}
          <DiceController
            rollId={rollId}
            phase={phase}
            assignment={assignment}
            shape={shape}
            dieRefs={dieRefs}
            powerRef={powerRef}
            onSettling={onSettling}
            onSettled={onSettled}
          />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
