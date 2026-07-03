import { useEffect, useRef, useState } from "react";
import {
  myReadings,
  readingNotes,
  readingStats,
  type ReadingItem,
} from "../../data/myReadings";
import Icon from "../Icon";
import UserActions from "../UserActions";
import ReadingHistoryItem from "./ReadingHistoryItem";

type FilterId = "all" | "latest" | "Oracle" | "Tarot" | "favorite";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "latest", label: "ล่าสุด" },
  { id: "Oracle", label: "Oracle" },
  { id: "Tarot", label: "Tarot" },
  { id: "favorite", label: "🤍 รายการโปรด" },
];

interface MyReadingsPageProps {
  onNavigate: (path: string) => void;
}

export default function MyReadingsPage({ onNavigate }: MyReadingsPageProps) {
  const [items, setItems] = useState<ReadingItem[]>(myReadings);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(myReadings.filter((r) => r.isFavorite).map((r) => r.id)),
  );
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [noteFor, setNoteFor] = useState<ReadingItem | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const q = query.trim().toLowerCase();
  let visible = items.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.deckName.toLowerCase().includes(q) ||
      r.preview.toLowerCase().includes(q),
  );
  if (filter === "Oracle" || filter === "Tarot")
    visible = visible.filter((r) => r.deckType === filter);
  if (filter === "favorite")
    visible = visible.filter((r) => favorites.has(r.id));
  if (filter === "latest")
    visible = [...visible].sort((a, b) => b.sortKey - a.sortKey);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const loadMore = () => {
    // mock pagination: append another batch of the sample readings
    setItems((prev) => [
      ...prev,
      ...myReadings.map((r, i) => ({
        ...r,
        id: `${r.id}-p${prev.length + i}`,
        isFavorite: false,
        sortKey: r.sortKey - prev.length,
      })),
    ]);
  };

  const openNote = (item: ReadingItem) => {
    setNoteFor(item);
    setNoteDraft(notes[item.id] ?? "");
  };

  const saveNote = () => {
    if (!noteFor) return;
    setNotes((prev) => ({ ...prev, [noteFor.id]: noteDraft }));
    setNoteFor(null);
    showToast("บันทึกโน้ตแล้ว 💜");
  };

  const latest = myReadings[0];

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-mystic-ink-deep md:text-[28px]">
            การอ่านของฉัน <span aria-hidden="true">✨</span>
          </h2>
          <p className="mt-1.5 text-mystic-muted">
            ดูผลการอ่านที่ผ่านมาและบันทึกที่คุณเก็บไว้
          </p>
        </div>
        <UserActions onNavigate={onNavigate} />
      </header>

      {/* summary stats */}
      <section
        aria-label="สรุปการอ่านของคุณ"
        className="grid grid-cols-2 gap-4 xl:grid-cols-4"
      >
        {readingStats.map((s) => (
          <article
            key={s.label}
            className={`flex items-center gap-4 rounded-[20px] border border-[#F3DFF0] bg-gradient-to-b ${s.bgClass} p-4 shadow-[0_10px_28px_rgba(137,94,179,0.06)] md:p-5`}
          >
            <img
              src={s.icon}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full md:h-16 md:w-16"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-mystic-ink/75">
                {s.label}
              </p>
              <p className={`text-2xl font-extrabold md:text-3xl ${s.valueClass}`}>
                {s.value}
                <span className="ml-1.5 text-sm font-semibold text-mystic-muted">
                  {s.unit}
                </span>
              </p>
              <p className="truncate text-xs text-mystic-muted">{s.caption}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---- main card ---- */}
        <section
          aria-label="ประวัติการอ่านของฉัน"
          className="flex flex-col gap-4 rounded-[24px] border border-[#F0DFF3] bg-white/90 p-4 shadow-[0_12px_32px_rgba(139,92,246,0.08)] md:p-5"
        >
          {/* search + filter chips */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative lg:w-72">
              <span className="sr-only">ค้นหาการอ่านของคุณ</span>
              <Icon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-mystic-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาการอ่านของคุณ..."
                className="h-[46px] w-full rounded-[14px] border border-[#EADCF4] bg-white pl-11 pr-4 text-[15px] text-mystic-ink placeholder:text-mystic-muted focus:border-mystic-purple focus:outline-none"
              />
            </label>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {filters.map((f) => {
                const active = f.id === filter;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-[0_8px_18px_rgba(139,92,246,0.22)]"
                        : "bg-[#F7F0FF] text-[#5D4A89] hover:bg-mystic-lavender"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 className="font-bold text-mystic-ink-deep">
            ประวัติการอ่านของฉัน
          </h3>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <span className="text-3xl" aria-hidden="true">
                🔮
              </span>
              <p className="font-semibold text-mystic-ink/75">
                ยังไม่พบการอ่านที่ตรงกับคำค้นหา
              </p>
              <p className="text-sm text-mystic-muted">
                ลองเปลี่ยนคำค้นหรือเลือกตัวกรองอื่นดูนะ ✨
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {visible.map((item) => (
                <li key={item.id}>
                  <ReadingHistoryItem
                    item={item}
                    isFavorite={favorites.has(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    onView={() => onNavigate(`/my-readings/${item.id}`)}
                    onNote={() => openNote(item)}
                    onShare={() => showToast("คัดลอกลิงก์แชร์แล้ว 🔗")}
                    onDownload={() => showToast("กำลังบันทึกเป็นรูปภาพ... 🖼️")}
                    onDelete={() => {
                      setItems((prev) =>
                        prev.filter((r) => r.id !== item.id),
                      );
                      showToast("ลบรายการแล้ว 🗑️");
                    }}
                  />
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={loadMore}
            className="mx-auto rounded-full border border-mystic-border-purple bg-white px-8 py-2.5 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
          >
            โหลดเพิ่มเติม ↓
          </button>

          {/* pastel banner */}
          <div className="relative flex min-h-[96px] flex-col justify-center gap-2 overflow-hidden rounded-[18px] border border-[#F5D9EF] bg-[linear-gradient(135deg,#FFF1FA_0%,#EEE3FF_50%,#FFEEF7_100%)] px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="relative z-10 font-bold leading-relaxed text-mystic-ink-deep">
              ให้ไพ่และบันทึกของคุณ
              <br />
              เป็นเพื่อนร่วมทางของหัวใจ <span aria-hidden="true">💜</span>
            </p>
            <img
              src="/img/banner-witch.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 hidden w-32 -translate-x-1/2 mix-blend-multiply [mask-image:linear-gradient(to_top,black_65%,transparent_96%),linear-gradient(to_right,transparent_2%,black_18%,black_82%,transparent_98%)] [mask-composite:intersect] md:block"
            />
            <p className="relative z-10 text-sm text-mystic-ink/70">
              ทุกคำตอบ อยู่ในใจคุณเสมอ <span aria-hidden="true">✨</span>
            </p>
          </div>
        </section>

        {/* ---- right panel ---- */}
        <aside className="flex flex-col gap-5">
          <section
            aria-label="อ่านล่าสุด"
            className="rounded-[20px] border border-[#F1DDF2] bg-white p-4 shadow-[0_8px_22px_rgba(80,64,120,0.06)]"
          >
            <h4 className="font-bold text-mystic-ink-deep">อ่านล่าสุด</h4>
            <img
              src="/img/latest-reading.png"
              alt={`ภาพการอ่านล่าสุดจาก ${latest.deckName}`}
              className="mt-3 aspect-video w-full rounded-2xl object-cover"
            />
            <h5 className="mt-3 font-bold leading-snug text-mystic-ink-deep">
              {latest.title}
            </h5>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-mystic-muted">
              <Icon name="calendar" className="h-3.5 w-3.5" />
              {latest.date} • {latest.time} •
              <Icon name="cards" className="h-3.5 w-3.5" />
              {latest.cardCount} ใบ
            </p>
            <button
              type="button"
              onClick={() => onNavigate(`/my-readings/${latest.id}`)}
              className="mt-3 w-full rounded-xl border-t border-mystic-border/60 pt-3 text-center text-sm font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
            >
              ดูผลการอ่านล่าสุด →
            </button>
          </section>

          <section
            aria-label="บันทึกของฉัน"
            className="rounded-[20px] border border-[#F1DDF2] bg-white p-4 shadow-[0_8px_22px_rgba(80,64,120,0.06)]"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-mystic-ink-deep">บันทึกของฉัน</h4>
              <button
                type="button"
                onClick={() => onNavigate("/notes")}
                className="text-xs font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
              >
                ดูทั้งหมด
              </button>
            </div>

            <ul className="mt-3 flex flex-col gap-3">
              {readingNotes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-start gap-3 rounded-2xl border border-[#F0E2F5] bg-[#FBF7FF] p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-mystic-ink/85">
                      {note.quote}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-mystic-muted">
                      {note.date}
                      <span className="flex items-center gap-1 text-mystic-purple">
                        <Icon name="moon" className="h-3 w-3" />
                        {note.deckName}
                      </span>
                    </p>
                  </div>
                  <img
                    src={note.thumb}
                    alt=""
                    className="h-11 w-9 shrink-0 rounded-lg object-cover shadow-pastel"
                  />
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onNavigate("/notes")}
              className="mt-3 w-full rounded-xl border-t border-mystic-border/60 pt-3 text-center text-sm font-semibold text-mystic-purple transition-colors hover:text-mystic-pink"
            >
              ดูบันทึกทั้งหมด →
            </button>
          </section>
        </aside>
      </div>

      {/* note modal */}
      {noteFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`บันทึกโน้ตสำหรับ ${noteFor.title}`}
        >
          <button
            type="button"
            aria-label="ปิดหน้าต่างโน้ต"
            onClick={() => setNoteFor(null)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative w-full max-w-md rounded-bubble-lg bg-white p-6 shadow-pastel-lg">
            <h3 className="font-extrabold text-mystic-ink-deep">
              บันทึกโน้ต <span aria-hidden="true">📖</span>
            </h3>
            <p className="mt-1 truncate text-sm text-mystic-muted">
              {noteFor.title}
            </p>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={5}
              autoFocus
              placeholder="เขียนความรู้สึกหรือสิ่งที่ไพ่บอกคุณ..."
              className="mt-4 w-full resize-none rounded-2xl border border-[#EADCF4] bg-[#FFFBFE] p-4 text-[15px] text-mystic-ink placeholder:text-mystic-muted focus:border-mystic-purple focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNoteFor(null)}
                className="rounded-full border border-mystic-border px-6 py-2.5 text-sm font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={saveNote}
                className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] px-7 py-2.5 text-sm font-bold text-white shadow-pastel transition-transform hover:scale-105"
              >
                บันทึก ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
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
