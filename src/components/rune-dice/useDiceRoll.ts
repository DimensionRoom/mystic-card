import { useCallback, useState } from "react";
import { rollFaceAssignment, type DiceSetDef } from "../../data/diceSets";

export type RollPhase = "idle" | "rolling" | "settling" | "revealed";

/** ผลของลูกเต๋าหนึ่งลูกหลังหยุด: ลูกที่ตำแหน่ง die หงายสัญลักษณ์ symbolId */
export interface DieResult {
  die: number;
  symbolId: string;
}

export interface DiceRoll {
  phase: RollPhase;
  /** เพิ่มทุกครั้งที่ทอย ใช้เป็น key ให้ board ยิง impulse ใหม่ + AnimatePresence */
  rollId: number;
  /** symbolId[3][faceCount] — สัญลักษณ์ที่แจกให้ลูกเต๋า 3 ลูกตามชุดที่เลือก */
  assignment: string[][];
  results: DieResult[];
  roll: () => void;
  onSettling: () => void;
  onSettled: (results: DieResult[]) => void;
}

export function useDiceRoll(set: DiceSetDef): DiceRoll {
  const [phase, setPhase] = useState<RollPhase>("idle");
  const [rollId, setRollId] = useState(0);
  const [assignment, setAssignment] = useState<string[][]>(() =>
    rollFaceAssignment(set),
  );
  const [results, setResults] = useState<DieResult[]>([]);

  // เปลี่ยนชุดลูกเต๋า → รีเซ็ต "ระหว่าง render" (ไม่ใช่ effect) เพื่อไม่ให้มี
  // เฟรมที่ results ของชุดเก่าไปเจอ copy ของชุดใหม่แล้ว lookup พัง
  const [prevSet, setPrevSet] = useState(set);
  if (prevSet !== set) {
    setPrevSet(set);
    setPhase("idle");
    setResults([]);
    setAssignment(rollFaceAssignment(set));
  }

  const roll = useCallback(() => {
    setAssignment(rollFaceAssignment(set));
    setResults([]);
    setPhase("rolling");
    setRollId((n) => n + 1);
  }, [set]);

  const onSettling = useCallback(() => {
    setPhase("settling");
  }, []);

  const onSettled = useCallback((r: DieResult[]) => {
    setResults(r);
    setPhase("revealed");
  }, []);

  return {
    phase,
    rollId,
    assignment,
    results,
    roll,
    onSettling,
    onSettled,
  };
}
