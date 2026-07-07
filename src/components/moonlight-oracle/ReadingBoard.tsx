import type { Deck } from "../../data/decks";
import type { OracleCard } from "../../data/readingCards";
import RevealCard, { type RevealState } from "./RevealCard";
import RevealProgress from "./RevealProgress";
import ReadingActionBar from "./ReadingActionBar";

const sparkles = [
  { top: "12%", left: "8%", delay: "0s" },
  { top: "22%", right: "6%", delay: "0.7s" },
  { top: "48%", left: "4%", delay: "1.3s" },
  { top: "8%", left: "30%", delay: "1.8s" },
  { top: "60%", right: "9%", delay: "0.3s" },
];

/** hanging moon/orb decorations along the top edge, like the reference art */
const hangings: {
  left?: string;
  right?: string;
  length: string;
  charm: string;
  size: string;
}[] = [
  { left: "8%", length: "34px", charm: "🌙", size: "text-xl" },
  { left: "16%", length: "58px", charm: "⭐", size: "text-sm" },
  { right: "18%", length: "44px", charm: "⭐", size: "text-sm" },
  { right: "9%", length: "78px", charm: "🌕", size: "text-xl" },
  { right: "26%", length: "26px", charm: "✨", size: "text-xs" },
];

export type BoardMode = "select" | "reveal";

interface ReadingBoardProps {
  deck: Deck;
  mode: BoardMode;
  /** face-down cards laid out on the board */
  displayCount: number;
  /** cards the chosen reading type requires */
  requiredCount: number;
  /** display indexes of picked cards, in pick order (= reveal order) */
  selectedCards: number[];
  isShuffling: boolean;
  /** faces drawn for this reading, by reveal order */
  drawnCards: OracleCard[];
  revealedCount: number;
  onToggleCard: (index: number) => void;
  onShuffle: () => void;
  onStart: () => void;
  onRevealNext: () => void;
  onViewFullReading: () => void;
}

export default function ReadingBoard({
  deck,
  mode,
  displayCount,
  requiredCount,
  selectedCards,
  isShuffling,
  drawnCards,
  revealedCount,
  onToggleCard,
  onShuffle,
  onStart,
  onRevealNext,
  onViewFullReading,
}: ReadingBoardProps) {
  const ready = selectedCards.length === requiredCount;
  const allRevealed = revealedCount >= requiredCount;

  // reveal state of the card at a display position, based on its pick order
  const revealStateOf = (index: number): RevealState => {
    const rank = selectedCards.indexOf(index);
    if (rank === -1) return "dimmed";
    if (rank < revealedCount) return "revealed";
    if (rank === revealedCount) return "revealing";
    return "waiting";
  };

  return (
    <section
      aria-label="กระดานเปิดไพ่"
      className="relative flex grow flex-col overflow-hidden rounded-[28px] border border-[#eadff8] bg-gradient-to-br from-[#dcd2ff] via-[#f7d9ee] to-[#fff4e7] p-5 shadow-[0_18px_50px_rgba(113,76,169,0.12)] md:min-h-[560px] lg:px-7 lg:pb-6 lg:pt-8"
    >
      {/* decorations (identical in both modes) */}
      {sparkles.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="animate-sparkle-fade pointer-events-none absolute text-lg text-amber-200"
          style={{ ...s, animationDelay: s.delay }}
        >
          ✦
        </span>
      ))}
      {hangings.map((h, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 hidden flex-col items-center md:flex"
          style={{ left: h.left, right: h.right }}
        >
          <span className="w-px bg-[#b9a3e0]/70" style={{ height: h.length }} />
          <span className={`${h.size} animate-float-slow`}>{h.charm}</span>
        </span>
      ))}

      {/* board header: same structure, text swaps with the mode */}
      <div className="relative z-10 text-center">
        <h3 className="text-xl font-bold text-mystic-ink-deep md:text-2xl">
          {mode === "select" ? (
            <>
              ตั้งสมาธิและถามคำถามในใจ <span aria-hidden="true">✨</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">🌙</span> เริ่มคำทำนายแล้ว{" "}
              <span aria-hidden="true">🌙</span>
            </>
          )}
        </h3>
        <p className="mx-auto mt-2 w-fit rounded-full bg-white/60 px-5 py-1.5 text-sm font-medium text-mystic-ink-deep shadow-[0_0_18px_rgba(255,255,255,0.8)] backdrop-blur md:text-base">
          {mode === "select"
            ? "จากนั้นเลือกไพ่ที่ใช่สำหรับคุณ"
            : "เปิดไพ่ทีละใบเพื่อรับข้อความจากแสงจันทร์"}
        </p>
      </div>

      {/* card row: cards stay in place; picked ones flip where they lie
          mobile: ห่อบรรทัดให้เห็นครบทุกใบในจอเดียว (ไม่ต้องเลื่อนแนวนอน) */}
      <div
        className="relative z-10 my-auto flex flex-wrap justify-center gap-2.5 px-0.5 py-5 md:flex-nowrap md:gap-8 md:px-2 md:py-6 lg:gap-10"
        role="group"
        aria-label={
          mode === "select"
            ? `เลือกไพ่ ${requiredCount} ใบจากไพ่ที่คว่ำอยู่`
            : "ไพ่ที่กำลังเปิด"
        }
      >
        {Array.from({ length: displayCount }, (_, i) => {
          if (mode === "select") {
            const selected = selectedCards.includes(i);
            return (
              <figure
                key={i}
                className="flex w-[88px] shrink-0 flex-col items-center md:w-auto md:shrink"
              >
                <div className="flex h-[156px] items-center justify-center md:h-[300px]">
                  <button
                    type="button"
                    onClick={() => onToggleCard(i)}
                    aria-pressed={selected}
                    aria-label={`ไพ่ใบที่ ${i + 1}${selected ? " (เลือกแล้ว)" : ""}`}
                    className={`${isShuffling ? "animate-card-shake" : ""} overflow-hidden rounded-[14px] border-2 transition-all duration-300 md:rounded-[18px] ${
                      selected
                        ? "-translate-y-2 border-mystic-pink-deep shadow-[0_10px_30px_rgba(240,98,167,0.45)]"
                        : "border-transparent shadow-pastel hover:-translate-y-2 hover:shadow-pastel-lg"
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <img
                      src={deck.cardBack}
                      alt=""
                      className="aspect-[19/28] w-[84px] object-cover md:w-[160px]"
                    />
                  </button>
                </div>
                <figcaption
                  className="invisible mt-2 text-center md:mt-3"
                  aria-hidden="true"
                >
                  <p className="text-sm font-bold md:text-base">-</p>
                  <p className="mt-0.5 text-xs md:text-sm">-</p>
                </figcaption>
              </figure>
            );
          }

          const rank = selectedCards.indexOf(i);
          return (
            <RevealCard
              key={i}
              deck={deck}
              state={revealStateOf(i)}
              position={rank + 1}
              card={rank >= 0 ? drawnCards[rank] : undefined}
            />
          );
        })}
      </div>

      {/* progress pill: same slot in both modes */}
      <div className="relative z-10 flex flex-col gap-4">
        <RevealProgress
          label={
            mode === "select"
              ? `เลือกแล้ว ${selectedCards.length} จาก ${requiredCount}`
              : `ใบที่ ${revealedCount} จาก ${requiredCount}`
          }
          filledCount={mode === "select" ? selectedCards.length : revealedCount}
          totalCount={requiredCount}
          showCurrent={mode === "reveal" && !allRevealed}
        />

        <ReadingActionBar
          primaryLabel={
            mode === "select"
              ? "เริ่มอ่านไพ่ →"
              : allRevealed
                ? "ดูคำทำนายเต็ม →"
                : "เปิดไพ่ใบถัดไป ✨"
          }
          primaryDisabled={mode === "select" && !ready}
          onPrimary={
            mode === "select"
              ? onStart
              : allRevealed
                ? onViewFullReading
                : onRevealNext
          }
          secondaryLabel={mode === "select" ? "สับไพ่ใหม่" : "สับใหม่"}
          onSecondary={onShuffle}
          hint={
            mode === "select"
              ? ready
                ? "ครบแล้ว! กดเริ่มอ่านไพ่ได้เลย 💗"
                : `💡 ตั้งสมาธิ แล้วเลือกไพ่ ${requiredCount} ใบที่เรียกหาคุณ`
              : "💡 ตั้งสติ หายใจลึก ๆ แล้วเปิดไพ่ทีละใบด้วยใจที่เปิดกว้าง 💗"
          }
        />
      </div>

      {/* witch mascot */}
      <img
        src="/img/witch-cat.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 hidden w-52 [mask-image:linear-gradient(to_right,black_62%,transparent_96%),linear-gradient(to_top,black_62%,transparent_96%)] [mask-composite:intersect] xl:block"
      />
    </section>
  );
}
