import { useRef, useState } from "react";
import type { Deck } from "../data/decks";
import { drawRandomCards, type OracleCard } from "../data/readingCards";
import { useAuth } from "../auth/AuthContext";
import { saveReading } from "../lib/db";
import DeckHeader from "./DeckHeader";
import DeckTabs, { type DeckTab } from "./DeckTabs";
import ReadingTypePanel, {
  readingOptions,
  type ReadingType,
} from "./ReadingTypePanel";
import DeckRecentReadings from "./DeckRecentReadings";
import ReadingBoard from "./moonlight-oracle/ReadingBoard";
import CardMeaningTab from "./deck/CardMeaningTab";
import AboutDeckTab from "./deck/AboutDeckTab";
import CardFace from "./deck/CardFace";

interface DeckReadingPageProps {
  deck: Deck;
  onNavigate: (path: string) => void;
  activeTab: DeckTab;
  onTabChange: (tab: DeckTab) => void;
}

export default function DeckReadingPage({
  deck,
  onNavigate,
  activeTab,
  onTabChange,
}: DeckReadingPageProps) {
  const [readingType, setReadingType] = useState<ReadingType>("one-card");
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  // reading flow: pick cards face-down, then reveal them one by one
  const [mode, setMode] = useState<"select" | "reveal">("select");
  const [revealedCount, setRevealedCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { user } = useAuth();
  // กันบันทึกซ้ำ: เก็บผลลง Supabase ครั้งเดียวต่อการเปิดไพ่หนึ่งรอบ
  const savedThisRound = useRef(false);

  const requiredCount = readingOptions.find(
    (o) => o.id === readingType,
  )!.cardCount;
  // 1- and 3-card readings pick from a spread of 3; 5-card shows all 5
  const displayCount = requiredCount === 5 ? 5 : 3;
  // ไพ่ที่จั่วได้รอบนี้ — สุ่มใหม่ (Fisher–Yates) ทุกครั้งที่เริ่มเปิดไพ่/สับไพ่
  // เดิมใช้ sampleCards.slice() ตายตัว ทำให้ได้ไพ่ชุดเดิมซ้ำทุกรอบ
  const [drawnCards, setDrawnCards] = useState<OracleCard[]>(() =>
    drawRandomCards(deck.id, requiredCount),
  );

  const changeReadingType = (type: ReadingType) => {
    setReadingType(type);
    setSelectedCards([]);
    setMode("select");
    const count = readingOptions.find((o) => o.id === type)!.cardCount;
    setDrawnCards(drawRandomCards(deck.id, count));
  };

  const toggleCard = (index: number) => {
    setSelectedCards((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      if (prev.length >= requiredCount) return prev;
      return [...prev, index];
    });
  };

  const shuffle = () => {
    setSelectedCards([]);
    setIsShuffling(true);
    setDrawnCards(drawRandomCards(deck.id, requiredCount));
    window.setTimeout(() => setIsShuffling(false), 400);
  };

  const startReading = () => {
    // จั่วสดใหม่ทุกรอบ ให้ผลไพ่ไม่ผูกกับรอบก่อนหน้า
    setDrawnCards(drawRandomCards(deck.id, requiredCount));
    setMode("reveal");
    setRevealedCount(1);
    savedThisRound.current = false;
  };

  const openFullReading = () => {
    setShowResult(true);
    if (user && !savedThisRound.current) {
      savedThisRound.current = true;
      void saveReading(user.id, {
        deckId: deck.id,
        deckName: deck.name,
        deckType: deck.type,
        readingType,
        cards: drawnCards,
      });
    }
  };

  const revealNext = () =>
    setRevealedCount((n) => Math.min(n + 1, requiredCount));

  // "สับใหม่" on the board: back to picking fresh face-down cards
  const reshuffleBoard = () => {
    setMode("select");
    shuffle();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative z-10">
        <DeckHeader deck={deck} onNavigate={onNavigate} />
      </div>

      {/* right rail shows only on the reading tab, per the reference design */}
      <div
        className={`grid grid-cols-1 gap-6 ${
          activeTab === "read" ? "xl:grid-cols-[1fr_300px]" : ""
        }`}
      >
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4 rounded-bubble-lg border border-[#F1DDF4] bg-[#FFF9FD] p-3 md:p-4">
          <DeckTabs active={activeTab} onChange={onTabChange} />

          {activeTab === "read" && (
            <ReadingBoard
              deck={deck}
              mode={mode}
              displayCount={displayCount}
              requiredCount={requiredCount}
              selectedCards={selectedCards}
              isShuffling={isShuffling}
              drawnCards={drawnCards}
              revealedCount={revealedCount}
              onToggleCard={toggleCard}
              onShuffle={mode === "select" ? shuffle : reshuffleBoard}
              onStart={startReading}
              onRevealNext={revealNext}
              onViewFullReading={openFullReading}
            />
          )}

          {activeTab === "meaning" && <CardMeaningTab deck={deck} />}

          {activeTab === "about" && (
            <AboutDeckTab
              deck={deck}
              onNavigate={onNavigate}
              onSwitchTab={onTabChange}
            />
          )}
        </div>

        {/* Right panel */}
        {activeTab === "read" && (
          <ReadingTypePanel
            deck={deck}
            readingType={readingType}
            onChangeType={changeReadingType}
            onNavigate={onNavigate}
          />
        )}
      </div>

      <DeckRecentReadings onNavigate={onNavigate} />

      {/* Full reading result modal */}
      {showResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="คำทำนายเต็ม"
        >
          <button
            type="button"
            aria-label="ปิดคำทำนาย"
            onClick={() => setShowResult(false)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-bubble-lg bg-white p-6 shadow-pastel-lg md:p-8">
            <h3 className="text-center text-lg font-extrabold text-mystic-ink-deep">
              คำทำนายจาก {deck.name} <span aria-hidden="true">🔮</span>
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {drawnCards.map((card, i) => (
                <li key={card.id} className="flex items-start gap-4">
                  <CardFace
                    src={card.image}
                    fallback={deck.cardBack}
                    alt={`ไพ่ ${card.title}`}
                    className="aspect-[19/28] w-16 shrink-0 rounded-lg border-2 border-mystic-border-purple object-cover shadow-pastel md:w-20"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-mystic-muted">
                      ใบที่ {i + 1}
                    </p>
                    <p className="font-bold text-mystic-ink-deep">
                      {card.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mystic-ink/75">
                      {card.meaning}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowResult(false);
                  reshuffleBoard();
                }}
                className="rounded-full bg-gradient-to-r from-mystic-pink to-mystic-purple-soft px-6 py-2.5 font-bold text-white shadow-pastel transition-transform hover:scale-105"
              >
                อ่านอีกครั้ง ✨
              </button>
              <button
                type="button"
                onClick={() => setShowResult(false)}
                className="rounded-full border border-mystic-border px-6 py-2.5 font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
