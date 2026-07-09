import { useRef } from "react";
import { decks } from "../data/decks";
import { useLanguage } from "../i18n/LanguageContext";
import DeckCard from "./DeckCard";

interface DeckShelfProps {
  onNavigate: (path: string) => void;
}

export default function DeckShelf({ onNavigate }: DeckShelfProps) {
  const rowRef = useRef<HTMLUListElement>(null);
  const { t } = useLanguage();

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 480, behavior: "smooth" });
  };

  return (
    <section aria-label={t.home.deckShelfTitle}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-mystic-ink">
          {t.home.deckShelfTitle}
        </h3>
        <button
          type="button"
          onClick={() => onNavigate("/decks")}
          className="font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
        >
          {t.home.viewAll}
        </button>
      </div>

      <div className="relative mt-4">
        <ul
          ref={rowRef}
          className="no-scrollbar grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:flex md:snap-x md:overflow-x-auto md:pb-2 xl:grid xl:grid-cols-6 xl:overflow-visible xl:pb-0"
        >
          {decks.map((deck) => (
            <li
              key={deck.id}
              className="md:w-56 md:shrink-0 md:snap-start xl:w-auto"
            >
              <DeckCard deck={deck} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>

        {/* carousel arrow: tablet only (desktop shows the full 6-column grid) */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label={t.home.deckShelfNextAriaLabel}
          className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-mystic-border bg-white p-3 text-mystic-purple shadow-pastel-lg transition-transform hover:scale-110 md:block xl:hidden"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
