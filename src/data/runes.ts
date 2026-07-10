// Elder Futhark รูน 24 ตัว — ข้อมูลกลางที่ไม่ผูกภาษา (eager-safe: ห้าม import three)
// คำแปล (name/meaning) อยู่ใน src/i18n/translations.ts section runeDice.runes
export type RuneId =
  | "fehu"
  | "uruz"
  | "thurisaz"
  | "ansuz"
  | "raidho"
  | "kenaz"
  | "gebo"
  | "wunjo"
  | "hagalaz"
  | "nauthiz"
  | "isa"
  | "jera"
  | "eihwaz"
  | "perthro"
  | "algiz"
  | "sowilo"
  | "tiwaz"
  | "berkano"
  | "ehwaz"
  | "mannaz"
  | "laguz"
  | "ingwaz"
  | "dagaz"
  | "othala";

export interface Rune {
  id: RuneId;
  /** อักขระ Unicode Runic block (U+16A0–16FF) */
  glyph: string;
  /** ชื่อทับศัพท์ (ใช้เหมือนกันทุกภาษา) */
  translit: string;
}

export const RUNES: readonly Rune[] = [
  { id: "fehu", glyph: "ᚠ", translit: "Fehu" },
  { id: "uruz", glyph: "ᚢ", translit: "Uruz" },
  { id: "thurisaz", glyph: "ᚦ", translit: "Thurisaz" },
  { id: "ansuz", glyph: "ᚨ", translit: "Ansuz" },
  { id: "raidho", glyph: "ᚱ", translit: "Raidho" },
  { id: "kenaz", glyph: "ᚲ", translit: "Kenaz" },
  { id: "gebo", glyph: "ᚷ", translit: "Gebo" },
  { id: "wunjo", glyph: "ᚹ", translit: "Wunjo" },
  { id: "hagalaz", glyph: "ᚺ", translit: "Hagalaz" },
  { id: "nauthiz", glyph: "ᚾ", translit: "Nauthiz" },
  { id: "isa", glyph: "ᛁ", translit: "Isa" },
  { id: "jera", glyph: "ᛃ", translit: "Jera" },
  { id: "eihwaz", glyph: "ᛇ", translit: "Eihwaz" },
  { id: "perthro", glyph: "ᛈ", translit: "Perthro" },
  { id: "algiz", glyph: "ᛉ", translit: "Algiz" },
  { id: "sowilo", glyph: "ᛊ", translit: "Sowilo" },
  { id: "tiwaz", glyph: "ᛏ", translit: "Tiwaz" },
  { id: "berkano", glyph: "ᛒ", translit: "Berkano" },
  { id: "ehwaz", glyph: "ᛖ", translit: "Ehwaz" },
  { id: "mannaz", glyph: "ᛗ", translit: "Mannaz" },
  { id: "laguz", glyph: "ᛚ", translit: "Laguz" },
  { id: "ingwaz", glyph: "ᛜ", translit: "Ingwaz" },
  { id: "dagaz", glyph: "ᛞ", translit: "Dagaz" },
  { id: "othala", glyph: "ᛟ", translit: "Othala" },
];

const RUNE_BY_ID: Record<RuneId, Rune> = RUNES.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<RuneId, Rune>,
);

export function runeById(id: RuneId): Rune {
  return RUNE_BY_ID[id];
}

/**
 * สุ่ม (Fisher–Yates) เลือก 18 รูนจาก 24 แล้วแจกลูกเต๋าลูกละ 6 หน้า
 * คืน RuneId[3][6] — การันตีว่าไม่มีรูนซ้ำข้ามลูก (ผล 3 ตำแหน่งจึงไม่ซ้ำกัน)
 */
export function rollFaceAssignment(): RuneId[][] {
  const pool = RUNES.map((r) => r.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [pool.slice(0, 6), pool.slice(6, 12), pool.slice(12, 18)];
}
