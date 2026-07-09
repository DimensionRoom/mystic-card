import { useLanguage } from "../i18n/LanguageContext";

interface HeroBannerProps {
  onNavigate: (path: string) => void;
}

export default function HeroBanner({ onNavigate }: HeroBannerProps) {
  const { t } = useLanguage();
  return (
    <section aria-label={t.home.heroTitle} className="relative">
      {/* cloudy pastel backdrop */}
      <div className="rounded-bubble-lg bg-gradient-to-r from-[#EFE3F8] via-[#F5E7F5] to-[#DECCF1] md:min-h-[252px]">
        <div className="relative z-10 max-w-full p-7 md:max-w-[46%] md:p-10">
          <h3 className="text-2xl font-extrabold text-mystic-ink md:text-[27px]">
            {t.home.heroTitle}
          </h3>
          <p className="mt-3 leading-relaxed text-mystic-ink/75">
            {t.home.heroBodyLine1}
            <br />
            {t.home.heroBodyLine2}
          </p>
          <button
            type="button"
            onClick={() => onNavigate("/decks")}
            className="mt-6 rounded-full bg-gradient-to-r from-mystic-pink to-mystic-purple-soft px-7 py-3 font-bold text-white shadow-pastel transition-transform hover:scale-105 active:scale-95"
          >
            {t.home.heroButton}
          </button>
        </div>

        {/* mobile illustration */}
        <img
          src="/img/hero-art.png"
          alt={t.home.heroImageAlt}
          className="w-full rounded-b-bubble-lg md:hidden"
        />
      </div>

      {/* desktop illustration: bottom-anchored, witch hat overflows the banner top */}
      <img
        src="/img/hero-art.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden h-[118%] max-w-[60%] rounded-br-bubble-lg object-contain object-right-bottom [mask-image:linear-gradient(to_right,transparent,black_12%)] md:block"
      />
    </section>
  );
}
