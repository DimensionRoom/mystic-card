import type { Deck } from "../data/decks";

interface DeckCardProps {
  deck: Deck;
  onNavigate: (path: string) => void;
}

export default function DeckCard({ deck, onNavigate }: DeckCardProps) {
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-bubble border border-mystic-border/70 bg-white p-1.5 shadow-pastel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-pastel-lg">
      {/* cover art from the reference design (ribbon is part of the art) */}
      <div className="relative overflow-hidden rounded-[18px]">
        {deck.access === "free" && (
          <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
            ฟรี
          </span>
        )}
        <img
          src={deck.image}
          alt={`ภาพปกไพ่ ${deck.name} ${deck.type}`}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-0.5 px-2.5 pb-3 pt-2.5 text-center">
        <h4 className="text-[15px] font-bold leading-tight text-mystic-ink">
          {deck.name}
        </h4>
        <p className="text-sm text-mystic-ink/70">{deck.type}</p>
        <p className="text-sm text-mystic-muted">{deck.cardCount} ใบ</p>

        <button
          type="button"
          onClick={() => onNavigate(`/deck/${deck.id}`)}
          aria-label={`เลือกไพ่ ${deck.name}`}
          className="mt-2 min-h-10 w-full rounded-full bg-mystic-pink-soft text-[15px] font-semibold text-mystic-pink transition-all hover:bg-mystic-pink hover:text-white active:scale-95"
        >
          เลือก
        </button>
        <button
          type="button"
          onClick={() => onNavigate(`/deck/${deck.id}/ebook`)}
          aria-label={`ซื้อ E-book ของไพ่ ${deck.name}`}
          className="mt-1.5 min-h-10 w-full rounded-full border border-mystic-border-purple bg-white text-[15px] font-semibold text-mystic-purple transition-all hover:bg-mystic-lavender active:scale-95"
        >
          E-book
        </button>
      </div>
    </article>
  );
}
