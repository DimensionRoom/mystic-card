import Icon from "../Icon";

interface ReadingActionBarProps {
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
  hint: string;
}

export default function ReadingActionBar({
  primaryLabel,
  primaryDisabled = false,
  onPrimary,
  secondaryLabel,
  onSecondary,
  hint,
}: ReadingActionBarProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onPrimary}
          disabled={primaryDisabled}
          className="h-14 rounded-2xl bg-gradient-to-r from-[#ff70ac] to-[#ef3f8e] px-10 font-semibold text-white shadow-[0_12px_24px_rgba(239,63,142,0.25)] transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_16px_28px_rgba(239,63,142,0.32)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[320px]"
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          onClick={onSecondary}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-mystic-border-purple bg-white px-8 font-semibold text-mystic-ink/80 transition-colors hover:bg-mystic-lavender sm:min-w-[170px]"
        >
          <Icon name="shuffle" className="h-[18px] w-[18px]" />
          {secondaryLabel}
        </button>
      </div>

      <p className="text-center text-sm text-[#9a82bd]">{hint}</p>
    </div>
  );
}
