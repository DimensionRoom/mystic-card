import { useCallback, useState } from "react";
import { rollFaceAssignment, type RuneId } from "../../data/runes";

export type RollPhase = "idle" | "rolling" | "settling" | "revealed";

/** ผลของลูกเต๋าหนึ่งลูกหลังหยุด: ลูกที่ตำแหน่ง die หงายรูน runeId */
export interface DieResult {
  die: number;
  runeId: RuneId;
}

export interface DiceRoll {
  phase: RollPhase;
  /** เพิ่มทุกครั้งที่ทอย ใช้เป็น key ให้ board ยิง impulse ใหม่ + AnimatePresence */
  rollId: number;
  /** RuneId[3][6] — หน้าไพ่ที่แจกให้ลูกเต๋า 3 ลูก */
  assignment: RuneId[][];
  results: DieResult[];
  roll: () => void;
  onSettling: () => void;
  onSettled: (results: DieResult[]) => void;
}

export function useDiceRoll(): DiceRoll {
  const [phase, setPhase] = useState<RollPhase>("idle");
  const [rollId, setRollId] = useState(0);
  const [assignment, setAssignment] = useState<RuneId[][]>(() =>
    rollFaceAssignment(),
  );
  const [results, setResults] = useState<DieResult[]>([]);

  const roll = useCallback(() => {
    setAssignment(rollFaceAssignment());
    setResults([]);
    setPhase("rolling");
    setRollId((n) => n + 1);
  }, []);

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
