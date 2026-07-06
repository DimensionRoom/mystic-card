import { useState } from "react";
import type { Deck } from "../../data/decks";
import { getAboutInfo } from "../../data/aboutDeck";
import { getDeckCardSet } from "../../data/deckCards";
import type { DeckTab } from "../DeckTabs";
import Icon from "../Icon";
import CardFace from "./CardFace";

interface AboutDeckTabProps {
  deck: Deck;
  onNavigate: (path: string) => void;
  onSwitchTab: (tab: DeckTab) => void;
}

export default function AboutDeckTab({
  deck,
  onNavigate,
  onSwitchTab,
}: AboutDeckTabProps) {
  const info = getAboutInfo(deck);
  const previewCards = getDeckCardSet(deck.id).cards.slice(0, 2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* ---- Main column ---- */}
      <div className="flex min-w-0 flex-col gap-5">
        {/* Hero: cover + about text + features */}
        <section
          aria-label={`เกี่ยวกับ ${deck.name}`}
          className="rounded-[24px] border border-[#F0E2F5] bg-white p-6 md:p-7"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
            <div className="mx-auto w-[200px] md:mx-0 md:w-[220px]">
              <img
                src={info.cover}
                alt={`ปกไพ่ ${deck.name}`}
                className="w-full rounded-[18px] object-cover shadow-[0_18px_40px_rgba(118,74,190,0.22)]"
              />
              <button
                type="button"
                onClick={() => setIsFavorite((f) => !f)}
                aria-pressed={isFavorite}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold transition-colors ${
                  isFavorite
                    ? "border-mystic-pink bg-mystic-pink-soft text-mystic-pink"
                    : "border-mystic-border-purple text-mystic-ink/75 hover:bg-mystic-lavender/60"
                }`}
              >
                {isFavorite ? (
                  <span aria-hidden="true">💗</span>
                ) : (
                  <Icon name="heart" className="h-4 w-4" />
                )}
                {isFavorite ? "เพิ่มในรายการโปรดแล้ว" : "เพิ่มในรายการโปรด"}
              </button>
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-extrabold text-mystic-ink-deep">
                เกี่ยวกับ Deck
              </h3>
              <p className="mt-3 leading-[1.75] text-[#5D5A7A]">
                {info.description}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {info.features.map((f) => (
                  <div key={f.title} className="text-center">
                    <span
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${f.iconClass}`}
                    >
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <h4 className="mt-2.5 text-sm font-bold text-mystic-ink-deep">
                      {f.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-mystic-muted">
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Details + preview carousel */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <section
            aria-label="รายละเอียด Deck"
            className="rounded-[18px] border border-[#F1E5F4] bg-white p-6"
          >
            <dl className="flex flex-col gap-3.5 text-sm">
              {info.details.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[92px_1fr] gap-3">
                  <dt className="text-mystic-muted">{key}</dt>
                  <dd className="font-medium leading-snug text-mystic-ink-deep">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-label="ตัวอย่างไพ่ใน Deck"
            className="relative rounded-[18px] border border-[#F1E5F4] bg-white p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-bold text-mystic-ink-deep">
                ตัวอย่างไพ่ใน Deck
              </h4>
              <button
                type="button"
                onClick={() => onSwitchTab("meaning")}
                className="text-sm font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
              >
                ดูไพ่ทั้งหมด ({deck.cardCount} ใบ)
              </button>
            </div>

            <ul className="no-scrollbar mt-4 flex snap-x gap-3.5 overflow-x-auto md:grid md:grid-cols-5 md:overflow-visible">
              {info.previews.map((p) => (
                <li
                  key={p.name}
                  className="w-[96px] shrink-0 snap-start text-center md:w-auto"
                >
                  <CardFace
                    src={p.image}
                    fallback={deck.cardBack}
                    alt={`ไพ่ตัวอย่าง ${p.name}`}
                    className="aspect-[0.65] w-full rounded-[14px] object-cover shadow-[0_10px_22px_rgba(109,80,180,0.18)]"
                  />
                  <p className="mt-2 text-xs font-bold text-mystic-ink-deep">
                    {p.name}
                  </p>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onSwitchTab("meaning")}
              aria-label="ดูไพ่ใบอื่น ๆ"
              className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-mystic-border bg-white px-3 py-2 text-mystic-purple shadow-pastel-lg transition-transform hover:scale-110 md:block"
            >
              <span aria-hidden="true">›</span>
            </button>
          </section>
        </div>

        {/* Bottom CTA banner */}
        <section
          aria-label={`เริ่มอ่านไพ่กับ ${deck.name}`}
          className="relative flex flex-col gap-4 overflow-hidden rounded-[20px] bg-gradient-to-r from-[#E9DDF9] via-[#EFE3F8] to-[#E3D5F5] p-6 md:min-h-[120px] md:flex-row md:items-center md:justify-between md:pr-8"
        >
          <div className="relative z-10 max-w-sm">
            <h4 className="text-lg font-extrabold leading-snug text-mystic-ink-deep">
              เริ่มต้นการเดินทาง
              <br />
              ไปกับ {deck.name}
            </h4>
            <p className="mt-1.5 text-sm text-mystic-ink/65">
              ให้แสงจันทร์นำพาคุณไปพบคำตอบที่หัวใจกำลังตามหา{" "}
              <span aria-hidden="true">✨</span>
            </p>
          </div>
          <img
            src="/img/banner-witch.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-56 hidden w-40 mix-blend-multiply [mask-image:linear-gradient(to_top,black_65%,transparent_96%),linear-gradient(to_right,transparent_2%,black_18%,black_82%,transparent_98%)] [mask-composite:intersect] lg:block"
          />
          <button
            type="button"
            onClick={() => onSwitchTab("read")}
            className="relative z-10 self-start rounded-full bg-gradient-to-r from-[#8B63EE] to-[#7B4BE8] px-7 py-3 font-bold text-white shadow-pastel transition-transform hover:scale-105 active:scale-95 md:self-auto"
          >
            เริ่มอ่านไพ่เลย →
          </button>
        </section>
      </div>

      {/* ---- Right: E-book purchase panel ---- */}
      <aside
        aria-label="E-book ประจำ Deck"
        className="flex flex-col overflow-hidden rounded-[24px] border border-[#F0E2F5] bg-white xl:sticky xl:top-6"
      >
        <h4 className="flex items-center gap-2.5 border-b border-[#F0E2F5] bg-[#FBF7FF] px-5 py-4 font-bold text-mystic-purple">
          <Icon name="book" className="h-5 w-5" />
          E-book ประจำ Deck
        </h4>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex gap-4">
            <div className="relative shrink-0">
              <img
                src={info.ebook.cover}
                alt={`ปก E-book ${info.ebook.title}`}
                className="w-[120px] rounded-xl object-cover shadow-pastel"
              />
              <span className="absolute -right-2 -top-2 rounded-full bg-mystic-purple px-2.5 py-0.5 text-xs font-bold text-white shadow-pastel">
                E-book
              </span>
            </div>
            <div className="min-w-0">
              <h5 className="font-extrabold leading-snug text-mystic-ink-deep">
                {info.ebook.title}
              </h5>
              <p className="mt-1 text-xs text-mystic-purple">
                {info.ebook.subtitle}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-mystic-ink/75">
                {info.ebook.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-1.5">
                    <span className="text-mystic-purple" aria-hidden="true">
                      ✦
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* details box */}
          <div className="rounded-2xl border border-[#F0E2F5] bg-[#FBF7FF] p-4">
            <h6 className="text-sm font-bold text-mystic-ink-deep">
              รายละเอียด
            </h6>
            <dl className="mt-2.5 flex flex-col gap-2 text-sm">
              {(
                [
                  ["รูปแบบไฟล์", info.ebook.format],
                  ["จำนวนหน้า", info.ebook.pages],
                  ["ภาษา", info.ebook.language],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-mystic-muted">{k}</dt>
                  <dd className="font-medium text-mystic-ink-deep">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-mystic-border-purple bg-white py-2.5 text-sm font-semibold text-mystic-ink/75 transition-colors hover:bg-mystic-lavender/60"
            >
              <Icon name="book" className="h-4 w-4" />
              ดูตัวอย่างบางส่วน
            </button>
          </div>

          {/* price box */}
          <div className="rounded-2xl border border-[#F0E2F5] bg-[#FBF7FF] p-4 text-center">
            <p className="text-sm text-mystic-muted">ราคา</p>
            <p className="text-4xl font-extrabold text-mystic-purple">
              {info.ebook.price}
              <span className="ml-1.5 text-sm font-semibold text-mystic-muted">
                บาท
              </span>
            </p>
            <p className="mt-1 text-xs text-emerald-500">
              ✓ รับทันทีหลังชำระเงิน
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`/deck/${deck.id}/ebook`)}
            className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-r from-[#7B4BE8] to-[#9B6DFF] font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg active:scale-95"
          >
            <Icon name="cart" className="h-5 w-5" />
            ซื้อ E-book
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-mystic-muted">
            <Icon name="shield-check" className="h-4 w-4" />
            ชำระเงินปลอดภัย 100%
          </p>
        </div>
      </aside>

      {/* E-book preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`ตัวอย่าง ${info.ebook.title}`}
        >
          <button
            type="button"
            aria-label="ปิดตัวอย่าง E-book"
            onClick={() => setShowPreview(false)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-bubble-lg bg-white p-6 shadow-pastel-lg md:p-8">
            <h3 className="text-center text-lg font-extrabold text-mystic-ink-deep">
              ตัวอย่างจาก {info.ebook.title} <span aria-hidden="true">📖</span>
            </h3>
            <div className="mt-5 flex flex-col gap-4">
              {previewCards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-2xl border border-[#F0E2F5] bg-[#FBF7FF] p-5"
                >
                  <div className="flex items-center gap-3">
                    <CardFace
                      src={card.thumb}
                      fallback={deck.cardBack}
                      alt=""
                      className="h-14 w-11 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-mystic-ink-deep">
                        {card.title}
                      </h4>
                      <p className="text-xs text-mystic-purple">
                        {card.thaiTitle}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mystic-ink/75">
                    {card.meaning}
                  </p>
                </article>
              ))}
              <p className="text-center text-xs text-mystic-muted">
                ...และความหมายครบทั้ง {deck.cardCount} ใบ พร้อมเทคนิคการอ่าน
                รอคุณอยู่ในเล่มเต็ม
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => onNavigate(`/deck/${deck.id}/ebook`)}
                className="rounded-full bg-gradient-to-r from-[#7B4BE8] to-[#9B6DFF] px-7 py-2.5 font-bold text-white shadow-pastel transition-transform hover:scale-105"
              >
                ซื้อ E-book เลย 🛍️
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-full border border-mystic-border px-7 py-2.5 font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
