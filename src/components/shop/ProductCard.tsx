import type { Product } from "../../data/shopProducts";

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const deckPath = product.link ?? `/shop/deck/${product.id}`;

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
        <p className="mt-1.5 font-extrabold text-[#4C3AB8]">
          ฿ {product.price.toLocaleString("th-TH")}
        </p>

        <button
          type="button"
          onClick={() => onNavigate(deckPath)}
          aria-label={`เลือกไพ่ ${product.title}`}
          className="mt-2.5 min-h-10 w-full rounded-full bg-mystic-pink-soft text-sm font-semibold text-mystic-pink transition-all hover:bg-mystic-pink hover:text-white active:scale-95"
        >
          เลือก
        </button>
        {product.ebook && (
          <button
            type="button"
            onClick={() => onNavigate(`${deckPath}/ebook`)}
            aria-label={`ซื้อ E-book ของไพ่ ${product.title} ราคา ${product.ebook.price} บาท`}
            className="mt-1.5 min-h-10 w-full rounded-full border border-mystic-border-purple bg-white text-sm font-semibold text-mystic-purple transition-all hover:bg-mystic-lavender active:scale-95"
          >
            📖 E-book · ฿{product.ebook.price}
          </button>
        )}
      </div>
    </article>
  );
}
