import { useLanguage } from "../i18n/LanguageContext";

export default function UniverseMessage() {
  const { t } = useLanguage();
  return (
    <article className="flex flex-col items-center rounded-bubble border border-mystic-border-purple/70 bg-gradient-to-b from-mystic-lavender via-[#FBEFF7] to-mystic-pink-light p-6 text-center shadow-pastel">
      <h4 className="font-bold text-mystic-ink">
        {t.home.universeMessageTitle}
      </h4>

      <img
        src="/img/envelope.png"
        alt={t.home.universeMessageImageAlt}
        className="animate-float-slow my-5 w-44 mix-blend-multiply"
      />

      <blockquote className="text-mystic-ink/85">
        <p className="font-semibold">“{t.home.universeQuote}”</p>
        <p className="mt-1.5 text-sm text-mystic-ink/65">
          {t.home.universeQuoteBody}
        </p>
      </blockquote>

      <span className="mt-4 text-xl text-mystic-pink" aria-hidden="true">
        💗
      </span>
    </article>
  );
}
