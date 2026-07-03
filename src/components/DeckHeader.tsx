import type { Deck } from "../data/decks";
import Icon from "./Icon";
import UserActions from "./UserActions";

interface DeckHeaderProps {
  deck: Deck;
  onNavigate: (path: string) => void;
}

export default function DeckHeader({ deck, onNavigate }: DeckHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="flex items-center gap-2 text-sm font-medium text-mystic-ink/70 transition-colors hover:text-mystic-pink"
        >
          <Icon name="arrow-left" className="h-4 w-4" />
          กลับไปเลือก Deck
        </button>

        <h2 className="mt-3 text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
          {deck.name}{" "}
          <span className="text-mystic-pink" aria-hidden="true">
            💗
          </span>
        </h2>
        <p className="mt-1.5 text-mystic-ink/70">{deck.tagline}</p>

        <ul className="mt-3 flex flex-wrap gap-2" aria-label="ข้อมูล Deck">
          {[deck.type, `${deck.cardCount} ใบ`, deck.level].map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-mystic-border bg-white px-4 py-1 text-sm text-mystic-ink/75"
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>

      <UserActions onNavigate={onNavigate} />
    </header>
  );
}
