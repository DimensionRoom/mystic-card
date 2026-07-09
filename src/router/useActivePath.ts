import { useLocation } from "react-router";
import { getDeck } from "../data/decks";

// deck page → เลือกไพ่, หน้าชำระเงิน → ร้านค้า (สำหรับ highlight เมนู)
export function useActivePath(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith("/deck/")) {
    const deckId = pathname.slice(6); // extract id after "/deck/"
    if (getDeck(deckId)) return "/decks";
    return pathname; // invalid deck: no highlight
  }
  if (pathname.startsWith("/checkout")) return "/shop";
  if (pathname.startsWith("/settings")) return "/settings";
  return pathname;
}
