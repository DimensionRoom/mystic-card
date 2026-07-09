import { useState } from "react";
import {
  bestSellers,
  productDeckId,
  shopProducts,
  type Product,
} from "../../data/shopProducts";
import { addLocalOwnedDeck } from "../../data/ownedDeckStore";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import type { translations } from "../../i18n/translations";
import { addOwnedDeck } from "../../lib/db";
import Icon from "../Icon";
import UserActions from "../UserActions";
import ProductCard from "./ProductCard";

type FilterChip = "all" | "Oracle" | "Tarot";
type SortOption =
  | "latest"
  | "bestseller"
  | "price-low"
  | "price-high"
  | "rating";

function getFilterChips(
  t: (typeof translations)["th"],
): { id: FilterChip; label: string }[] {
  return [
    { id: "all", label: t.shop.filterAll },
    { id: "Oracle", label: "Oracle" },
    { id: "Tarot", label: "Tarot" },
  ];
}

function getSortOptions(
  t: (typeof translations)["th"],
): { id: SortOption; label: string }[] {
  return [
    { id: "latest", label: t.shop.sortLatest },
    { id: "bestseller", label: t.shop.sortBestseller },
    { id: "price-low", label: t.shop.sortPriceLow },
    { id: "price-high", label: t.shop.sortPriceHigh },
    { id: "rating", label: t.shop.sortRating },
  ];
}

function filterProducts(
  products: Product[],
  filter: FilterChip,
  search: string,
) {
  const query = search.trim().toLowerCase();
  return products.filter((product) => {
    const matchesFilter = filter === "all" || product.kind === filter;
    const matchesSearch =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.kind.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
}

function sortProducts(products: Product[], sort: SortOption) {
  const cloned = [...products];
  switch (sort) {
    case "price-low":
      return cloned.sort((a, b) => a.price - b.price);
    case "price-high":
      return cloned.sort((a, b) => b.price - a.price);
    case "rating":
      return cloned.sort((a, b) => b.rating - a.rating);
    case "bestseller":
      // "ขายดี" ("bestseller") is the literal badge value from shopProducts.ts data
      return cloned.sort(
        (a, b) =>
          Number(b.badge === "ขายดี") - Number(a.badge === "ขายดี"),
      );
    default:
      return cloned;
  }
}

interface ShopPageProps {
  onNavigate: (path: string) => void;
}

export default function ShopPage({ onNavigate }: ShopPageProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const filterChips = getFilterChips(t);
  const sortOptions = getSortOptions(t);
  const [filter, setFilter] = useState<FilterChip>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");
  // สินค้าที่กำลังยืนยันการซื้อ/รับใน modal
  const [buying, setBuying] = useState<Product | null>(null);

  const products = sortProducts(
    filterProducts(shopProducts, filter, search),
    sort,
  );

  // ยืนยันแล้ว: ฟรี → เพิ่มเข้ารายการที่มีทันทีแล้วไปหน้าเลือกไพ่,
  // เสียเงิน → ส่งต่อไปหน้าชำระเงิน (mock)
  const confirmPurchase = () => {
    if (!buying) return;
    const product = buying;
    setBuying(null);
    if (product.access === "free") {
      const deckId = productDeckId(product);
      if (user) void addOwnedDeck(user.id, deckId);
      else addLocalOwnedDeck(deckId);
      onNavigate("/decks");
    } else {
      onNavigate(`/checkout/${product.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
            {t.shop.pageTitle}{" "}
          </h2>
          <p className="mt-1.5 text-mystic-muted">
            {t.shop.pageSubtitle}{" "}
          </p>
        </div>
        <UserActions onNavigate={onNavigate} />
      </header>

      {/* filter / search / sort bar */}
      <section
        aria-label={t.shop.searchFilterAriaLabel}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
          {filterChips.map((chip) => {
            const active = chip.id === filter;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                aria-pressed={active}
                className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#EADCFF] ${
                  active
                    ? "bg-gradient-to-r from-[#FF6AA9] to-[#F75FA2] text-white shadow-[0_8px_18px_rgba(247,95,162,0.25)]"
                    : "border border-[#EADFF7] bg-white text-[#3B3472] hover:bg-mystic-lavender/50"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex w-full gap-3 lg:w-auto">
          <label className="relative flex-1 lg:w-[300px] lg:flex-none">
            <span className="sr-only">{t.shop.searchAriaLabel}</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.shop.searchPlaceholder}
              className="h-12 w-full rounded-xl border border-[#EADFF7] bg-white px-4 pr-11 text-sm text-mystic-ink outline-none placeholder:text-mystic-muted focus:border-[#B89CFF]"
            />
            <Icon
              name="search"
              className="pointer-events-none absolute right-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8D82B3]"
            />
          </label>
          <label className="shrink-0">
            <span className="sr-only">{t.shop.sortAriaLabel}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-12 rounded-xl border border-[#EADFF7] bg-white px-4 text-sm font-bold text-[#3B3472] outline-none focus:border-[#B89CFF]"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* ---- main column ---- */}
        <div className="flex min-w-0 flex-col gap-6">
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[22px] border border-[#EFE6F8] bg-white py-16 text-center">
              <span className="text-3xl" aria-hidden="true">
                🛍️
              </span>
              <p className="font-semibold text-mystic-ink/75">
                {t.shop.emptyTitle}
              </p>
              <p className="text-sm text-mystic-muted">
                {t.shop.emptyBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
                className="mt-2 rounded-full border border-mystic-border-purple px-6 py-2 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
              >
                {t.shop.clearFiltersButton}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setBuying}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          {/* bottom premium banner */}
          <section
            aria-label={t.shop.premiumBannerAriaLabel}
            className="relative flex flex-col gap-4 overflow-hidden rounded-[22px] bg-gradient-to-r from-[#FFE2F1] via-[#F1E4FF] to-[#FFE9F4] px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src="/img/shop-gift.png"
                alt=""
                aria-hidden="true"
                className="w-16 shrink-0 mix-blend-multiply"
              />
              <div>
                <h3 className="text-lg font-extrabold text-mystic-ink-deep md:text-xl">
                  {t.shop.premiumBannerTitle}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#625B92]">
                  <span className="flex items-center gap-1.5">
                    <Icon name="bag" className="h-4 w-4" />
                    {t.shop.perkUnlockDecks}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="book" className="h-4 w-4" />
                    {t.shop.perkUnlimitedEbooks}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="sparkles" className="h-4 w-4" />
                    {t.shop.perkDiscounts}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="gift" className="h-4 w-4" />
                    {t.shop.perkMonthly}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("/premium")}
              className="relative z-10 self-start rounded-xl bg-[#FF5C9D] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(255,92,157,0.3)] transition hover:scale-[1.02] active:scale-95 lg:self-auto"
            >
              {t.shop.subscribePremiumButton}
            </button>
          </section>
        </div>

        {/* ---- right aside ---- */}
        <aside className="flex flex-col gap-5">
          {/* premium banner */}
          <section
            aria-label={t.shop.upgradePremiumAriaLabel}
            className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#FFE3F1] to-[#EADCFF] p-5"
          >
            <h3 className="text-lg font-extrabold text-[#FF4F99]">
              {t.shop.upgradePremiumTitle} <span aria-hidden="true">✨</span>
            </h3>
            <p className="mt-2 max-w-[150px] text-sm leading-6 text-[#4F4980]">
              {t.shop.upgradePremiumBody}
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/premium")}
              className="relative z-10 mt-4 rounded-xl bg-[#FF5C9D] px-5 py-2.5 text-sm font-bold text-white shadow-pastel transition hover:scale-[1.03] active:scale-95"
            >
              {t.shop.viewPerksButton}
            </button>
            <img
              src="/img/shop-premium-witch.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 w-32 mix-blend-multiply [mask-image:linear-gradient(to_left,black_70%,transparent),linear-gradient(to_top,black_70%,transparent)] [mask-composite:intersect]"
            />
          </section>

          {/* best sellers */}
          <section
            aria-label={t.shop.bestSellersTitle}
            className="rounded-[20px] border border-[#EFE6F8] bg-white p-4 shadow-[0_8px_22px_rgba(80,64,120,0.06)]"
          >
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 font-bold text-mystic-ink-deep">
                <span aria-hidden="true"></span> {t.shop.bestSellersTitle}
              </h4>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="text-xs font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
              >
                {t.shop.viewAll}
              </button>
            </div>
            <ul className="mt-3 flex flex-col divide-y divide-mystic-border/50">
              {bestSellers.map((item) => (
                <li key={item.rank}>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/shop/best/${item.rank}`)}
                    className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-mystic-pink-light/60"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        item.rank <= 2 ? "bg-[#FF6AA9]" : "bg-[#B89CFF]"
                      }`}
                      aria-hidden="true"
                    >
                      {item.rank}
                    </span>
                    <img
                      src={item.thumb}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-mystic-ink">
                        {item.title}
                      </span>
                      <span className="text-xs text-mystic-muted">
                        {item.category} ·{" "}
                        {item.price === 0 ? (
                          <span className="font-semibold text-emerald-500">
                            {t.shop.freeLabel}
                          </span>
                        ) : (
                          <>฿ {item.price}</>
                        )}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-amber-500">
                      ★ {item.rating}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* trust cards */}
          <section
            aria-label={t.shop.secureTitle}
            className="flex items-center gap-4 rounded-[20px] border border-[#EFE6F8] bg-white p-5"
          >
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-mystic-ink-deep">
                {t.shop.secureTitle}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-mystic-muted">
                {t.shop.secureBody}
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mystic-lavender text-mystic-purple">
              <Icon name="lock" className="h-6 w-6" />
            </span>
          </section>

          <section
            aria-label={t.shop.downloadTitle}
            className="flex items-center gap-4 rounded-[20px] border border-[#EFE6F8] bg-white p-5"
          >
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-mystic-ink-deep">
                {t.shop.downloadTitle}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-mystic-muted">
                {t.shop.downloadBody}
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDE7FF] text-[#8C5CF6]">
              <Icon name="download" className="h-6 w-6" />
            </span>
          </section>

          <section
            aria-label={t.shop.helpAriaLabel}
            className="relative overflow-hidden rounded-[20px] border border-[#EFE6F8] bg-white p-5"
          >
            <h4 className="font-bold text-mystic-ink-deep">
              {t.shop.helpTitle}
            </h4>
            <p className="mt-1.5 max-w-[180px] text-sm leading-relaxed text-mystic-muted">
              {t.shop.helpBody}
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/support")}
              className="relative z-10 mt-3 flex items-center gap-2 rounded-xl bg-mystic-lavender px-4 py-2.5 text-sm font-bold text-mystic-purple transition-colors hover:bg-mystic-border-purple/60"
            >
              <Icon name="chat" className="h-4 w-4" />
              {t.shop.contactAdminButton}
            </button>
            <img
              src="/img/shop-cat-support.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-1 w-20 mix-blend-multiply [mask-image:linear-gradient(to_top,black_75%,transparent)]"
            />
          </section>
        </aside>
      </div>

      {/* purchase confirm modal */}
      {buying && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.shop.confirmPurchaseAriaLabel.replace(
            "{title}",
            buying.title,
          )}
        >
          <button
            type="button"
            aria-label={t.shop.cancelAriaLabel}
            onClick={() => setBuying(null)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative w-full max-w-sm rounded-bubble-lg bg-white p-6 text-center shadow-pastel-lg">
            <h3 className="font-extrabold text-mystic-ink-deep">
              {t.shop.confirmPurchaseTitle} <span aria-hidden="true">🛍️</span>
            </h3>
            <img
              src={buying.image}
              alt={t.shop.deckCoverAlt.replace("{title}", buying.title)}
              className="mx-auto mt-4 aspect-[4/5] w-32 rounded-2xl object-cover shadow-pastel"
            />
            <h4 className="mt-3 font-bold text-mystic-ink-deep">
              {buying.title}
            </h4>
            <p className="mt-0.5 text-sm text-mystic-muted">
              {buying.kind} · {buying.countLabel}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#FBF7FF] py-3">
              <span className="text-sm text-mystic-muted">
                {t.shop.priceLabel}
              </span>
              {buying.access === "free" ? (
                <span className="text-2xl font-extrabold text-emerald-500">
                  {t.shop.freeLabel}
                </span>
              ) : (
                <span className="text-2xl font-extrabold text-mystic-purple">
                  ฿ {buying.price.toLocaleString("th-TH")}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={confirmPurchase}
                className={`rounded-full px-7 py-2.5 font-bold text-white shadow-pastel transition-transform hover:scale-105 active:scale-95 ${
                  buying.access === "free"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-gradient-to-r from-[#8B63EE] to-[#7B4BE8]"
                }`}
              >
                {buying.access === "free"
                  ? t.shop.claimFreeButton
                  : t.shop.goToPaymentButton}
              </button>
              <button
                type="button"
                onClick={() => setBuying(null)}
                className="rounded-full border border-mystic-border px-7 py-2.5 font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
              >
                {t.shop.cancelButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
