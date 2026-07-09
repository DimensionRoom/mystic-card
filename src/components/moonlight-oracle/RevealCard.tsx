import type { Deck } from "../../data/decks";
import type { OracleCard } from "../../data/readingCards";
import { useLanguage } from "../../i18n/LanguageContext";
import CardFace from "../deck/CardFace";

export type RevealState = "revealed" | "revealing" | "waiting" | "dimmed";

interface RevealCardProps {
  /** face shown once revealed; undefined for cards that were not picked */
  card?: OracleCard;
  state: RevealState;
  /** 1-based reveal order of this card */
  position: number;
  deck: Deck;
}

/** keeps caption space identical across states so cards never shift */
function CaptionPlaceholder() {
  return (
    <span className="invisible">
      <p className="text-sm font-bold md:text-base">-</p>
      <p className="mt-0.5 text-xs md:text-sm">-</p>
    </span>
  );
}

export default function RevealCard({
  card,
  state,
  position,
  deck,
}: RevealCardProps) {
  const { t } = useLanguage();
  return (
    <figure className="flex w-[88px] shrink-0 flex-col items-center md:w-auto md:shrink">
      <div className="flex h-[156px] items-center justify-center md:h-[300px]">
        {state === "revealed" && card && (
          <div className="animate-card-flip-in rounded-[14px] border-4 border-[#6f58b8] bg-white p-1 shadow-[0_16px_32px_rgba(67,45,126,0.22)] md:rounded-[18px] md:p-1.5">
            <CardFace
              src={card.image}
              fallback={deck.cardBack}
              alt={t.deckReading.cardAlt.replace("{title}", card.title)}
              className="aspect-[19/28] w-[72px] rounded-[10px] object-cover md:w-[144px] md:rounded-[12px]"
            />
          </div>
        )}

        {state === "revealing" && (
          <div className="animate-float-card relative">
            {/* warm glow + light ring */}
            <div
              className="animate-soft-glow absolute inset-0 scale-110 rounded-[24px] bg-[#ffd884]/40 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute left-1/2 top-1/2 h-12 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffd884]/70 animate-pulse md:h-16 md:w-60"
              aria-hidden="true"
            />
            <div className="relative -rotate-3 overflow-hidden rounded-[14px] border-4 border-[#6f58b8] shadow-[0_0_42px_rgba(255,216,132,0.65)] md:rounded-[18px]">
              <img
                src={deck.cardBack}
                alt=""
                className="aspect-[19/28] w-[80px] object-cover md:w-[160px]"
              />
            </div>
          </div>
        )}

        {state === "waiting" && (
          <div className="overflow-hidden rounded-[14px] border-2 border-[#8d76c9]/60 opacity-90 shadow-pastel brightness-[0.97] md:rounded-[18px]">
            <img
              src={deck.cardBack}
              alt=""
              className="aspect-[19/28] w-[80px] object-cover md:w-[160px]"
            />
          </div>
        )}

        {state === "dimmed" && (
          <div className="scale-95 overflow-hidden rounded-[14px] border-2 border-transparent opacity-40 saturate-50 transition-all duration-500 md:rounded-[18px]">
            <img
              src={deck.cardBack}
              alt=""
              className="aspect-[19/28] w-[80px] object-cover md:w-[160px]"
            />
          </div>
        )}
      </div>

      <figcaption
        className="mt-2 text-center md:mt-3"
        aria-live={state === "revealing" ? "polite" : undefined}
      >
        {state === "revealed" && card && (
          <>
            <p className="text-sm font-bold leading-tight text-mystic-ink-deep md:text-base">
              {card.title}
            </p>
            <p className="mt-0.5 text-xs text-mystic-ink/60 md:text-sm">
              {card.subtitle}
            </p>
          </>
        )}
        {state === "revealing" && (
          <>
            <p className="text-sm font-bold text-mystic-ink-deep md:text-base">
              {t.deckReading.revealingTitle}
            </p>
            <p className="mt-0.5 text-xs text-mystic-ink/60 md:text-sm">
              {t.deckReading.revealPositionLabel.replace(
                "{position}",
                String(position),
              )}
            </p>
          </>
        )}
        {state === "waiting" && (
          <>
            <p className="text-sm font-bold text-mystic-ink-deep/80 md:text-base">
              {t.deckReading.waitingTitle}
            </p>
            <p className="mt-0.5 text-xs text-mystic-ink/60 md:text-sm">
              {t.deckReading.revealPositionLabel.replace(
                "{position}",
                String(position),
              )}
            </p>
          </>
        )}
        {state === "dimmed" && <CaptionPlaceholder />}
      </figcaption>
    </figure>
  );
}
