import {
  oracleCards,
  TOTAL_DECK_CARDS,
  type OracleCardMeaning,
} from "./oracleCards";
import { cutieCatCards, CUTIE_CAT_TOTAL } from "./cutieCatCards";

export interface DeckCardSet {
  cards: OracleCardMeaning[];
  total: number;
}

/**
 * เลือกชุดการ์ด (ความหมายไพ่) ตาม deck id — ทำให้ CardMeaningTab/AboutDeckTab
 * แสดงไพ่ที่ถูกต้องต่อสำรับ แทนที่จะ hardcode ไปที่ oracleCards ของ Moonlight
 */
export function getDeckCardSet(deckId: string): DeckCardSet {
  if (deckId === "cutie-cat") {
    return { cards: cutieCatCards, total: CUTIE_CAT_TOTAL };
  }
  return { cards: oracleCards, total: TOTAL_DECK_CARDS };
}
