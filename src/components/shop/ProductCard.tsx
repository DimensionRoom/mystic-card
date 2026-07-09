import type { Product } from "../../data/shopProducts";

interface ProductCardProps {
  product: Product;
  /** เปิด modal ยืนยันการซื้อ/รับ deck */
  onSelect: (product: Product) => void;
  onNavigate: (path: string) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onNavigate,
}: ProductCardProps) {
  const deckPath = product.link ?? `/shop/deck/${product.id}`;
  const isFree = product.access === "free";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-[#EFE6F8] bg-white shadow-[0_12px_28px_rgba(106,76,180,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(106,76,180,0.12)]">
      <div className="relative aspect-square overflow-hidden bg-[#F6EDFF]">
        {product.badge && (
          <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-[#FF5E9F] px-3 py-1 text-xs font-bold text-white">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 text-center">
        <h3 className="line-clamp-2 min-h-[38px] text-sm font-bold leading-snug text-mystic-ink-deep">
          {product.title}
        </h3>

        <span className="mx-auto mt-1.5 rounded-full bg-[#F5EDFF] px-2.5 py-0.5 text-[11px] font-bold text-[#7B4DE3]">
          {product.kind}
        </span>

        <p className="mt-1.5 text-xs text-mystic-muted">{product.countLabel}</p>

        {/* ปุ่มหลัก: ฟรี → "ฟรี" (เขียว), เสียเงิน → แสดงราคา */}
        <button
          type="button"
          onClick={() => onSelect(product)}
          aria-label={
            isFree
              ? `รับฟรี ${product.title}`
              : `ซื้อ ${product.title} ราคา ${product.price} บาท`
          }
          className={`mt-2.5 min-h-10 w-full rounded-full text-sm font-bold transition-all active:scale-95 ${
            isFree
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-mystic-pink-soft text-mystic-pink hover:bg-mystic-pink hover:text-white"
          }`}
        >
          {isFree ? "ฟรี" : `฿ ${product.price.toLocaleString("th-TH")}`}
        </button>
        {product.ebook && (
          <button
            type="button"
            onClick={() => onNavigate(`${deckPath}/ebook`)}
            aria-label={`ซื้อ E-book ของไพ่ ${product.title} ราคา ${product.ebook.price} บาท`}
            className="mt-1.5 min-h-10 w-full rounded-full border border-mystic-border-purple bg-white text-sm font-semibold text-mystic-purple transition-all hover:bg-mystic-lavender active:scale-95"
          >
            E-book · ฿{product.ebook.price}
          </button>
        )}
      </div>
    </article>
  );
}
