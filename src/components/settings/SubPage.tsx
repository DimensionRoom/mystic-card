import type { ReactNode } from "react";
import Icon from "../Icon";

interface SubPageProps {
  title: string;
  description: string;
  backLabel: string;
  onBack: () => void;
  children: ReactNode;
}

/** shared shell for every settings sub page: back button + title + white card */
export default function SubPage({
  title,
  description,
  backLabel,
  onBack,
  children,
}: SubPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-2 text-sm font-medium text-mystic-ink/70 transition-colors hover:text-mystic-purple"
      >
        <Icon name="arrow-left" className="h-4 w-4" />
        {backLabel}
      </button>

      <section
        aria-label={title}
        className="rounded-[24px] border border-[#E8DEF7] bg-white p-5 shadow-[0_8px_24px_rgba(124,92,250,0.08)] md:p-7"
      >
        <h3 className="text-lg font-extrabold text-mystic-ink-deep">{title}</h3>
        <p className="mt-1 text-sm text-mystic-muted">{description}</p>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
