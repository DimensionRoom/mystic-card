import { matchPath } from "react-router";
import { getDeck } from "../data/decks";
import type { DeckTab } from "../components/DeckTabs";

// เส้นทางที่แอปมีหน้าจริงรองรับ (ตรงกับ Route table ใน App.tsx)
const staticPaths = ["/", "/readings", "/shop", "/checkout", "/decks", "/settings"];

// แท็บจริงของหน้า deck — ต้องตรงกับ DeckTabs/DeckRoute เท่านั้น (กัน /deck/x/ebook หลุดผ่าน)
const deckTabs: DeckTab[] = ["read", "meaning", "about"];

// ใช้ matchPath (end: true คือค่า default) เพื่อไม่ให้ path ย่อยเช่น
// /deck/x/ebook หลุดผ่านมาเป็น navigate จริงทั้งที่ยังไม่ implement
export function isImplementedPath(path: string): boolean {
  if (staticPaths.some((p) => matchPath(p, path))) {
    return true;
  }

  const deckMatch = matchPath("/deck/:deckId", path);
  if (deckMatch) {
    return !!getDeck(deckMatch.params.deckId!);
  }

  const deckTabMatch = matchPath("/deck/:deckId/:tab", path);
  if (deckTabMatch) {
    const { deckId, tab } = deckTabMatch.params;
    return !!getDeck(deckId!) && deckTabs.includes(tab as DeckTab);
  }

  return false;
}
