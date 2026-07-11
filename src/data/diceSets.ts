// ทะเบียน "ชุดลูกเต๋า" ของ Rune Dice — ข้อมูลกลางไม่ผูกภาษา (eager-safe: ห้าม import three)
// เรขาคณิต 3D ของแต่ละทรงอยู่ที่ src/components/rune-dice/diceShapes.ts (lazy chunk)
// คำทำนายอยู่ใน src/i18n/translations.ts (runeDice.runes / runeDice.celestial)
import { RUNES } from "./runes";

export type DiceShapeId = "d6" | "d8";

/** จำนวนหน้าของแต่ละทรง — ใช้ฝั่ง data โดยไม่ต้องพึ่ง three */
export const SHAPE_FACES: Record<DiceShapeId, number> = { d6: 6, d8: 8 };

export interface DiceSymbol {
  id: string;
  /** อักขระที่วาดบนหน้าลูกเต๋า (ต่อท้าย U+FE0E บังคับ text presentation กัน emoji สี) */
  glyph: string;
  /** ชื่อทับศัพท์ (ใช้เหมือนกันทุกภาษา) */
  translit: string;
}

// ─── ชุดจักรวาล: 12 ราศี + ดวงอาทิตย์/จันทร์/ดาวเคราะห์/ราหู/ดาวหาง = 24 ───
export type CelestialId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces"
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "node"
  | "comet";

const TXT = "\uFE0E"; // VS-15 บังคับ text presentation (กัน emoji สี)

export const CELESTIALS: readonly (DiceSymbol & { id: CelestialId })[] = [
  { id: "aries", glyph: `♈${TXT}`, translit: "Aries" },
  { id: "taurus", glyph: `♉${TXT}`, translit: "Taurus" },
  { id: "gemini", glyph: `♊${TXT}`, translit: "Gemini" },
  { id: "cancer", glyph: `♋${TXT}`, translit: "Cancer" },
  { id: "leo", glyph: `♌${TXT}`, translit: "Leo" },
  { id: "virgo", glyph: `♍${TXT}`, translit: "Virgo" },
  { id: "libra", glyph: `♎${TXT}`, translit: "Libra" },
  { id: "scorpio", glyph: `♏${TXT}`, translit: "Scorpio" },
  { id: "sagittarius", glyph: `♐${TXT}`, translit: "Sagittarius" },
  { id: "capricorn", glyph: `♑${TXT}`, translit: "Capricorn" },
  { id: "aquarius", glyph: `♒${TXT}`, translit: "Aquarius" },
  { id: "pisces", glyph: `♓${TXT}`, translit: "Pisces" },
  { id: "sun", glyph: `☉${TXT}`, translit: "Sol" },
  { id: "moon", glyph: `☽${TXT}`, translit: "Luna" },
  { id: "mercury", glyph: `☿${TXT}`, translit: "Mercury" },
  { id: "venus", glyph: `♀${TXT}`, translit: "Venus" },
  { id: "mars", glyph: `♂${TXT}`, translit: "Mars" },
  { id: "jupiter", glyph: `♃${TXT}`, translit: "Jupiter" },
  { id: "saturn", glyph: `♄${TXT}`, translit: "Saturn" },
  { id: "uranus", glyph: `♅${TXT}`, translit: "Uranus" },
  { id: "neptune", glyph: `♆${TXT}`, translit: "Neptune" },
  { id: "pluto", glyph: `♇${TXT}`, translit: "Pluto" },
  { id: "node", glyph: `☊${TXT}`, translit: "North Node" },
  { id: "comet", glyph: `☄${TXT}`, translit: "Comet" },
];

// ─── ทะเบียนชุดลูกเต๋า ───
export type DiceSetId = "runes-d6" | "runes-d8" | "celestial-d8";

export interface DiceSetDef {
  id: DiceSetId;
  shapeId: DiceShapeId;
  /** กลุ่มคำทำนายใน translations ที่ชุดนี้ใช้ */
  copyGroup: "runes" | "celestial";
  symbols: readonly DiceSymbol[];
}

export const DICE_SETS: readonly DiceSetDef[] = [
  { id: "runes-d6", shapeId: "d6", copyGroup: "runes", symbols: RUNES },
  { id: "runes-d8", shapeId: "d8", copyGroup: "runes", symbols: RUNES },
  { id: "celestial-d8", shapeId: "d8", copyGroup: "celestial", symbols: CELESTIALS },
];

export function diceSetById(id: DiceSetId): DiceSetDef {
  return DICE_SETS.find((s) => s.id === id) ?? DICE_SETS[0];
}

export function symbolById(set: DiceSetDef, id: string): DiceSymbol {
  return set.symbols.find((s) => s.id === id) ?? set.symbols[0];
}

export const DICE_COUNT = 3;

/**
 * สุ่ม (Fisher–Yates) แล้วแจกลูกเต๋าลูกละ faceCount หน้า จาก pool ของชุด
 * คืน symbolId[3][faceCount] — pool ≥ 3×faceCount การันตีไม่มีสัญลักษณ์ซ้ำข้ามลูก
 * (24 รูน: d6 ใช้ 18, d8 ใช้ครบ 24 พอดี)
 */
export function rollFaceAssignment(set: DiceSetDef): string[][] {
  const faces = SHAPE_FACES[set.shapeId];
  const pool = set.symbols.map((s) => s.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return Array.from({ length: DICE_COUNT }, (_, d) =>
    pool.slice(d * faces, (d + 1) * faces),
  );
}
