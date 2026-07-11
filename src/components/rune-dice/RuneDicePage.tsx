import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { useToast } from "../../router/ToastContext";
import { saveReading } from "../../lib/db";
import {
  DICE_SETS,
  diceSetById,
  symbolById,
  type DiceSetId,
} from "../../data/diceSets";
import { diceSymbolCopy } from "../../i18n/translations";
import UserActions from "../UserActions";
import RuneDiceBoard from "./RuneDiceBoard";
import ResultPanel from "./ResultPanel";
import StepIndicator from "./StepIndicator";
import QuestionChips, {
  lensForCategory,
  type QuestionCategory,
} from "./QuestionChips";
import { useDiceRoll } from "./useDiceRoll";
import { STRENGTH_MIN, STRENGTH_MAX, STRENGTH_DEFAULT } from "./dicePhysics";

interface RuneDicePageProps {
  onNavigate: (path: string) => void;
}

export default function RuneDicePage({ onNavigate }: RuneDicePageProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [setId, setSetId] = useState<DiceSetId>("runes-d6");
  const set = diceSetById(setId);
  const { phase, rollId, assignment, results, roll, onSettling, onSettled } =
    useDiceRoll(set);

  const [category, setCategory] = useState<QuestionCategory | null>(null);
  const [power, setPower] = useState(STRENGTH_DEFAULT);
  const [saved, setSaved] = useState(false);

  const setLabel: Record<DiceSetId, string> = {
    "runes-d6": t.runeDice.setRunesD6,
    "runes-d8": t.runeDice.setRunesD8,
    "celestial-d8": t.runeDice.setCelestial,
  };
  const setIcon: Record<DiceSetId, string> = {
    "runes-d6": "🎲",
    "runes-d8": "🔷",
    "celestial-d8": "🌙",
  };

  // เริ่มทอยใหม่ = ล้างสถานะบันทึกของรอบก่อน
  useEffect(() => {
    if (rollId > 0) setSaved(false);
  }, [rollId]);

  const rolling = phase === "rolling" || phase === "settling";
  const currentStep = phase === "revealed" ? 3 : category ? 2 : 1;

  // เลนส์ความหมายตามหมวด + ป้ายหัวข้อที่ถาม
  const lens = lensForCategory(category);
  const categoryLabel: Record<QuestionCategory, string> = {
    love: t.runeDice.catLove,
    work: t.runeDice.catWork,
    money: t.runeDice.catMoney,
    today: t.runeDice.catToday,
  };
  const topic = category ? categoryLabel[category] : undefined;
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
      deckName: `${t.runeDice.deckName} · ${setLabel[setId]}`,
      deckType: "Rune",
      readingType: "rune-dice-3",
      cards: results.map((r, i) => {
        const copy = diceSymbolCopy(t, set.copyGroup, r.symbolId);
        return {
          id: r.symbolId,
          title: `${copy.name} (${symbolById(set, r.symbolId).translit})`,
          subtitle: [t.runeDice.pos1, t.runeDice.pos2, t.runeDice.pos3][i],
          image: "",
          meaning: copy[lens],
        };
      }),
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
      <QuestionChips category={category} onSelect={setCategory} />

      {/* แถบเลือกชุดลูกเต๋า — เปลี่ยนทรง/สัญลักษณ์/คำทำนาย (ห้ามสลับระหว่างทอย) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-sm font-semibold text-mystic-muted">
          {t.runeDice.setLabel}:
        </span>
        {DICE_SETS.map((s) => {
          const active = s.id === setId;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => setSetId(s.id)}
              disabled={rolling}
              aria-pressed={active}
              whileTap={{ scale: 0.94 }}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? "border-transparent bg-mystic-purple text-white shadow-pastel"
                  : "border-mystic-border bg-white text-mystic-ink/70 hover:bg-mystic-lavender/50"
              }`}
            >
              {setIcon[s.id]} {setLabel[s.id]}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---- board + controls ---- */}
        <div className="flex flex-col gap-4">
          <motion.div
            aria-label={t.runeDice.boardAriaLabel}
            animate={
              rolling
                ? { boxShadow: "0 0 46px rgba(230,190,110,0.5) inset, 0 18px 50px rgba(40,25,80,0.35)" }
                : { boxShadow: "0 0 0px rgba(230,190,110,0) inset, 0 18px 50px rgba(40,25,80,0.35)" }
            }
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] min-h-[300px] w-full overflow-hidden rounded-bubble-lg border border-[#3a2c66] bg-[linear-gradient(160deg,#3b1080_0%,#000000_100%)] md:aspect-[16/10]"
          >
            <RuneDiceBoard
              rollId={rollId}
              phase={phase}
              set={set}
              assignment={assignment}
              power={power}
              onSettling={onSettling}
              onSettled={onSettled}
            />

            {/* ตัวปรับความแรง — บนจอเล็กย้ายไปไว้ใต้บอร์ด (ไม่บังกระดาน) */}
            <div className="pointer-events-auto absolute left-4 top-4 z-20 hidden w-[190px] flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/35 px-3.5 py-2.5 backdrop-blur-md sm:flex">
              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-100/90">
                <span>🎲 {t.runeDice.powerLabel}</span>
                <span className="tabular-nums text-amber-200">
                  {power.toFixed(1)}×
                </span>
              </div>
              <input
                type="range"
                min={STRENGTH_MIN}
                max={STRENGTH_MAX}
                step={0.1}
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                disabled={rolling}
                aria-label={t.runeDice.powerLabel}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-amber-300/40 to-amber-400 accent-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-white/55">
                <span>{t.runeDice.powerLight}</span>
                <span>{t.runeDice.powerStrong}</span>
              </div>
            </div>

            {/* flash ทองวูบตอนเริ่มทอย — เอฟเฟกต์ให้ feedback ชัดเจน */}
            <AnimatePresence>
              {phase === "rolling" && (
                <motion.div
                  key={rollId}
                  initial={{ opacity: 0.55 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,224,150,0.7)_0%,transparent_60%)]"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* ตัวปรับความแรงสำหรับจอเล็ก — อยู่ใต้บอร์ด ไม่บังกระดาน */}
          <div className="flex items-center gap-3 rounded-2xl border border-mystic-border-purple bg-white px-4 py-3 sm:hidden">
            <span className="whitespace-nowrap text-sm font-semibold text-mystic-purple">
              🎲 {t.runeDice.powerLabel}
            </span>
            <input
              type="range"
              min={STRENGTH_MIN}
              max={STRENGTH_MAX}
              step={0.1}
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              disabled={rolling}
              aria-label={t.runeDice.powerLabel}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-mystic-lavender accent-mystic-purple disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="w-10 text-right text-sm font-bold tabular-nums text-mystic-purple">
              {power.toFixed(1)}×
            </span>
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
          set={set}
          lens={lens}
          topic={topic}
          saved={saved}
          onSave={() => void handleSave()}
          onBonus={() => showToast(t.runeDice.bonusToast)}
        />
      </div>
    </div>
  );
}
