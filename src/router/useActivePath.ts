import { useLocation } from "react-router";
import { getDeck } from "../data/decks";

// deck page → เลือกไพ่, หน้าชำระเงิน → ร้านค้า (สำหรับ highlight เมนู)
export function useActivePath(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith("/deck/")) {
    // extract id after "/deck/" เท่านั้น ตัด sub-path ของแท็บ (เช่น /meaning, /about) ทิ้ง
    const deckId = pathname.slice(6).split("/")[0];
    if (getDeck(deckId)) return "/decks";
    return pathname; // invalid deck: no highlight
  }
  if (pathname.startsWith("/checkout")) return "/shop";
  if (pathname.startsWith("/settings")) return "/settings";
  return pathname;
}
