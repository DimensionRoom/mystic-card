import { recentReadings } from "../data/decks";
import { useLanguage } from "../i18n/LanguageContext";

interface RecentReadingsProps {
  onNavigate: (path: string) => void;
}

export default function RecentReadings({ onNavigate }: RecentReadingsProps) {
  const { t } = useLanguage();
  return (
    <article className="flex flex-col rounded-bubble border border-mystic-border/70 bg-white p-5 shadow-pastel">
      <h4 className="flex items-center gap-2 font-bold text-mystic-ink">
        <span aria-hidden="true">🔮</span> {t.home.recentReadingsTitle}
      </h4>

      <ul className="mt-3 flex flex-1 flex-col divide-y divide-mystic-border/50">
        {recentReadings.map((reading) => (
          <li key={reading.id}>
            <button
              type="button"
              onClick={() => onNavigate(`/readings/${reading.id}`)}
              aria-label={t.home.viewReadingAriaLabel
                .replace("{title}", reading.title)
                .replace("{deckName}", reading.deckName)}
              className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:bg-mystic-pink-light"
            >
              <img
                src={reading.image}
                alt=""
                className="h-11 w-11 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-mystic-ink">
                  {reading.title}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-sm text-mystic-muted">
                  {reading.deckName}
                  <span className="whitespace-nowrap rounded-full bg-mystic-pink-soft px-2 py-0.5 text-xs font-semibold text-mystic-pink">
                    {reading.cardCount} {t.home.cardsUnit}
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-right text-xs text-mystic-muted">
                {reading.when}
                <span className="ml-1.5" aria-hidden="true">
                  ›
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onNavigate("/readings")}
        className="mt-3 self-center font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
      >
        {t.home.viewAll}
      </button>
    </article>
  );
}
