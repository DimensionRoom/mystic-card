import { matchPath } from "react-router";
import { getDeck } from "../data/decks";

// เส้นทางที่แอปมีหน้าจริงรองรับ (ตรงกับ Route table ใน App.tsx)
const staticPaths = ["/", "/readings", "/shop", "/checkout", "/decks", "/settings"];

// ใช้ matchPath (end: true คือค่า default) เพื่อไม่ให้ path ย่อยเช่น
// /deck/x/ebook หลุดผ่านมาเป็น navigate จริงทั้งที่ยังไม่ implement
export function isImplementedPath(path: string): boolean {
  if (staticPaths.some((p) => matchPath(p, path))) {
    return true;
  }
  const deckMatch = matchPath("/deck/:deckId", path);
  return !!deckMatch && !!getDeck(deckMatch.params.deckId!);
}
