import type { Deck } from "../data/decks";
import { useLanguage } from "../i18n/LanguageContext";
import type { translations } from "../i18n/translations";
import Icon, { type IconName } from "./Icon";

export type ReadingType = "one-card" | "three-card" | "five-card";

export interface ReadingOption {
  id: ReadingType;
  title: string;
  cardCount: number;
  description: string;
  icon: IconName;
}

export function getReadingOptions(
  t: (typeof translations)["th"],
): ReadingOption[] {
  return [
    {
      id: "one-card",
      title: t.deckReading.option1Title,
      cardCount: 1,
      description: t.deckReading.option1Desc,
      icon: "moon",
    },
    {
      id: "three-card",
      title: t.deckReading.option2Title,
      cardCount: 3,
      description: t.deckReading.option2Desc,
      icon: "grid",
    },
    {
      id: "five-card",
      title: t.deckReading.option3Title,
      cardCount: 5,
      description: t.deckReading.option3Desc,
      icon: "cards",
    },
  ];
}

interface ReadingTypePanelProps {
  deck: Deck;
  readingType: ReadingType;
  onChangeType: (type: ReadingType) => void;
  onNavigate: (path: string) => void;
}

export default function ReadingTypePanel({
  deck,
  readingType,
  onChangeType,
  onNavigate,
}: ReadingTypePanelProps) {
  const { t } = useLanguage();
  const readingOptions = getReadingOptions(t);
  return (
    <div className="flex flex-col gap-5">
      {/* Deck info */}
      <section
        aria-label={t.deckReading.deckInfoWithNameAriaLabel.replace(
          "{name}",
          deck.name,
        )}
        className="rounded-bubble border border-mystic-border bg-[#FFF8FC] p-5 shadow-pastel"
      >
        <div className="flex items-start gap-4">
          <img
            src={deck.cardBack}
            alt={t.deckReading.deckImageAlt.replace("{name}", deck.name)}
            className="h-28 w-[88px] shrink-0 rounded-xl object-cover shadow-pastel"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-mystic-ink-deep">{deck.name}</h4>
            <p className="mt-1 text-sm leading-snug text-mystic-muted">
              {deck.tagline.split(" ")[0]}
            </p>
            <p className="mt-2 text-sm text-mystic-ink/70">
              {deck.cardCount} {t.deckReading.cardsUnit}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("/favorites")}
          className="mt-4 w-full rounded-2xl border border-mystic-border-purple bg-white/80 py-2.5 text-sm font-semibold text-mystic-ink/75 transition-colors hover:bg-mystic-lavender"
        >
          {t.deckReading.favoriteAddButton}{" "}
          <span aria-hidden="true">🤍</span>
        </button>
      </section>

      {/* Reading types */}
      <section
        aria-label={t.deckReading.readingTypeTitle}
        className="rounded-bubble border border-mystic-border bg-white p-5 shadow-pastel"
      >
        <h4 className="font-bold text-mystic-ink-deep">
          {t.deckReading.readingTypeTitle}
        </h4>

        <div className="mt-4 flex flex-col gap-3" role="radiogroup">
          {readingOptions.map((option) => {
            const active = option.id === readingType;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChangeType(option.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-mystic-pink-deep bg-[#FFF7FB] shadow-pastel"
                    : "border-[#EFE2F6] bg-white hover:border-mystic-border-purple"
                }`}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-mystic-pink-soft text-mystic-pink-deep"
                        : "bg-mystic-lavender text-mystic-purple"
                    }`}
                  >
                    <Icon name={option.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold text-mystic-ink-deep">
                      {option.title}
                    </span>
                    <span
                      className={`ml-2 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
                        active
                          ? "bg-mystic-pink-soft text-mystic-pink-deep"
                          : "bg-mystic-lavender text-mystic-purple"
                      }`}
                    >
                      {option.cardCount} {t.deckReading.cardsUnit}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-mystic-muted">
                      {option.description}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
