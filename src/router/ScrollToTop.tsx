import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// "scroll key" กันการ scroll ตอนสลับแท็บ/sub-view ภายในหน้าเดียวกัน (phase ถัดไป)
function getScrollKey(pathname: string): string {
  if (pathname.startsWith("/deck/")) {
    const [, , deckId] = pathname.split("/");
    return `/deck/${deckId ?? ""}`;
  }
  if (pathname.startsWith("/settings")) return "/settings";
  return pathname;
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const scrollKeyRef = useRef(getScrollKey(pathname));

  useEffect(() => {
    const key = getScrollKey(pathname);
    if (scrollKeyRef.current === key) return;
    scrollKeyRef.current = key;
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}
