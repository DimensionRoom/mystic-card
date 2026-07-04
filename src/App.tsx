import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import DeckShelf from "./components/DeckShelf";
import RecentReadings from "./components/RecentReadings";
import UniverseMessage from "./components/UniverseMessage";
import RandomCard from "./components/RandomCard";
import BottomNav from "./components/BottomNav";
import DeckReadingPage from "./components/DeckReadingPage";
import MyReadingsPage from "./components/my-readings/MyReadingsPage";
import ShopPage from "./components/shop/ShopPage";
import OwnedDecksPage from "./components/decks/OwnedDecksPage";
import SettingsPage from "./components/settings/SettingsPage";
import { getDeck } from "./data/decks";

export default function App() {
  const [route, setRoute] = useState("/");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // tiny mock router: home, deck, my-readings, and shop pages are real, the rest shows a toast
  const navigate = useCallback((path: string) => {
    setDrawerOpen(false);
    const deckMatch = path.match(/^\/deck\/([^/]+)$/);
    if (
      path === "/" ||
      path === "/readings" ||
      path === "/shop" ||
      path === "/decks" ||
      path === "/settings" ||
      (deckMatch && getDeck(deckMatch[1]))
    ) {
      setRoute(path);
      window.scrollTo({ top: 0 });
      return;
    }
    setToast(`กำลังพาไปที่ ${path} ✨`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const deckMatch = route.match(/^\/deck\/([^/]+)$/);
  const currentDeck = deckMatch ? getDeck(deckMatch[1]) : undefined;
  // on a deck page the "เลือกไพ่" menu item is highlighted
  const activePath = currentDeck ? "/decks" : route;

  return (
    <div className="min-h-screen">
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
            <Sidebar activePath={activePath} onNavigate={navigate} />
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
          {route === "/readings" ? (
            <MyReadingsPage onNavigate={navigate} />
          ) : route === "/shop" ? (
            <ShopPage onNavigate={navigate} />
          ) : route === "/decks" ? (
            <OwnedDecksPage onNavigate={navigate} />
          ) : route === "/settings" ? (
            <SettingsPage onNavigate={navigate} />
          ) : currentDeck ? (
            <DeckReadingPage
              key={currentDeck.id}
              deck={currentDeck}
              onNavigate={navigate}
            />
          ) : (
            <div className="flex flex-col gap-8">
              {/* keep header above the hero illustration's witch-hat overflow */}
              <div className="relative z-10">
                <Header onNavigate={navigate} />
              </div>
              <HeroBanner onNavigate={navigate} />
              <DeckShelf onNavigate={navigate} />

              <section
                aria-label="กิจกรรมและข้อความสำหรับคุณ"
                className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[1.75fr_1.35fr_1fr]"
              >
                <RecentReadings onNavigate={navigate} />
                <UniverseMessage />
                <div className="md:col-span-2 xl:col-span-1">
                  <RandomCard onNavigate={navigate} />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      <BottomNav activePath={activePath} onNavigate={navigate} />

      {/* Navigation toast */}
      {toast && (
        <div
          role="status"
          className="animate-toast-in fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-mystic-ink px-5 py-2.5 text-sm font-semibold text-white shadow-pastel-lg md:bottom-8"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
