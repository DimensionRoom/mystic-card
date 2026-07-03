import { useEffect, useRef, useState } from "react";
import {
  oracleCards,
  TOTAL_DECK_CARDS,
  type OracleCardMeaning,
} from "../../data/oracleCards";
import Icon, { type IconName } from "../Icon";
import OracleCardImage from "./OracleCardImage";

const categories: {
  key: keyof Pick<OracleCardMeaning, "love" | "work" | "finance" | "advice">;
  title: string;
  icon: IconName;
  iconClass: string;
  titleClass: string;
}[] = [
  {
    key: "love",
    title: "ความรัก",
    icon: "heart",
    iconClass: "bg-emerald-50 text-emerald-500",
    titleClass: "text-emerald-500",
  },
  {
    key: "work",
    title: "การงาน",
    icon: "briefcase",
    iconClass: "bg-sky-50 text-sky-500",
    titleClass: "text-sky-500",
  },
  {
    key: "finance",
    title: "การเงิน",
    icon: "coins",
    iconClass: "bg-mystic-lavender text-mystic-purple",
    titleClass: "text-mystic-purple",
  },
  {
    key: "advice",
    title: "คำแนะนำ",
    icon: "sparkles",
    iconClass: "bg-amber-50 text-amber-500",
    titleClass: "text-amber-500",
  },
];

export default function CardMeaningTab() {
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const selected = oracleCards.find((c) => c.id === selectedId)!;
  const isFavorite = favorites.has(selectedId);

  const q = query.trim().toLowerCase();
  const filtered = oracleCards.filter(
    (c) =>
      c.title.toLowerCase().includes(q) || c.thaiTitle.toLowerCase().includes(q),
  );

  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(selectedId)) next.delete(selectedId);
      else next.add(selectedId);
      return next;
    });
    if (!isFavorite) {
      setToast("บันทึกไพ่ไว้ในรายการโปรดแล้ว 💗");
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <div className="rounded-bubble-lg border border-[#F0E7F7] bg-white lg:grid lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:divide-x lg:divide-[#F0E7F7]">
      {/* ---- Left: search + card list ---- */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">ค้นหาไพ่</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-mystic-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาไพ่..."
              className="h-12 w-full rounded-2xl border border-mystic-border-purple/70 bg-white pl-11 pr-4 text-[15px] text-mystic-ink placeholder:text-mystic-muted focus:border-mystic-purple focus:outline-none"
            />
          </label>
          <button
            type="button"
            aria-label="ตัวกรองการค้นหา"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-mystic-border-purple/70 bg-white text-mystic-ink/70 transition-colors hover:bg-mystic-lavender"
          >
            <Icon name="sliders" className="h-5 w-5" />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <span className="text-3xl" aria-hidden="true">
              🔍
            </span>
            <p className="text-mystic-muted">ไม่พบไพ่ที่ค้นหา</p>
          </div>
        ) : (
          <ul className="no-scrollbar flex flex-col gap-1.5 lg:max-h-[760px] lg:overflow-y-auto">
            {filtered.map((card) => {
              const active = card.id === selectedId;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(card.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-all ${
                      active
                        ? "border-mystic-border-purple bg-gradient-to-r from-[#F4ECFF] to-[#FFF5FB] shadow-pastel"
                        : "border-transparent hover:bg-mystic-pink-light"
                    }`}
                  >
                    <img
                      src={card.thumb}
                      alt=""
                      className="h-[68px] w-[52px] shrink-0 rounded-lg border border-white object-cover shadow-pastel"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-mystic-ink">
                        {card.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-sm text-mystic-muted">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-mystic-purple/50"
                          aria-hidden="true"
                        />
                        {card.thaiTitle}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-auto h-[46px] w-full rounded-[14px] border border-mystic-border-purple bg-mystic-lavender/60 font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender"
        >
          ดูความหมายทั้งหมด ({TOTAL_DECK_CARDS} ใบ)
        </button>
      </div>

      {/* ---- Right: meaning detail ---- */}
      <article className="flex flex-col gap-5 p-5 md:p-7" aria-live="polite">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
          <OracleCardImage
            src={selected.image}
            alt={`ภาพไพ่ ${selected.title}`}
            className="mx-auto aspect-[22/31] w-[190px] shrink-0 sm:mx-0 md:w-[220px]"
          />
          <div className="min-w-0">
            <h3 className="text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
              <span className="mr-1 text-base text-mystic-pink" aria-hidden="true">
                ✦
              </span>
              {selected.title}
            </h3>
            <p className="mt-1 text-lg text-mystic-purple">
              {selected.thaiTitle}
            </p>
            <span className="mt-3 inline-block rounded-full bg-mystic-lavender px-4 py-1 text-sm font-semibold text-mystic-purple">
              {selected.keyword}
            </span>
            <p className="mt-4 leading-relaxed text-mystic-ink/80">
              {selected.meaning}
            </p>
          </div>
        </div>

        {/* overall meaning */}
        <section
          aria-label="ความหมายโดยรวม"
          className="rounded-[18px] border border-mystic-border bg-[#FFF9FC] p-6"
        >
          <h4 className="flex items-center gap-2 font-bold text-mystic-ink-deep">
            <Icon name="heart" className="h-[18px] w-[18px] text-mystic-pink" />
            ความหมายโดยรวม
          </h4>
          <p className="mt-3 leading-relaxed text-mystic-ink/75">
            {selected.overall}
          </p>
        </section>

        {/* category cards */}
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => (
            <section
              key={cat.key}
              aria-label={cat.title}
              className="rounded-[18px] border border-[#F0E7F7] bg-white p-5 text-center shadow-[0_12px_32px_rgba(116,86,174,0.08)]"
            >
              <span
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${cat.iconClass}`}
              >
                <Icon name={cat.icon} className="h-5 w-5" />
              </span>
              <h5 className={`mt-3 font-bold ${cat.titleClass}`}>{cat.title}</h5>
              <p className="mt-2 text-sm leading-relaxed text-mystic-muted">
                {selected[cat.key]}
              </p>
            </section>
          ))}
        </div>

        {/* universe message */}
        <section
          aria-label="ข้อความจากจักรวาล"
          className="flex items-center gap-4 rounded-[20px] border border-mystic-border-purple/70 bg-gradient-to-r from-[#FFF7FB] to-[#F5ECFF] p-6"
        >
          <div className="min-w-0 flex-1">
            <h4 className="flex items-center gap-2 font-bold text-mystic-purple">
              <Icon name="moon" className="h-[18px] w-[18px]" />
              ข้อความจากจักรวาล
            </h4>
            <blockquote className="mt-3 leading-relaxed text-mystic-ink/80">
              “{selected.universeMessage}”
            </blockquote>
          </div>
          <img
            src="/img/crystal-ball.png"
            alt=""
            aria-hidden="true"
            className="animate-float-slow w-24 shrink-0 mix-blend-multiply md:w-28"
          />
        </section>

        {/* favorite */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-pressed={isFavorite}
          className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border font-semibold transition-colors ${
            isFavorite
              ? "border-mystic-pink bg-mystic-pink-soft text-mystic-pink"
              : "border-mystic-border-purple text-mystic-ink/75 hover:bg-mystic-lavender/60"
          }`}
        >
          {isFavorite ? (
            <span aria-hidden="true">💗</span>
          ) : (
            <Icon name="heart" className="h-5 w-5" />
          )}
          {isFavorite ? "เพิ่มในรายการโปรดแล้ว" : "เพิ่มในรายการโปรด"}
        </button>
      </article>

      {/* all-cards modal */}
      {showAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`ความหมายไพ่ทั้งหมด ${TOTAL_DECK_CARDS} ใบ`}
        >
          <button
            type="button"
            aria-label="ปิดรายการไพ่"
            onClick={() => setShowAll(false)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-bubble-lg bg-white p-6 shadow-pastel-lg md:p-8">
            <h3 className="text-center text-lg font-extrabold text-mystic-ink-deep">
              ความหมายไพ่ทั้งหมด {TOTAL_DECK_CARDS} ใบ
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: TOTAL_DECK_CARDS }, (_, i) => {
                const card = oracleCards[i];
                if (card) {
                  return (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(card.id);
                          setShowAll(false);
                        }}
                        className="flex w-full flex-col items-center gap-2 rounded-2xl border border-mystic-border/60 p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-pastel"
                      >
                        <img
                          src={card.thumb}
                          alt=""
                          className="h-16 w-12 rounded-lg object-cover"
                        />
                        <span className="text-xs font-semibold leading-tight text-mystic-ink">
                          {card.title}
                        </span>
                      </button>
                    </li>
                  );
                }
                return (
                  <li
                    key={`locked-${i}`}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-mystic-border p-3 text-center"
                  >
                    <span className="flex h-16 w-12 items-center justify-center rounded-lg bg-mystic-lavender/50 text-lg text-mystic-purple/60">
                      ?
                    </span>
                    <span className="text-xs leading-tight text-mystic-muted">
                      ใบที่ {i + 1} · อ่านใน E-book 📖
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="rounded-full border border-mystic-border px-8 py-2.5 font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* favorite toast */}
      {toast && (
        <div
          role="status"
          className="animate-toast-in fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-mystic-ink px-5 py-2.5 text-sm font-semibold text-white shadow-pastel-lg md:bottom-8"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
