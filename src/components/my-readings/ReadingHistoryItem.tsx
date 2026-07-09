import { readingDisplayTitle, type ReadingItem } from "../../data/myReadings";
import { useLanguage } from "../../i18n/LanguageContext";
import Icon from "../Icon";

interface ReadingHistoryItemProps {
  item: ReadingItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onView: () => void;
  onNote: () => void;
  onDelete: () => void;
}

export default function ReadingHistoryItem({
  item,
  isFavorite,
  onToggleFavorite,
  onView,
  onNote,
  onDelete,
}: ReadingHistoryItemProps) {
  const { t } = useLanguage();
  return (
    <article className="relative grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-[18px] border border-[#EFE1F4] bg-white p-3.5 shadow-[0_8px_22px_rgba(80,64,120,0.06)] md:grid-cols-[84px_minmax(0,1fr)_170px] md:p-4">
      <img
        src={item.cover}
        alt={t.myReadings.deckCoverAlt.replace("{deckName}", item.deckName)}
        className="h-[100px] w-[72px] rounded-xl border border-white object-cover shadow-pastel md:h-[116px] md:w-[84px]"
      />

      <div className="min-w-0">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.deckType === "Oracle"
              ? "bg-[#EFE6FF] text-[#7C3AED]"
              : "bg-[#F3E8FF] text-[#8B5CF6]"
          }`}
        >
          {item.deckType}
        </span>
        <h4 className="mt-1.5 truncate font-bold text-mystic-ink-deep md:text-[17px]">
          {readingDisplayTitle(item)}
        </h4>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mystic-muted">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" className="h-3.5 w-3.5" />
            {item.date} • {item.time}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="cards" className="h-3.5 w-3.5" />
            {item.cardCount} {t.myReadings.cardCountUnit}
            {item.category && ` (${item.category})`}
          </span>
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mystic-ink/65">
          {item.preview}
        </p>
      </div>

      {/* actions */}
      <div className="col-span-2 flex items-center gap-2.5 md:col-span-1 md:flex-col md:items-stretch md:justify-center">
        <button
          type="button"
          onClick={onView}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(139,92,246,0.22)] transition-transform hover:scale-[1.03] active:scale-95 md:flex-none"
        >
          <Icon name="eye" className="h-4 w-4" />
          {t.myReadings.viewResultButton}
        </button>
        <button
          type="button"
          onClick={onNote}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-mystic-border-purple bg-white text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60 md:flex-none"
        >
          <Icon name="book" className="h-4 w-4" />
          {t.myReadings.noteButton}
        </button>
        <div className="flex shrink-0 items-center gap-2.5 md:justify-center">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? t.myReadings.removeFavoriteAriaLabel.replace(
                    "{title}",
                    item.title,
                  )
                : t.myReadings.addFavoriteAriaLabel.replace(
                    "{title}",
                    item.title,
                  )
            }
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
              isFavorite
                ? "border-mystic-pink-soft bg-mystic-pink-soft"
                : "border-mystic-border bg-white hover:bg-mystic-pink-light"
            }`}
          >
            <span key={String(isFavorite)} className="animate-heart-pop">
              {isFavorite ? (
                <span aria-hidden="true">💗</span>
              ) : (
                <Icon
                  name="heart"
                  className="h-[18px] w-[18px] text-mystic-muted"
                />
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={t.myReadings.deleteItemAriaLabel.replace(
              "{title}",
              item.title,
            )}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-mystic-border bg-white text-mystic-muted transition-colors hover:border-[#FFD9D9] hover:bg-[#FFF0F0] hover:text-[#FF6B6B]"
          >
            <Icon name="trash" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}
