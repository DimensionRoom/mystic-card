import { useEffect, useState } from "react";
import { ownedDecks } from "../../data/ownedDecks";
import { getLocalOwnedDeckIds } from "../../data/ownedDeckStore";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import type { translations } from "../../i18n/translations";
import {
  fetchFavoriteDeckIds,
  fetchOwnedDeckIds,
  setDeckFavorite,
} from "../../lib/db";
import Icon, { type IconName } from "../Icon";
import UserActions from "../UserActions";
import OwnedDeckCard from "./OwnedDeckCard";

function getFilterPills(t: (typeof translations)["th"]) {
  return [
    { id: "all", label: t.decks.filterAll },
    { id: "free", label: t.decks.filterFree, icon: "gift" as IconName },
    { id: "Oracle", label: "Oracle" },
    { id: "Tarot", label: "Tarot" },
    { id: "latest", label: t.decks.filterLatest, icon: "clock" as IconName },
    {
      id: "favorite",
      label: t.decks.filterFavorite,
      icon: "heart" as IconName,
    },
  ];
}

function getPremiumBenefits(t: (typeof translations)["th"]) {
  return [
    { icon: "cards" as IconName, title: t.decks.benefit1Title, text: t.decks.benefit1Text },
    { icon: "book" as IconName, title: t.decks.benefit2Title, text: t.decks.benefit2Text },
    { icon: "clock" as IconName, title: t.decks.benefit3Title, text: t.decks.benefit3Text },
    { icon: "gift" as IconName, title: t.decks.benefit4Title, text: t.decks.benefit4Text },
  ];
}

interface OwnedDecksPageProps {
  onNavigate: (path: string) => void;
}

export default function OwnedDecksPage({ onNavigate }: OwnedDecksPageProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const filterPills = getFilterPills(t);
  const premiumBenefits = getPremiumBenefits(t);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  // deck ที่ผู้ใช้มี — เริ่มจากว่างเสมอ (ยังไม่ซื้อ/รับ = ไม่มี deck)
  // ล็อกอิน: จาก Supabase | ไม่ล็อกอิน/demo: จาก localStorage
  const [ownedIds, setOwnedIds] = useState<Set<string>>(() =>
    user ? new Set() : new Set(getLocalOwnedDeckIds()),
  );
  const [loadingOwned, setLoadingOwned] = useState(!!user);

  useEffect(() => {
    if (!user) {
      setOwnedIds(new Set(getLocalOwnedDeckIds()));
      setLoadingOwned(false);
      setFavorites(new Set());
      return;
    }
    setLoadingOwned(true);
    void (async () => {
      const [owned, favs] = await Promise.all([
        fetchOwnedDeckIds(user.id),
        fetchFavoriteDeckIds(user.id),
      ]);
      setOwnedIds(new Set(owned));
      setFavorites(new Set(favs));
      setLoadingOwned(false);
    })();
  }, [user]);

  // แสดงเฉพาะ deck ที่มีจริง — ไม่มี deck เริ่มต้นให้อีกต่อไป
  const myDecks = ownedDecks.filter((d) => ownedIds.has(d.id));

  const q = query.trim().toLowerCase();
  let visible = myDecks.filter(
    (d) =>
      d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q),
  );
  if (filter === "Oracle" || filter === "Tarot")
    visible = visible.filter((d) => d.type === filter);
  if (filter === "free") visible = visible.filter((d) => d.access === "free");
  if (filter === "favorite") visible = visible.filter((d) => favorites.has(d.id));
  if (filter === "latest")
    visible = [...visible].sort(
      (a, b) => Number(Boolean(b.lastUsedAt)) - Number(Boolean(a.lastUsedAt)),
    );

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      const nowFavorite = !next.has(id);
      if (nowFavorite) next.add(id);
      else next.delete(id);
      if (user) void setDeckFavorite(user.id, id, nowFavorite);
      return next;
    });

  // deck ที่ใช้ล่าสุดในบรรดาที่ผู้ใช้มีจริง (ถ้าไม่มี deck เลย = undefined)
  const lastUsed = myDecks.find((d) => d.lastUsedAt) ?? myDecks[0];
  const lastUsedPath = lastUsed
    ? (lastUsed.link ?? `/deck/${lastUsed.id}`)
    : "/shop";

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
            {t.decks.pageTitle}
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-mystic-lavender text-mystic-purple"
              aria-hidden="true"
            >
              <Icon name="cards" className="h-5 w-5" />
            </span>
          </h2>
          <p className="mt-1.5 text-mystic-muted">
            {t.decks.pageSubtitle} <span aria-hidden="true">✨</span>
          </p>
        </div>
        <UserActions onNavigate={onNavigate} />
      </header>

      {/* filter pills + search */}
      <section
        aria-label={t.decks.searchFilterAriaLabel}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
          {filterPills.map((pill) => {
            const active = pill.id === filter;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilter(pill.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-[14px] px-5 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#EADCFF] ${
                  active
                    ? "bg-mystic-pink-soft text-mystic-pink shadow-pastel"
                    : "border border-[#EADFF7] bg-white text-[#3B3472] hover:bg-mystic-lavender/50"
                }`}
              >
                {pill.label}
                {pill.icon && <Icon name={pill.icon} className="h-4 w-4" />}
              </button>
            );
          })}
        </div>

        <label className="relative w-full lg:ml-auto lg:w-[300px]">
          <span className="sr-only">{t.decks.searchAriaLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.decks.searchPlaceholder}
            className="h-12 w-full rounded-[14px] border border-[#EADFF7] bg-white px-4 pr-11 text-sm text-mystic-ink outline-none placeholder:text-mystic-muted focus:border-[#B89CFF]"
          />
          <Icon
            name="search"
            className="pointer-events-none absolute right-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8D82B3]"
          />
        </label>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---- main column ---- */}
        <div className="flex min-w-0 flex-col gap-6">
          {loadingOwned ? (
            <div className="flex flex-col items-center gap-2 rounded-[22px] border border-[#EADFF7] bg-white py-16 text-center">
              <span className="text-3xl" aria-hidden="true">
                🔮
              </span>
              <p className="font-semibold text-mystic-ink/75">
                {t.decks.loadingDecks}
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[22px] border border-[#EADFF7] bg-white py-16 text-center">
              <span className="text-3xl" aria-hidden="true">
                🔮
              </span>
              <p className="font-semibold text-mystic-ink/75">
                {myDecks.length === 0
                  ? t.decks.emptyTitleNoDecks
                  : t.decks.emptyTitleNoResults}
              </p>
              <p className="text-sm text-mystic-muted">
                {myDecks.length === 0
                  ? t.decks.emptyBodyNoDecks
                  : t.decks.emptyBodyNoResults}
              </p>
              {myDecks.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onNavigate("/shop")}
                  className="mt-2 rounded-full bg-gradient-to-r from-[#FF6FAE] to-[#F75FA2] px-7 py-2.5 text-sm font-bold text-white shadow-pastel transition hover:scale-[1.03] active:scale-95"
                >
                  {t.decks.goToShopButton}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="mt-2 rounded-full border border-mystic-border-purple px-6 py-2 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
                >
                  {t.decks.clearFiltersButton}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 wide:grid-cols-5">
              {visible.map((deck) => (
                <OwnedDeckCard
                  key={deck.id}
                  deck={deck}
                  isFavorite={favorites.has(deck.id)}
                  onToggleFavorite={() => toggleFavorite(deck.id)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          {/* bottom CTA banner */}
          <section
            aria-label={t.decks.startReadingAriaLabel}
            className="relative flex flex-col gap-4 overflow-hidden rounded-[22px] border border-[#F5D9EF] bg-[linear-gradient(135deg,#FFF1FA_0%,#EEE3FF_55%,#FFEEF7_100%)] px-6 py-6 md:min-h-[130px] md:pr-64"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-extrabold text-mystic-ink-deep md:text-xl">
                {t.decks.ctaTitle}{" "}
              </h3>
              <p className="mt-1.5 text-sm text-mystic-ink/65">
                {t.decks.ctaBody}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(lastUsedPath)}
                className="mt-4 rounded-xl bg-gradient-to-r from-[#8B63EE] to-[#7B4BE8] px-6 py-3 text-sm font-bold text-white shadow-pastel transition hover:scale-[1.02] active:scale-95"
              >
                {t.decks.ctaButton}
              </button>
            </div>
            <img
              src="/img/banner-witch.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 right-8 hidden w-64 mix-blend-multiply [mask-image:linear-gradient(to_top,black_78%,transparent_100%),linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)] [mask-composite:intersect] md:block lg:w-72"
            />
          </section>
        </div>

        {/* ---- right sidebar ---- */}
        <aside className="flex flex-col gap-5">
          {/* last used — โชว์เฉพาะเมื่อมี deck จริงอย่างน้อยหนึ่งชุด */}
          {lastUsed && (
            <section
              aria-label={t.decks.lastUsedTitle}
              className="rounded-[24px] border border-[#EADFF7] bg-gradient-to-b from-[#FDF8FF] to-white p-4 shadow-[0_8px_24px_rgba(124,92,250,0.08)]"
            >
              <h4 className="flex items-center gap-2 font-bold text-mystic-ink-deep">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mystic-lavender text-mystic-purple">
                  <Icon name="clock" className="h-4 w-4" />
                </span>
                {t.decks.lastUsedTitle}
              </h4>
              <img
                src={lastUsed.cover}
                alt={t.decks.deckCoverAlt.replace("{title}", lastUsed.title)}
                className="mt-3 aspect-square w-full rounded-2xl object-cover shadow-pastel"
              />
              <h5 className="mt-3 text-center text-lg font-extrabold text-mystic-ink-deep">
                {lastUsed.title}
              </h5>
              <p className="mt-1.5 flex items-center justify-center gap-2 text-xs">
                <span className="rounded-full bg-mystic-lavender px-2.5 py-0.5 font-bold text-mystic-purple">
                  {lastUsed.type}
                </span>
                <span className="text-mystic-muted">
                  {lastUsed.cards} {t.decks.cardsUnit}
                </span>
              </p>
              {lastUsed.lastUsedAt && (
                <p className="mt-2 text-center text-xs text-mystic-muted">
                  {t.decks.lastReadLabel.replace(
                    "{date}",
                    lastUsed.lastUsedAt,
                  )}
                </p>
              )}
              <button
                type="button"
                onClick={() => onNavigate(lastUsedPath)}
                className="mt-4 h-12 w-full rounded-[14px] bg-gradient-to-r from-[#8B63EE] to-[#7B4BE8] font-bold text-white shadow-pastel transition hover:scale-[1.02] active:scale-95"
              >
                {t.decks.continueButton}
              </button>
            </section>
          )}

          {/* premium benefits */}
          <section
            aria-label={t.decks.premiumAriaLabel}
            className="rounded-[24px] border border-[#F5D9EF] bg-gradient-to-b from-[#FFF5FB] to-[#F8F1FF] p-5"
          >
            <h4 className="flex items-start gap-2.5 font-bold leading-snug text-mystic-ink-deep">
              {t.decks.premiumTitle}{" "}
              <span className="text-mystic-pink">Premium</span>
            </h4>

            <ul className="mt-4 flex flex-col gap-3.5">
              {premiumBenefits.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-mystic-purple shadow-pastel">
                    <Icon name={b.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-mystic-ink-deep">
                      {b.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-mystic-muted">
                      {b.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onNavigate("/premium")}
              className="mt-5 h-12 w-full rounded-[14px] bg-gradient-to-r from-[#FF6FAE] to-[#F75FA2] font-bold text-white shadow-[0_8px_18px_rgba(247,95,162,0.25)] transition hover:scale-[1.02] active:scale-95"
            >
              {t.decks.viewAllPerksButton}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
