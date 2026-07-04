import { useState } from "react";
import Icon from "./Icon";
import { useLanguage } from "../i18n/LanguageContext";
import { languageNames, type Language } from "../i18n/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.settings.chooseLanguage}
        className="flex items-center gap-1.5 rounded-full border border-mystic-border-purple bg-white px-3.5 py-2 text-sm font-semibold text-mystic-ink shadow-pastel transition hover:scale-[1.03] hover:bg-mystic-lavender/40 active:scale-95"
      >
        <Icon name="globe" className="h-4 w-4 text-mystic-purple" />
        <span className="hidden sm:inline">{languageNames[language]}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.settings.chooseLanguage}
        >
          <button
            type="button"
            aria-label={t.settings.close}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative w-full max-w-xs rounded-bubble-lg bg-white p-6 shadow-pastel-lg">
            <h3 className="flex items-center gap-2 font-extrabold text-mystic-ink-deep">
              <Icon name="globe" className="h-5 w-5 text-mystic-purple" />
              {t.settings.chooseLanguage}
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {(Object.keys(languageNames) as Language[]).map((lang) => {
                const active = lang === language;
                return (
                  <li key={lang}>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setOpen(false);
                      }}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 font-semibold transition-colors ${
                        active
                          ? "border-mystic-purple bg-mystic-lavender/60 text-mystic-purple"
                          : "border-mystic-border text-mystic-ink/75 hover:bg-mystic-lavender/40"
                      }`}
                    >
                      {languageNames[lang]}
                      {active && <span aria-hidden="true">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-full border border-mystic-border py-2.5 text-sm font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
            >
              {t.settings.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
