import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

interface StepIndicatorProps {
  /** ขั้นที่กำลังทำอยู่ (1-3) */
  current: number;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  const { t } = useLanguage();
  const steps = [t.runeDice.step1, t.runeDice.step2, t.runeDice.step3];

  return (
    <div
      aria-label={t.runeDice.stepsAriaLabel}
      className="flex items-center gap-2 rounded-full border border-mystic-border bg-white px-4 py-3 md:gap-3 md:px-6"
    >
      {steps.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        const done = step < current;
        return (
          <div key={label} className="flex flex-1 items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{
                  backgroundColor: active || done ? "#7c4be8" : "#efe7fb",
                  color: active || done ? "#ffffff" : "#8d82b3",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              >
                {done ? "✓" : step}
              </motion.span>
              <span
                className={`whitespace-nowrap text-sm font-semibold transition-colors ${
                  active
                    ? "text-mystic-ink-deep"
                    : done
                      ? "text-mystic-purple"
                      : "text-mystic-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {step < steps.length && (
              <span
                className="hidden flex-1 border-t border-dashed border-mystic-border md:block"
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
