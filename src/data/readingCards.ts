import { oracleCards } from "./oracleCards";
import { cutieCatCards } from "./cutieCatCards";

export interface OracleCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  meaning: string;
}

/**
 * กองไพ่ที่จั่วได้ของแต่ละ deck — สร้างจากชุดความหมายไพ่จริงของ deck นั้น
 * (Moonlight: ไพ่ที่มีความหมายครบ, Cutie Cat: ครบทั้ง 78 ใบ)
 */
function getDrawPool(deckId: string): OracleCard[] {
  const source = deckId === "cutie-cat" ? cutieCatCards : oracleCards;
  return source.map((c) => ({
    id: `${deckId}-${c.id}`,
    title: c.title,
    subtitle: c.thaiTitle,
    image: c.image,
    meaning: c.meaning,
  }));
}

/**
 * จั่วไพ่แบบสุ่มจริงด้วย Fisher–Yates shuffle: ทุกใบมีโอกาสเท่ากัน
 * และไม่จั่วซ้ำใบเดิมในรอบเดียวกัน — เรียกใหม่ทุกรอบการเปิดไพ่/สับไพ่
 */
export function drawRandomCards(deckId: string, count: number): OracleCard[] {
  const pool = getDrawPool(deckId);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
