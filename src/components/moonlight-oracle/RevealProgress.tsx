interface RevealProgressProps {
  label: string;
  filledCount: number;
  totalCount: number;
  /** show an outlined "current" dot after the filled ones (reveal mode) */
  showCurrent?: boolean;
}

export default function RevealProgress({
  label,
  filledCount,
  totalCount,
  showCurrent = false,
}: RevealProgressProps) {
  return (
    <div className="flex justify-center">
      <div className="flex h-[38px] items-center gap-3 rounded-full border border-mystic-border-purple bg-white/80 px-5 shadow-pastel backdrop-blur">
        <span className="text-sm font-semibold text-mystic-ink-deep">
          {label}
        </span>
        <span className="flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: totalCount }, (_, i) => {
            const state =
              i < filledCount
                ? "bg-mystic-pink-deep"
                : i === filledCount && showCurrent
                  ? "border-2 border-mystic-pink-deep bg-mystic-pink-soft"
                  : "bg-mystic-ink/15";
            return (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${state}`}
              />
            );
          })}
        </span>
      </div>
    </div>
  );
}
