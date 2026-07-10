import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

export type QuestionCategory = "love" | "work" | "money" | "today" | "custom";

/** เลนส์ความหมายรูนตามหมวดคำถาม — today/custom/ไม่เลือก = ทั่วไป (meaning) */
export type RuneLens = "meaning" | "love" | "work" | "money";
export function lensForCategory(cat: QuestionCategory | null): RuneLens {
  return cat === "love" || cat === "work" || cat === "money" ? cat : "meaning";
}

interface QuestionChipsProps {
  category: QuestionCategory | null;
  onSelect: (cat: QuestionCategory) => void;
  customQuestion: string;
  onCustomChange: (value: string) => void;
}

export default function QuestionChips({
  category,
  onSelect,
  customQuestion,
  onCustomChange,
}: QuestionChipsProps) {
  const { t } = useLanguage();
  const chips: { id: QuestionCategory; label: string }[] = [
    { id: "love", label: t.runeDice.catLove },
    { id: "work", label: t.runeDice.catWork },
    { id: "money", label: t.runeDice.catMoney },
    { id: "today", label: t.runeDice.catToday },
    { id: "custom", label: t.runeDice.catCustom },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip) => {
          const active = chip.id === category;
          return (
            <motion.button
              key={chip.id}
              type="button"
              onClick={() => onSelect(chip.id)}
              aria-pressed={active}
              whileTap={{ scale: 0.94 }}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-transparent bg-mystic-pink-soft text-mystic-pink shadow-pastel"
                  : "border-mystic-border bg-white text-mystic-ink/70 hover:bg-mystic-lavender/50"
              }`}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {category === "custom" && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            type="text"
            value={customQuestion}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder={t.runeDice.customPlaceholder}
            className="h-12 w-full rounded-[14px] border border-mystic-border-purple bg-white px-4 text-[15px] text-mystic-ink outline-none placeholder:text-mystic-muted focus:border-mystic-purple"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
