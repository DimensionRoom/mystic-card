import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import CursorSparkles from "./components/CursorSparkles";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import ScrollToTop from "./router/ScrollToTop";
import { useAppNavigate } from "./router/useAppNavigate";
import { useActivePath } from "./router/useActivePath";
// หน้าแรกเป็นปลายทาง landing ที่พบบ่อยสุด โหลดตรง ๆ เพื่อไม่ให้เห็น Suspense
// fallback วูบตอนเปิดแอปครั้งแรก ส่วนหน้าอื่นยัง lazy เพื่อแยก bundle
import HomePage from "./pages/HomePage";

const ReadingsRoute = lazy(() => import("./pages/ReadingsRoute"));
const ShopRoute = lazy(() => import("./pages/ShopRoute"));
const CheckoutRoute = lazy(() => import("./pages/CheckoutRoute"));
const DecksRoute = lazy(() => import("./pages/DecksRoute"));
const SettingsRoute = lazy(() => import("./pages/SettingsRoute"));
const DeckRoute = lazy(() => import("./pages/DeckRoute"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useAppNavigate();
  const activePath = useActivePath();

  // ปิด drawer อัตโนมัติเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // ปิด drawer เมื่อกดลิงก์ (แม้ที่ปลายทางเป็นแค่ toast)
  const handleDrawerNavigate = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen">
      <CursorSparkles />
      <ScrollToTop />

      {/* Fixed sidebar: desktop only */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-mystic-border xl:block">
        <Sidebar activePath={activePath} onNavigate={navigate} />
      </aside>

      {/* Drawer: tablet / mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-mystic-ink/30 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-pastel-lg">
            <Sidebar activePath={activePath} onNavigate={handleDrawerNavigate} />
          </div>
        </div>
      )}

      {/* Top bar: tablet / mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-mystic-border bg-white/90 px-4 py-3 backdrop-blur xl:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="เปิดเมนู"
          className="rounded-xl border border-mystic-border bg-white p-2 text-xl shadow-pastel"
        >
          <span aria-hidden="true">☰</span>
        </button>
        <img
          src="/img/logo.png"
          alt=""
          className="h-9 w-auto mix-blend-multiply"
        />
        <p className="font-extrabold text-mystic-ink">MYSTIC CARD</p>
      </div>

      {/* Main content: fills the area right of the sidebar, centered on wide screens */}
      <div className="xl:pl-[260px]">
        <main className="mx-auto w-full max-w-[1480px] px-4 pb-24 pt-6 md:px-8 md:pb-12 md:pt-8">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center text-mystic-muted">
                กำลังโหลด… ✨
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/readings" element={<ReadingsRoute />} />
              <Route path="/shop" element={<ShopRoute />} />
              <Route path="/checkout/:productId?" element={<CheckoutRoute />} />
              <Route path="/decks" element={<DecksRoute />} />
              <Route path="/settings/:view?" element={<SettingsRoute />} />
              <Route path="/deck/:deckId/:tab?" element={<DeckRoute />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <BottomNav activePath={activePath} onNavigate={navigate} />
    </div>
  );
}
