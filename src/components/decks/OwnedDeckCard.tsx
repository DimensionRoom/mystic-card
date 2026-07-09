import type { OwnedDeck } from "../../data/ownedDecks";
import Icon from "../Icon";

interface OwnedDeckCardProps {
  deck: OwnedDeck;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigate: (path: string) => void;
}

export default function OwnedDeckCard({
  deck,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}: OwnedDeckCardProps) {
  const deckPath = deck.link ?? `/deck/${deck.id}`;

  return (
    <article className="group relative flex flex-col rounded-[20px] border border-[#EADFF7] bg-white p-2.5 shadow-[0_8px_24px_rgba(124,92,250,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(124,92,250,0.14)]">
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `เอา ${deck.title} ออกจากรายการโปรด`
            : `เพิ่ม ${deck.title} ในรายการโปรด`
        }
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-pastel backdrop-blur transition-transform hover:scale-110"
      >
        <span key={String(isFavorite)} className="animate-heart-pop">
          {isFavorite ? (
            <span aria-hidden="true">💗</span>
          ) : (
            <Icon name="heart" className="h-[17px] w-[17px] text-mystic-muted" />
          )}
        </span>
      </button>

      <div className="relative overflow-hidden rounded-[14px]">
        {deck.access === "free" && (
          <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
            ฟรี
          </span>
        )}
        <img
          src={deck.cover}
          alt={`ปกไพ่ ${deck.title}`}
          className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-1 pb-1.5 pt-2.5 text-center">
        <h3 className="line-clamp-2 flex min-h-[40px] items-center text-sm font-bold leading-snug text-mystic-ink-deep">
          {deck.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-mystic-lavender px-2.5 py-0.5 font-bold text-mystic-purple">
            {deck.type}
          </span>
          <span className="text-mystic-muted">{deck.cards} ใบ</span>
        </p>

        <button
          type="button"
          onClick={() => onNavigate(deckPath)}
          aria-label={`เปิดไพ่ ${deck.title}`}
          className="mt-2.5 min-h-10 w-full rounded-xl bg-gradient-to-r from-[#FF6FAE] to-[#F75FA2] text-sm font-bold text-white shadow-[0_8px_18px_rgba(247,95,162,0.25)] transition hover:brightness-105 active:scale-95"
        >
          เปิดไพ่
        </button>
        {deck.hasEbook ? (
          <button
            type="button"
            onClick={() => onNavigate(`/deck/${deck.id}/ebook`)}
            aria-label={`เปิด E-book ของ ${deck.title}`}
            className="mt-2 min-h-10 w-full rounded-xl border border-mystic-border-purple bg-white text-sm font-semibold text-mystic-purple transition-all hover:bg-mystic-lavender active:scale-95"
          >
            E-book
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="mt-2 min-h-10 w-full cursor-not-allowed rounded-xl border border-mystic-border bg-white text-sm font-semibold text-mystic-muted opacity-60"
          >
            📖 เร็ว ๆ นี้
          </button>
        )}
      </div>
    </article>
  );
}
