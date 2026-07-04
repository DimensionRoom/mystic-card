import { useState } from "react";
import {
  bestSellers,
  shopProducts,
  type Product,
} from "../../data/shopProducts";
import Icon from "../Icon";
import UserActions from "../UserActions";
import ProductCard from "./ProductCard";

const filterChips = ["ทั้งหมด", "Oracle", "Tarot"] as const;
type FilterChip = (typeof filterChips)[number];

const sortOptions = [
  "ล่าสุด",
  "ขายดี",
  "ราคาต่ำสุด",
  "ราคาสูงสุด",
  "คะแนนสูงสุด",
] as const;
type SortOption = (typeof sortOptions)[number];

function filterProducts(
  products: Product[],
  filter: FilterChip,
  search: string,
) {
  const query = search.trim().toLowerCase();
  return products.filter((product) => {
    const matchesFilter = filter === "ทั้งหมด" || product.kind === filter;
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
    case "ราคาต่ำสุด":
      return cloned.sort((a, b) => a.price - b.price);
    case "ราคาสูงสุด":
      return cloned.sort((a, b) => b.price - a.price);
    case "คะแนนสูงสุด":
      return cloned.sort((a, b) => b.rating - a.rating);
    case "ขายดี":
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
  const [filter, setFilter] = useState<FilterChip>("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("ล่าสุด");

  const products = sortProducts(
    filterProducts(shopProducts, filter, search),
    sort,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
            ร้านค้า <span aria-hidden="true">🛍️</span>{" "}
            <span aria-hidden="true">✨</span>
          </h2>
          <p className="mt-1.5 text-mystic-muted">
            เลือกซื้อ Deck และ E-book เพื่อเสริมพลังและเพิ่มแรงบันดาลใจให้กับคุณ{" "}
            <span aria-hidden="true">✨</span>
          </p>
        </div>
        <UserActions onNavigate={onNavigate} />
      </header>

      {/* filter / search / sort bar */}
      <section
        aria-label="ค้นหาและกรองสินค้า"
        className="flex flex-wrap items-center gap-3"
      >
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
          {filterChips.map((chip) => {
            const active = chip === filter;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setFilter(chip)}
                aria-pressed={active}
                className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#EADCFF] ${
                  active
                    ? "bg-gradient-to-r from-[#FF6AA9] to-[#F75FA2] text-white shadow-[0_8px_18px_rgba(247,95,162,0.25)]"
                    : "border border-[#EADFF7] bg-white text-[#3B3472] hover:bg-mystic-lavender/50"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex w-full gap-3 lg:w-auto">
          <label className="relative flex-1 lg:w-[300px] lg:flex-none">
            <span className="sr-only">ค้นหา Deck หรือ E-book</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา Deck หรือ E-book..."
              className="h-12 w-full rounded-xl border border-[#EADFF7] bg-white px-4 pr-11 text-sm text-mystic-ink outline-none placeholder:text-mystic-muted focus:border-[#B89CFF]"
            />
            <Icon
              name="search"
              className="pointer-events-none absolute right-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8D82B3]"
            />
          </label>
          <label className="shrink-0">
            <span className="sr-only">เรียงลำดับสินค้า</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-12 rounded-xl border border-[#EADFF7] bg-white px-4 text-sm font-bold text-[#3B3472] outline-none focus:border-[#B89CFF]"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
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
                ยังไม่พบสินค้าที่ตรงกับคำค้นหา
              </p>
              <p className="text-sm text-mystic-muted">
                ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะ ✨
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter("ทั้งหมด");
                  setSearch("");
                }}
                className="mt-2 rounded-full border border-mystic-border-purple px-6 py-2 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
              >
                ล้างตัวกรอง
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          {/* bottom premium banner */}
          <section
            aria-label="สมัครสมาชิก Premium"
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
                  เป็นสมาชิก Premium รับสิทธิพิเศษ!
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#625B92]">
                  <span className="flex items-center gap-1.5">
                    <Icon name="bag" className="h-4 w-4" />
                    ปลดล็อก Deck พิเศษมากมาย
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="book" className="h-4 w-4" />
                    อ่าน E-book ไม่จำกัด
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="sparkles" className="h-4 w-4" />
                    ลดพิเศษทุกการซื้อ
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="gift" className="h-4 w-4" />
                    สิทธิพิเศษรายเดือน
                  </span>
                </div>
              </div>
            </div>
            <img
              src="/img/shop-cat-banner.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-40 hidden w-20 mix-blend-multiply [mask-image:linear-gradient(to_top,black_70%,transparent)] xl:block"
            />
            <button
              type="button"
              onClick={() => onNavigate("/premium")}
              className="relative z-10 self-start rounded-xl bg-[#FF5C9D] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(255,92,157,0.3)] transition hover:scale-[1.02] active:scale-95 lg:self-auto"
            >
              สมัคร Premium 👑
            </button>
          </section>
        </div>

        {/* ---- right aside ---- */}
        <aside className="flex flex-col gap-5">
          {/* premium banner */}
          <section
            aria-label="อัปเกรด Premium"
            className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#FFE3F1] to-[#EADCFF] p-5"
          >
            <h3 className="text-lg font-extrabold text-[#FF4F99]">
              อัปเกรด Premium <span aria-hidden="true">✨</span>
            </h3>
            <p className="mt-2 max-w-[150px] text-sm leading-6 text-[#4F4980]">
              ปลดล็อก Deck และ E-book พิเศษอีกมากมาย!
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/premium")}
              className="relative z-10 mt-4 rounded-xl bg-[#FF5C9D] px-5 py-2.5 text-sm font-bold text-white shadow-pastel transition hover:scale-[1.03] active:scale-95"
            >
              ดูสิทธิพิเศษ
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
            aria-label="ขายดีประจำสัปดาห์"
            className="rounded-[20px] border border-[#EFE6F8] bg-white p-4 shadow-[0_8px_22px_rgba(80,64,120,0.06)]"
          >
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 font-bold text-mystic-ink-deep">
                <span aria-hidden="true">👑</span> ขายดีประจำสัปดาห์
              </h4>
              <button
                type="button"
                onClick={() => setFilter("ทั้งหมด")}
                className="text-xs font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
              >
                ดูทั้งหมด →
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
                        {item.category} · ฿ {item.price}
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
            aria-label="ซื้อสินค้าอย่างปลอดภัย"
            className="flex items-center gap-4 rounded-[20px] border border-[#EFE6F8] bg-white p-5"
          >
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-mystic-ink-deep">
                ซื้อสินค้าอย่างปลอดภัย
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-mystic-muted">
                การชำระเงินเข้ารหัส 100% เรารักษาข้อมูลของคุณเป็นความลับ
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mystic-lavender text-mystic-purple">
              <Icon name="lock" className="h-6 w-6" />
            </span>
          </section>

          <section
            aria-label="ดาวน์โหลดง่าย"
            className="flex items-center gap-4 rounded-[20px] border border-[#EFE6F8] bg-white p-5"
          >
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-mystic-ink-deep">ดาวน์โหลดง่าย</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-mystic-muted">
                E-book พร้อมดาวน์โหลดทันที อ่านได้ทุกอุปกรณ์
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDE7FF] text-[#8C5CF6]">
              <Icon name="download" className="h-6 w-6" />
            </span>
          </section>

          <section
            aria-label="ต้องการความช่วยเหลือ"
            className="relative overflow-hidden rounded-[20px] border border-[#EFE6F8] bg-white p-5"
          >
            <h4 className="font-bold text-mystic-ink-deep">
              ต้องการความช่วยเหลือ?
            </h4>
            <p className="mt-1.5 max-w-[180px] text-sm leading-relaxed text-mystic-muted">
              ติดต่อทีมงานของเราได้ทุกวัน 09:00 - 21:00 น.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/support")}
              className="relative z-10 mt-3 flex items-center gap-2 rounded-xl bg-mystic-lavender px-4 py-2.5 text-sm font-bold text-mystic-purple transition-colors hover:bg-mystic-border-purple/60"
            >
              <Icon name="chat" className="h-4 w-4" />
              ติดต่อแอดมิน
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
    </div>
  );
}
