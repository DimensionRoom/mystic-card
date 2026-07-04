import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  myReadings,
  readingNotes,
  type ReadingItem,
} from "../../data/myReadings";
import { decks } from "../../data/decks";
import { useAuth } from "../../auth/AuthContext";
import {
  deleteReading,
  fetchNotes,
  fetchReadings,
  formatThaiDateTime,
  saveNote,
  setReadingFavorite,
} from "../../lib/db";
import Icon from "../Icon";
import UserActions from "../UserActions";
import ReadingHistoryItem from "./ReadingHistoryItem";

/** ภาพปกที่ใช้แสดงในรายการ อิงจาก deck_id ที่บันทึกไว้ */
const readingCovers: Record<string, string> = {
  moonlight: "/img/deck-cover.png",
  "dreamy-unicorn": "/img/cover-unicorn.png",
  "magic-cat": "/img/cover-magic-cat.png",
};

function coverFor(deckId: string): string {
  return (
    readingCovers[deckId] ??
    decks.find((d) => d.id === deckId)?.image ??
    "/img/deck-moon.png"
  );
}

function thumbForDeckName(deckName: string): string {
  return (
    decks.find((d) => deckName.includes(d.name.split(" ")[0]))?.image ??
    "/img/deck-moon.png"
  );
}

/** true เมื่อ epoch ms ทั้งสองตกอยู่ในเดือน/ปีปฏิทินเดียวกัน */
function isSameMonth(epochMs: number, reference: Date): boolean {
  const d = new Date(epochMs);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth()
  );
}

/** ค่าคงที่เฉพาะหน้าตา (ไอคอน/สี) ส่วนตัวเลขคำนวณจากข้อมูลจริงเสมอ ไม่ hardcode */
const statMeta = [
  {
    key: "total" as const,
    label: "อ่านทั้งหมด",
    unit: "ครั้ง",
    icon: "/img/stat-book.png",
    valueClass: "text-mystic-purple",
    bgClass: "from-white to-[#FBF7FF]",
  },
  {
    key: "thisMonth" as const,
    label: "อ่านเดือนนี้",
    unit: "ครั้ง",
    icon: "/img/stat-calendar.png",
    valueClass: "text-mystic-pink-deep",
    bgClass: "from-white to-[#FFF5FA]",
  },
  {
    key: "favorites" as const,
    label: "รายการโปรด",
    unit: "รายการ",
    icon: "/img/stat-heart.png",
    valueClass: "text-mystic-pink-deep",
    bgClass: "from-white to-[#FFF7F3]",
  },
  {
    key: "notes" as const,
    label: "บันทึกไว้",
    unit: "โน้ต",
    icon: "/img/stat-notebook.png",
    valueClass: "text-mystic-purple",
    bgClass: "from-white to-[#FBF7FF]",
  },
];

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
  const { isConfigured, user, signInWithGoogle } = useAuth();
  const [items, setItems] = useState<ReadingItem[]>(myReadings);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(myReadings.filter((r) => r.isFavorite).map((r) => r.id)),
  );
  const [sideNotes, setSideNotes] = useState(readingNotes);
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [noteFor, setNoteFor] = useState<ReadingItem | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // เมื่อล็อกอิน: โหลดประวัติการอ่านและโน้ตจริงจาก Supabase แทน mock
  const loadFromDb = useCallback(async (userId: string) => {
    const [rows, noteRows] = await Promise.all([
      fetchReadings(userId),
      fetchNotes(userId),
    ]);
    setItems(
      rows.map((r) => {
        const { date, time } = formatThaiDateTime(r.created_at);
        return {
          id: r.id,
          deckName: r.deck_name,
          deckType: (r.deck_type === "Tarot" ? "Tarot" : "Oracle") as
            | "Oracle"
            | "Tarot",
          cover: coverFor(r.deck_id),
          title: r.title,
          date,
          time,
          cardCount: r.card_count,
          preview: r.preview,
          isFavorite: r.is_favorite,
          sortKey: Date.parse(r.created_at),
        };
      }),
    );
    setFavorites(
      new Set(rows.filter((r) => r.is_favorite).map((r) => r.id)),
    );
    setSideNotes(
      noteRows.map((n) => ({
        id: n.id,
        quote: `“${n.content}”`,
        date: formatThaiDateTime(n.created_at).date,
        deckName: n.deck_name,
        thumb: thumbForDeckName(n.deck_name),
      })),
    );
  }, []);

  useEffect(() => {
    if (user) void loadFromDb(user.id);
    else {
      setItems(myReadings);
      setFavorites(
        new Set(myReadings.filter((r) => r.isFavorite).map((r) => r.id)),
      );
      setSideNotes(readingNotes);
    }
  }, [user, loadFromDb]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  // ตัวเลขสรุปทั้ง 4 การ์ด คำนวณจาก items/favorites/sideNotes ที่แสดงอยู่จริง
  // ไม่ใช่ค่า mock ตายตัว เพื่อให้ตรงกับสิ่งที่ผู้ใช้เห็นในหน้านี้เสมอ
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthCount = items.filter((r) =>
      isSameMonth(r.sortKey, now),
    ).length;
    const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthCount = items.filter((r) =>
      isSameMonth(r.sortKey, lastMonthRef),
    ).length;
    const diff = thisMonthCount - lastMonthCount;
    const monthCaption =
      diff > 0
        ? `↑ ${diff} จากเดือนที่แล้ว`
        : diff < 0
          ? `↓ ${Math.abs(diff)} จากเดือนที่แล้ว`
          : "เท่ากับเดือนที่แล้ว";

    const values: Record<(typeof statMeta)[number]["key"], string> = {
      total: String(items.length),
      thisMonth: String(thisMonthCount),
      favorites: String(favorites.size),
      notes: String(sideNotes.length),
    };
    const captions: Record<(typeof statMeta)[number]["key"], string> = {
      total: "ตั้งแต่เข้าร่วม",
      thisMonth: monthCaption,
      favorites: "ไพ่ที่คุณชื่นชอบ",
      notes: "ข้อความที่คุณเซฟไว้",
    };

    return statMeta.map((meta) => ({
      ...meta,
      value: values[meta.key],
      caption: captions[meta.key],
    }));
  }, [items, favorites, sideNotes]);

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
      const nowFavorite = !next.has(id);
      if (nowFavorite) next.add(id);
      else next.delete(id);
      if (user) void setReadingFavorite(id, nowFavorite);
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

  const submitNote = async () => {
    if (!noteFor) return;
    setNotes((prev) => ({ ...prev, [noteFor.id]: noteDraft }));
    if (user && noteDraft.trim()) {
      await saveNote(user.id, {
        readingId: noteFor.id,
        deckName: noteFor.deckName,
        content: noteDraft.trim(),
      });
      void loadFromDb(user.id);
    }
    setNoteFor(null);
    showToast("บันทึกโน้ตแล้ว 💜");
  };

  const latest = items[0] ?? myReadings[0];

  // ต้องล็อกอินก่อนถึงจะดูประวัติการอ่านจริงได้ — กันไว้ตรงนี้จุดเดียว
  // ครอบคลุมทุกทางที่จะมาถึงหน้านี้ (เมนู, ปุ่ม "ดูทั้งหมด" จากหน้าอื่น ๆ)
  if (isConfigured && !user) {
    return (
      <div className="flex flex-col gap-6">
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

        <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#F0DFF3] bg-white/90 px-6 py-16 text-center shadow-[0_12px_32px_rgba(139,92,246,0.08)]">
          <span className="text-4xl" aria-hidden="true">
            🔮
          </span>
          <h3 className="text-lg font-bold text-mystic-ink-deep">
            เข้าสู่ระบบเพื่อดูประวัติการอ่านของคุณ
          </h3>
          <p className="max-w-sm text-sm text-mystic-muted">
            ล็อกอินด้วย Google เพื่อบันทึกผลการอ่านไพ่ โน้ต และรายการโปรด
            ให้พร้อมกลับมาดูได้ทุกเมื่อ
          </p>
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="flex items-center gap-2.5 rounded-full border border-mystic-border-purple bg-white px-6 py-2.5 font-semibold text-mystic-ink shadow-pastel transition hover:scale-[1.03] hover:bg-mystic-lavender/40 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.6z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.1 0-5.8-2.1-6.8-5l-3.9 3C3.3 21.4 7.3 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.2 14.4A7.5 7.5 0 0 1 4.8 12c0-.8.2-1.6.4-2.4l-3.9-3A12 12 0 0 0 0 12c0 1.9.5 3.8 1.3 5.4l3.9-3z"
              />
              <path
                fill="#EA4335"
                d="M12 4.7c2.2 0 3.7 1 4.5 1.8l3.3-3.2C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.6l3.9 3c1-2.9 3.7-4.9 6.8-4.9z"
              />
            </svg>
            เข้าสู่ระบบด้วย Google
          </button>
        </div>
      </div>
    );
  }

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
        {stats.map((s) => (
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
                      if (user) void deleteReading(item.id);
                      showToast("ลบรายการแล้ว 🗑️");
                    }}
                  />
                </li>
              ))}
            </ul>
          )}

          {!user && (
            <button
              type="button"
              onClick={loadMore}
              className="mx-auto rounded-full border border-mystic-border-purple bg-white px-8 py-2.5 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
            >
              โหลดเพิ่มเติม ↓
            </button>
          )}

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
              {sideNotes.map((note) => (
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
                onClick={() => void submitNote()}
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
