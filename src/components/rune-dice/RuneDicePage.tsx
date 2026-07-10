import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { useToast } from "../../router/ToastContext";
import { saveReading } from "../../lib/db";
import { runeById } from "../../data/runes";
import UserActions from "../UserActions";
import RuneDiceBoard from "./RuneDiceBoard";
import ResultPanel from "./ResultPanel";
import StepIndicator from "./StepIndicator";
import QuestionChips, { type QuestionCategory } from "./QuestionChips";
import { useDiceRoll } from "./useDiceRoll";

interface RuneDicePageProps {
  onNavigate: (path: string) => void;
}

export default function RuneDicePage({ onNavigate }: RuneDicePageProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { phase, rollId, assignment, results, roll, onSettling, onSettled } =
    useDiceRoll();

  const [category, setCategory] = useState<QuestionCategory | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [saved, setSaved] = useState(false);

  // เริ่มทอยใหม่ = ล้างสถานะบันทึกของรอบก่อน
  useEffect(() => {
    if (rollId > 0) setSaved(false);
  }, [rollId]);

  const rolling = phase === "rolling" || phase === "settling";
  const currentStep = phase === "revealed" ? 3 : category ? 2 : 1;
  const hint =
    phase === "revealed"
      ? t.runeDice.hintRevealed
      : rolling
        ? t.runeDice.hintRolling
        : t.runeDice.hintIdle;

  const handleSave = async () => {
    if (results.length !== 3) return;
    if (!user) {
      showToast(t.runeDice.saveLoginToast);
      return;
    }
    await saveReading(user.id, {
      deckId: "rune-dice",
      deckName: t.runeDice.deckName,
      deckType: "Rune",
      readingType: "rune-dice-3",
      cards: results.map((r, i) => ({
        id: r.runeId,
        title: `${t.runeDice.runes[r.runeId].name} (${runeById(r.runeId).translit})`,
        subtitle: [t.runeDice.pos1, t.runeDice.pos2, t.runeDice.pos3][i],
        image: "",
        meaning: t.runeDice.runes[r.runeId].meaning,
      })),
    });
    setSaved(true);
    showToast(t.runeDice.savedToast);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
            {t.runeDice.title}
          </h2>
          <p className="mt-1.5 text-mystic-muted">{t.runeDice.subtitle}</p>
        </div>
        <UserActions onNavigate={onNavigate} />
      </header>

      <StepIndicator current={currentStep} />
      <QuestionChips
        category={category}
        onSelect={setCategory}
        customQuestion={customQuestion}
        onCustomChange={setCustomQuestion}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---- board + controls ---- */}
        <div className="flex flex-col gap-4">
          <div
            aria-label={t.runeDice.boardAriaLabel}
            className="relative aspect-[4/3] min-h-[300px] w-full overflow-hidden rounded-bubble-lg border border-[#3a2c66] bg-[linear-gradient(160deg,#3a2b63_0%,#2a1f4d_100%)] shadow-[0_18px_50px_rgba(40,25,80,0.35)] md:aspect-[16/10]"
          >
            <RuneDiceBoard
              rollId={rollId}
              phase={phase}
              assignment={assignment}
              onSettling={onSettling}
              onSettled={onSettled}
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
              <motion.button
                type="button"
                onClick={roll}
                disabled={rolling}
                whileTap={{ scale: 0.96 }}
                animate={rolling ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
                transition={
                  rolling ? { duration: 1, repeat: Infinity } : { duration: 0.2 }
                }
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8B63EE] to-[#7B4BE8] px-8 py-3.5 font-bold text-white shadow-pastel transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:px-10"
              >
                🎲 {t.runeDice.rollButton}
              </motion.button>
              <button
                type="button"
                onClick={roll}
                disabled={rolling}
                className="flex items-center justify-center gap-2 rounded-full border border-mystic-border-purple bg-white px-8 py-3.5 font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↺ {t.runeDice.rerollButton}
              </button>
            </div>
            <p className="max-w-md text-center text-sm text-mystic-muted">
              ✨ {hint} ✨
            </p>
          </div>
        </div>

        {/* ---- result panel ---- */}
        <ResultPanel
          results={results}
          rollId={rollId}
          saved={saved}
          onSave={() => void handleSave()}
          onBonus={() => showToast(t.runeDice.bonusToast)}
        />
      </div>
    </div>
  );
}
