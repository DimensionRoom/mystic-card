import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

export type QuestionCategory = "love" | "work" | "money" | "today";

/** เลนส์ความหมายรูนตามหมวดคำถาม — today/ไม่เลือก = ทั่วไป (meaning) */
export type RuneLens = "meaning" | "love" | "work" | "money";
export function lensForCategory(cat: QuestionCategory | null): RuneLens {
  return cat === "love" || cat === "work" || cat === "money" ? cat : "meaning";
}

interface QuestionChipsProps {
  category: QuestionCategory | null;
  onSelect: (cat: QuestionCategory) => void;
}

export default function QuestionChips({
  category,
  onSelect,
}: QuestionChipsProps) {
  const { t } = useLanguage();
  const chips: { id: QuestionCategory; label: string }[] = [
    { id: "love", label: t.runeDice.catLove },
    { id: "work", label: t.runeDice.catWork },
    { id: "money", label: t.runeDice.catMoney },
    { id: "today", label: t.runeDice.catToday },
  ];

  return (
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
  );
}
