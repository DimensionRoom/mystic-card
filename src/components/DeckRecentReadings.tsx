import { useLanguage } from "../i18n/LanguageContext";
import type { translations } from "../i18n/translations";

function getItems(t: (typeof translations)["th"]) {
  return [
    {
      id: "d1",
      title: t.home.mockItem1Title,
      when: t.home.mockItem1When,
      cardCount: 1,
      image: "/img/reading-thumb-1.png",
    },
    {
      id: "d2",
      title: t.home.mockItem2Title,
      when: t.home.mockItem2When,
      cardCount: 1,
      image: "/img/reading-thumb-2.png",
    },
    {
      id: "d3",
      title: t.home.mockItem3Title,
      when: t.home.mockItem3When,
      cardCount: 5,
      image: "/img/reading-thumb-3.png",
    },
  ];
}

interface DeckRecentReadingsProps {
  onNavigate: (path: string) => void;
}

export default function DeckRecentReadings({
  onNavigate,
}: DeckRecentReadingsProps) {
  const { t } = useLanguage();
  const items = getItems(t);

  return (
    <section
      aria-label={t.home.recentReadingsTitle}
      className="rounded-bubble border border-mystic-border bg-white p-5 shadow-pastel"
    >
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-bold text-mystic-ink-deep">
          <span aria-hidden="true">🔮</span> {t.home.recentReadingsTitle}
        </h4>
        <button
          type="button"
          onClick={() => onNavigate("/readings")}
          className="text-sm font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
        >
          {t.home.viewAll}
        </button>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onNavigate(`/readings/${item.id}`)}
              aria-label={t.home.viewReadingAriaLabelShort.replace(
                "{title}",
                item.title,
              )}
              className="flex w-full items-center gap-3 rounded-2xl border border-mystic-border/60 bg-[#FFFBFD] p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-pastel"
            >
              <img
                src={item.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-mystic-ink">
                  {item.title}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-mystic-muted">
                  <span className="whitespace-nowrap rounded-full bg-mystic-pink-soft px-2 py-0.5 font-semibold text-mystic-pink">
                    {item.cardCount} {t.home.cardsUnit}
                  </span>
                  {item.when}
                </span>
              </span>
              <span className="text-mystic-muted" aria-hidden="true">
                ›
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
