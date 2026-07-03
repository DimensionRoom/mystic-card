import type { Deck } from "../data/decks";
import Icon, { type IconName } from "./Icon";

export type ReadingType = "one-card" | "three-card" | "five-card";

export interface ReadingOption {
  id: ReadingType;
  title: string;
  cardCount: number;
  description: string;
  icon: IconName;
}

export const readingOptions: ReadingOption[] = [
  {
    id: "one-card",
    title: "คำแนะนำจากจักรวาล",
    cardCount: 1,
    description: "รับข้อความและคำแนะนำสั้นๆ จากจักรวาล",
    icon: "moon",
  },
  {
    id: "three-card",
    title: "มุมมองในปัจจุบัน",
    cardCount: 3,
    description: "มองเห็นสถานการณ์ปัจจุบัน อดีต - ปัจจุบัน - แนวทาง",
    icon: "grid",
  },
  {
    id: "five-card",
    title: "เส้นทางของฉัน",
    cardCount: 5,
    description: "สำรวจเส้นทางและคำแนะนำอย่างลึกซึ้ง",
    icon: "cards",
  },
];

interface ReadingTypePanelProps {
  deck: Deck;
  readingType: ReadingType;
  onChangeType: (type: ReadingType) => void;
  onNavigate: (path: string) => void;
}

export default function ReadingTypePanel({
  deck,
  readingType,
  onChangeType,
  onNavigate,
}: ReadingTypePanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Deck info */}
      <section
        aria-label={`ข้อมูล Deck ${deck.name}`}
        className="rounded-bubble border border-mystic-border bg-[#FFF8FC] p-5 shadow-pastel"
      >
        <div className="flex items-start gap-4">
          <img
            src={deck.cardBack}
            alt={`ภาพไพ่ ${deck.name}`}
            className="h-28 w-[88px] shrink-0 rounded-xl object-cover shadow-pastel"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-mystic-ink-deep">{deck.name}</h4>
            <p className="mt-1 text-sm leading-snug text-mystic-muted">
              {deck.tagline.split(" ")[0]}
            </p>
            <p className="mt-2 text-sm text-mystic-ink/70">
              {deck.cardCount} ใบ
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("/favorites")}
          className="mt-4 w-full rounded-2xl border border-mystic-border-purple bg-white/80 py-2.5 text-sm font-semibold text-mystic-ink/75 transition-colors hover:bg-mystic-lavender"
        >
          เพิ่มในรายการโปรด <span aria-hidden="true">🤍</span>
        </button>
      </section>

      {/* Reading types */}
      <section
        aria-label="รูปแบบการอ่าน"
        className="rounded-bubble border border-mystic-border bg-white p-5 shadow-pastel"
      >
        <h4 className="font-bold text-mystic-ink-deep">รูปแบบการอ่าน</h4>

        <div className="mt-4 flex flex-col gap-3" role="radiogroup">
          {readingOptions.map((option) => {
            const active = option.id === readingType;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChangeType(option.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-mystic-pink-deep bg-[#FFF7FB] shadow-pastel"
                    : "border-[#EFE2F6] bg-white hover:border-mystic-border-purple"
                }`}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-mystic-pink-soft text-mystic-pink-deep"
                        : "bg-mystic-lavender text-mystic-purple"
                    }`}
                  >
                    <Icon name={option.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold text-mystic-ink-deep">
                      {option.title}
                    </span>
                    <span
                      className={`ml-2 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
                        active
                          ? "bg-mystic-pink-soft text-mystic-pink-deep"
                          : "bg-mystic-lavender text-mystic-purple"
                      }`}
                    >
                      {option.cardCount} ใบ
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-mystic-muted">
                      {option.description}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
