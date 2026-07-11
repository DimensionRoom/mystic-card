import { AnimatePresence, motion } from "framer-motion";
import { symbolById, type DiceSetDef } from "../../data/diceSets";
import { diceSymbolCopy } from "../../i18n/translations";
import { useLanguage } from "../../i18n/LanguageContext";
import Icon from "../Icon";
import type { RuneLens } from "./QuestionChips";
import type { DieResult } from "./useDiceRoll";

interface ResultPanelProps {
  results: DieResult[];
  rollId: number;
  /** ชุดลูกเต๋าที่ทอย — กำหนด glyph + กลุ่มคำทำนาย */
  set: DiceSetDef;
  /** เลนส์ความหมายตามหมวดคำถาม */
  lens: RuneLens;
  /** หัวข้อที่ถาม (โชว์บนหัว panel ถ้ามี) */
  topic?: string;
  saved: boolean;
  onSave: () => void;
  onBonus: () => void;
}

// สไตล์ต่อบทบาท: 1 ชมพู, 2 เหลืองอำพัน, 3 ม่วง (ตรงกับสี glyph บนลูกเต๋า)
const POS_STYLES = [
  {
    card: "border-[#F7D9EA] bg-[#FFF6FB]",
    label: "text-mystic-pink",
    circle: "bg-mystic-pink text-white",
    badge: "💗",
  },
  {
    card: "border-amber-200 bg-amber-50/70",
    label: "text-amber-600",
    circle: "bg-amber-400 text-white",
    badge: "⚠️",
  },
  {
    card: "border-[#E3D5F5] bg-[#F8F3FF]",
    label: "text-mystic-purple",
    circle: "bg-mystic-purple text-white",
    badge: "🌠",
  },
];

export default function ResultPanel({
  results,
  rollId,
  set,
  lens,
  topic,
  saved,
  onSave,
  onBonus,
}: ResultPanelProps) {
  const { t } = useLanguage();
  const positions = [t.runeDice.pos1, t.runeDice.pos2, t.runeDice.pos3];
  const hasResults = results.length === 3;

  return (
    <aside className="flex flex-col gap-4 rounded-bubble-lg border border-[#EADFF7] bg-gradient-to-b from-[#FBF7FF] to-white p-5 shadow-[0_12px_32px_rgba(124,92,250,0.08)]">
      <h3 className="flex items-center justify-center gap-2 text-lg font-extrabold text-mystic-purple">
        <span aria-hidden="true">✦</span> {t.runeDice.panelTitle}{" "}
        <span aria-hidden="true">✦</span>
      </h3>

      {topic && (
        <p className="-mt-2 line-clamp-2 text-center text-xs text-mystic-muted">
          {t.runeDice.topicPrefix}: <span className="font-semibold text-mystic-purple">{topic}</span>
        </p>
      )}

      {!hasResults ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="rune-glyph text-5xl text-mystic-purple/40" aria-hidden="true">
            ᚱ
          </span>
          <p className="max-w-[200px] text-sm text-mystic-muted">
            {t.runeDice.panelEmpty}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={rollId}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
            className="flex flex-col gap-3"
          >
            {results.map((r, i) => {
              const symbol = symbolById(set, r.symbolId);
              const copy = diceSymbolCopy(t, set.copyGroup, r.symbolId);
              const s = POS_STYLES[i];
              return (
                <motion.article
                  key={`${rollId}-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 260, damping: 20 },
                    },
                  }}
                  className={`rounded-[18px] border p-4 ${s.card}`}
                >
                  <p
                    className={`flex items-center gap-1.5 text-sm font-bold ${s.label}`}
                  >
                    {i + 1}. {positions[i]}
                    <span className="ml-auto text-base" aria-hidden="true">
                      {s.badge}
                    </span>
                  </p>
                  <div className="mt-2.5 flex items-start gap-3">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${s.circle}`}
                    >
                      <span className="rune-glyph text-3xl leading-none">
                        {symbol.glyph}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-mystic-ink-deep">
                        {copy.name} ({symbol.translit})
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-mystic-ink/75">
                        {copy[lens]}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="mt-1 flex gap-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={!hasResults || saved}
          className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-mystic-border-purple bg-white py-2.5 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="book" className="h-4 w-4" />
          {saved ? t.runeDice.savedButton : t.runeDice.saveButton}
        </button>
        <button
          type="button"
          onClick={onBonus}
          disabled={!hasResults}
          className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-mystic-border-purple bg-white py-2.5 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="cards" className="h-4 w-4" />
          {t.runeDice.bonusButton}
        </button>
      </div>
    </aside>
  );
}
