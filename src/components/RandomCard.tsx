import { useLanguage } from "../i18n/LanguageContext";

interface RandomCardProps {
  onNavigate: (path: string) => void;
}

export default function RandomCard({ onNavigate }: RandomCardProps) {
  const { t } = useLanguage();
  return (
    <article className="flex h-full flex-col items-center rounded-bubble border border-mystic-border/70 bg-white p-6 text-center shadow-pastel">
      <h4 className="font-bold text-mystic-ink">
        {t.home.randomCardTitle} <span aria-hidden="true">💫</span>
      </h4>
      <p className="mt-2 text-sm text-mystic-muted">
        {t.home.randomCardBody1}
        <br />
        {t.home.randomCardBody2}
      </p>

      <img
        src="/img/mystery-card.png"
        alt={t.home.randomCardImageAlt}
        className="animate-float-slow my-4 w-32 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
      />

      <button
        type="button"
        onClick={() => onNavigate("/random-card")}
        className="mt-auto w-full rounded-full bg-gradient-to-r from-mystic-pink to-mystic-purple-soft px-6 py-3 font-bold text-white shadow-pastel transition-transform hover:scale-105 active:scale-95"
      >
        {t.home.randomCardButton}
      </button>
    </article>
  );
}
