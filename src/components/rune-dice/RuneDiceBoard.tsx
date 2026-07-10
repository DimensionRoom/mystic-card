import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import type { RuneId } from "../../data/runes";
import type { DieResult, RollPhase } from "./useDiceRoll";
import RuneDie from "./RuneDie";
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

// สีเน้น glyph ต่อบทบาทลูกเต๋า: 1 ชมพู, 2 เหลืองอำพัน, 3 ม่วง (ตรงกับการ์ดผล)
const DIE_ACCENTS = ["#f75fa2", "#e0a400", "#7c4be8"];

const CALM_FRAMES = 18;
const MIN_CONFIDENCE = 0.85;
const MAX_NUDGES = 2;

interface RuneDiceBoardProps {
  rollId: number;
  phase: RollPhase;
  /** RuneId[3][6] */
  assignment: RuneId[][];
  onSettling: () => void;
  onSettled: (results: DieResult[]) => void;
}

/** ควบคุมการทอย + ตรวจจับการหยุด — อยู่ใน <Physics> ใช้ refs ร่วมกับลูกเต๋า */
function DiceController({
  rollId,
  phase,
  assignment,
  dieRefs,
  onSettling,
  onSettled,
}: {
  rollId: number;
  phase: RollPhase;
  assignment: RuneId[][];
  dieRefs: React.MutableRefObject<RapierRigidBody | null>[];
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
        if (ref.current) throwDie(ref.current, SPAWN[i]);
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

    const reads = dice.map(readUpFace);
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
        runeId: assignment[die][r.faceIndex],
      })),
    );
  });

  return null;
}

function Table() {
  const felt = useMemo(() => feltTexture(), []);
  return (
    <group>
      {/* ขอบโต๊ะ (visual) */}
      <RoundedBox
        args={[9.6, 0.8, 6.6]}
        radius={0.24}
        smoothness={4}
        position={[0, -0.4, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#32245c" roughness={0.95} metalness={0} />
      </RoundedBox>
      {/* felt ด้านบน */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[8.8, 5.8]} />
        <meshStandardMaterial map={felt} roughness={1} />
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
  assignment,
  onSettling,
  onSettled,
}: RuneDiceBoardProps) {
  const d0 = useRef<RapierRigidBody | null>(null);
  const d1 = useRef<RapierRigidBody | null>(null);
  const d2 = useRef<RapierRigidBody | null>(null);
  const dieRefs = useMemo(() => [d0, d1, d2], []);

  useEffect(() => {
    void ensureRuneFont();
    return () => disposeRuneTextures();
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 7, 8], fov: 40, near: 0.1, far: 60 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0.4)}
    >
      <ambientLight intensity={0.6} color="#b9a8e8" />
      <directionalLight
        position={[4, 9, 3]}
        intensity={1.15}
        color="#fff6ea"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <spotLight
        position={[-5, 6, -3]}
        intensity={0.45}
        color="#ff9ad5"
        angle={0.7}
      />

      <Suspense fallback={null}>
        <Physics gravity={[0, -18, 0]}>
          <Table />
          <Bounds />
          {assignment.map((faces, i) => (
            <RuneDie
              key={i}
              ref={dieRefs[i]}
              faces={faces}
              accent={DIE_ACCENTS[i]}
              position={REST_SPOTS[i]}
            />
          ))}
          <DiceController
            rollId={rollId}
            phase={phase}
            assignment={assignment}
            dieRefs={dieRefs}
            onSettling={onSettling}
            onSettled={onSettled}
          />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
