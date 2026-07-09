import { useState } from "react";
import { useNavigate } from "react-router";
import { productDeckId, type Product } from "../../data/shopProducts";
import { addLocalOwnedDeck } from "../../data/ownedDeckStore";
import { useAuth } from "../../auth/AuthContext";
import { addOwnedDeck } from "../../lib/db";
import Icon, { type IconName } from "../Icon";
import UserActions from "../UserActions";

interface CheckoutPageProps {
  product?: Product;
  onNavigate: (path: string) => void;
}

const payMethods: { id: string; label: string; icon: IconName }[] = [
  { id: "card", label: "บัตรเครดิต / เดบิต", icon: "cart" },
  { id: "promptpay", label: "พร้อมเพย์ / QR", icon: "sparkles" },
  { id: "wallet", label: "TrueMoney Wallet", icon: "coins" },
];

export default function CheckoutPage({
  product,
  onNavigate,
}: CheckoutPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");
  const [paying, setPaying] = useState(false);

  // ไม่มีสินค้าค้างอยู่ (เข้าหน้านี้ตรง ๆ) — พากลับร้านค้า
  if (!product) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#EFE6F8] bg-white px-6 py-16 text-center">
          <span className="text-4xl" aria-hidden="true">
            🛒
          </span>
          <h3 className="text-lg font-bold text-mystic-ink-deep">
            ไม่พบรายการที่ต้องชำระเงิน
          </h3>
          <button
            type="button"
            onClick={() => onNavigate("/shop")}
            className="rounded-full bg-gradient-to-r from-[#FF6FAE] to-[#F75FA2] px-7 py-2.5 font-bold text-white shadow-pastel transition hover:scale-[1.03] active:scale-95"
          >
            กลับไปร้านค้า
          </button>
        </div>
      </div>
    );
  }

  const total = product.price;

  const pay = () => {
    // mock: จำลองการชำระเงินสั้น ๆ แล้วเพิ่ม deck เข้ารายการที่มี
    setPaying(true);
    window.setTimeout(() => {
      const deckId = productDeckId(product);
      if (user) void addOwnedDeck(user.id, deckId);
      else addLocalOwnedDeck(deckId);
      // path นี้ valid เสมอ ไม่ต้องผ่าน toast-guard; ใช้ replace กัน Back
      // กลับมาหน้าจ่ายเงินที่ซื้อไปแล้ว
      navigate("/decks", { replace: true });
    }, 1100);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("/shop")}
            className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            กลับไปร้านค้า
          </button>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
            ชำระเงิน <span aria-hidden="true">💳</span>
          </h2>
          <p className="mt-1.5 text-mystic-muted">
            ตรวจสอบรายการและเลือกวิธีชำระเงินของคุณ
          </p>
        </div>
        <UserActions onNavigate={onNavigate} />
      </header>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ---- payment methods ---- */}
        <section
          aria-label="วิธีชำระเงิน"
          className="flex flex-col gap-4 rounded-[24px] border border-[#EFE6F8] bg-white p-6"
        >
          <h3 className="font-bold text-mystic-ink-deep">เลือกวิธีชำระเงิน</h3>
          <div className="flex flex-col gap-3" role="radiogroup">
            {payMethods.map((m) => {
              const active = m.id === method;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-mystic-purple bg-mystic-lavender/50 shadow-pastel"
                      : "border-mystic-border hover:bg-mystic-lavender/30"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      active
                        ? "bg-mystic-purple text-white"
                        : "bg-mystic-lavender text-mystic-purple"
                    }`}
                  >
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <span className="flex-1 font-semibold text-mystic-ink-deep">
                    {m.label}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      active
                        ? "border-mystic-purple bg-mystic-purple text-white"
                        : "border-mystic-border"
                    }`}
                    aria-hidden="true"
                  >
                    {active && <span className="text-[10px]">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-1 flex items-center gap-2 text-xs text-mystic-muted">
            <Icon name="shield-check" className="h-4 w-4" />
            นี่เป็นหน้าชำระเงินตัวอย่าง (mock) — ยังไม่มีการเรียกเก็บเงินจริง
          </p>
        </section>

        {/* ---- order summary ---- */}
        <aside className="flex flex-col gap-4 rounded-[24px] border border-[#EFE6F8] bg-white p-6 lg:sticky lg:top-6">
          <h3 className="font-bold text-mystic-ink-deep">สรุปคำสั่งซื้อ</h3>
          <div className="flex gap-4">
            <img
              src={product.image}
              alt={`ปกไพ่ ${product.title}`}
              className="w-24 shrink-0 rounded-xl object-cover shadow-pastel"
            />
            <div className="min-w-0">
              <h4 className="font-bold leading-snug text-mystic-ink-deep">
                {product.title}
              </h4>
              <p className="mt-1 text-xs text-mystic-muted">
                {product.kind} · {product.countLabel}
              </p>
            </div>
          </div>

          <dl className="flex flex-col gap-2 border-t border-mystic-border/60 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-mystic-muted">ราคา Deck</dt>
              <dd className="font-medium text-mystic-ink-deep">
                ฿ {product.price.toLocaleString("th-TH")}
              </dd>
            </div>
            <div className="flex justify-between border-t border-mystic-border/60 pt-2">
              <dt className="font-bold text-mystic-ink-deep">รวมทั้งสิ้น</dt>
              <dd className="text-lg font-extrabold text-mystic-purple">
                ฿ {total.toLocaleString("th-TH")}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={pay}
            disabled={paying}
            aria-busy={paying}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#7B4BE8] to-[#9B6DFF] font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
          >
            {paying && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {paying
              ? "กำลังชำระเงิน..."
              : `ชำระเงิน ฿ ${total.toLocaleString("th-TH")}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-mystic-muted">
            <Icon name="lock" className="h-4 w-4" />
            ชำระเงินปลอดภัย 100%
          </p>
        </aside>
      </div>
    </div>
  );
}
