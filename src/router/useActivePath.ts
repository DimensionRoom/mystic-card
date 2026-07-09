import { useLocation } from "react-router";

// deck page → เลือกไพ่, หน้าชำระเงิน → ร้านค้า (สำหรับ highlight เมนู)
export function useActivePath(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith("/deck/")) return "/decks";
  if (pathname.startsWith("/checkout")) return "/shop";
  if (pathname.startsWith("/settings")) return "/settings";
  return pathname;
}
