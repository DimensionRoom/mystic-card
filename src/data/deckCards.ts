import type { OracleCardMeaning } from "./oracleCards";
import { cutieCatCards, CUTIE_CAT_TOTAL } from "./cutieCatCards";

export interface DeckCardSet {
  cards: OracleCardMeaning[];
  total: number;
}

/**
 * เลือกชุดการ์ด (ความหมายไพ่) ตาม deck id — เผื่อไว้สำหรับ deck ใหม่ในอนาคต
 * ตอนนี้มีสำรับเดียวคือ Cutie Cat Tarot จึงเป็นทั้งค่าเฉพาะและค่า default
 */
export function getDeckCardSet(deckId: string): DeckCardSet {
  void deckId;
  return { cards: cutieCatCards, total: CUTIE_CAT_TOTAL };
}
