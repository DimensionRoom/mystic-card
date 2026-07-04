import { useEffect, useState } from "react";
import Icon from "../Icon";
import Toggle from "./Toggle";
import { useAuth } from "../../auth/AuthContext";

interface ViewProps {
  showToast: (msg: string) => void;
}

const inputClass =
  "h-12 w-full rounded-[14px] border border-[#EADFF7] bg-white px-4 text-[15px] text-mystic-ink outline-none placeholder:text-mystic-muted focus:border-[#B89CFF]";
const labelClass = "mb-1.5 block text-sm font-semibold text-mystic-ink-deep";
const saveButtonClass =
  "rounded-[14px] bg-gradient-to-r from-[#8B63EE] to-[#7B4BE8] px-8 py-3 text-sm font-bold text-white shadow-pastel transition hover:scale-[1.02] active:scale-95";

/* ---------- บัญชีผู้ใช้ ---------- */

export function ProfileSettings({ showToast }: ViewProps) {
  const { user, profile, displayName, avatarUrl, updateProfile } = useAuth();
  // เริ่มด้วยชื่อจริงจาก Google ทันที (ไม่ใช้ "น้องดาว" ค้างระหว่างรอ profile โหลด)
  const [name, setName] = useState(displayName);
  const [username, setUsername] = useState(
    () => user?.email?.split("@")[0] ?? "nongdao",
  );
  const [bio, setBio] = useState(() =>
    user ? "" : "สาวน้อยผู้หลงรักแสงจันทร์และเสียงกระซิบของไพ่ 🌙",
  );
  const [saving, setSaving] = useState(false);

  // เมื่อโหลดโปรไฟล์จาก Supabase เสร็จ ให้เติมค่าจริงลงฟอร์ม
  useEffect(() => {
    if (!profile) return;
    if (profile.display_name) setName(profile.display_name);
    if (profile.username) setUsername(profile.username);
    if (profile.bio) setBio(profile.bio);
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("บันทึกข้อมูลส่วนตัวแล้ว 💜");
      return;
    }
    setSaving(true);
    const ok = await updateProfile({
      display_name: name,
      username,
      bio,
    });
    setSaving(false);
    showToast(ok ? "บันทึกข้อมูลส่วนตัวแล้ว 💜" : "บันทึกไม่สำเร็จ ลองอีกครั้งนะ");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={`รูปโปรไฟล์ของ ${name}`}
          referrerPolicy="no-referrer"
          className="h-20 w-20 rounded-full object-cover shadow-pastel"
        />
        <button
          type="button"
          onClick={() => showToast("อัปโหลดรูปได้เมื่อเชื่อมต่อระบบจริง 📸")}
          className="rounded-full border border-mystic-border-purple px-5 py-2 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
        >
          เปลี่ยนรูปโปรไฟล์
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>ชื่อที่แสดง</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>ชื่อผู้ใช้</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label>
        <span className={labelClass}>แนะนำตัว</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-[14px] border border-[#EADFF7] bg-white p-4 text-[15px] text-mystic-ink outline-none focus:border-[#B89CFF]"
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className={`self-start disabled:opacity-60 ${saveButtonClass}`}
      >
        {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล ✨"}
      </button>
    </form>
  );
}

export function EmailSettings({ showToast }: ViewProps) {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-2xl border border-[#EADFF7] bg-[#FBF8FF] p-4">
        <div>
          <p className="text-sm font-semibold text-mystic-ink-deep">
            อีเมลปัจจุบัน
          </p>
          <p className="mt-0.5 break-all text-mystic-purple">
            {user?.email ?? "nongdao@mysticcard.app"}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-500">
          ✓ ยืนยันแล้ว
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newEmail.includes("@")) {
            showToast("กรุณากรอกอีเมลให้ถูกต้องนะ 💌");
            return;
          }
          setNewEmail("");
          showToast(`ส่งลิงก์ยืนยันไปที่ ${newEmail} แล้ว 💌`);
        }}
        className="flex flex-col gap-4"
      >
        <label>
          <span className={labelClass}>เปลี่ยนอีเมลใหม่</span>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="กรอกอีเมลใหม่ของคุณ..."
            className={inputClass}
          />
        </label>
        <button type="submit" className={`self-start ${saveButtonClass}`}>
          ส่งลิงก์ยืนยัน 💌
        </button>
      </form>

      <div className="flex items-center justify-between rounded-2xl border border-[#EADFF7] p-4">
        <div>
          <p className="text-sm font-semibold text-mystic-ink-deep">
            รับข่าวสารทางอีเมล
          </p>
          <p className="mt-0.5 text-xs text-mystic-muted">
            ไพ่ประจำสัปดาห์ โปรโมชั่น และ Deck ใหม่
          </p>
        </div>
        <Toggle
          checked={newsletter}
          onChange={(v) => {
            setNewsletter(v);
            showToast(v ? "เปิดรับข่าวสารแล้ว ✨" : "ปิดรับข่าวสารแล้ว");
          }}
          label="รับข่าวสารทางอีเมล"
        />
      </div>
    </div>
  );
}

export function PasswordSettings({ showToast }: ViewProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return setError("กรุณากรอกรหัสผ่านปัจจุบัน");
    if (next.length < 8) return setError("รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร");
    if (next !== confirm) return setError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
    setError(null);
    setCurrent("");
    setNext("");
    setConfirm("");
    showToast("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว 🔒");
  };

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <label>
        <span className={labelClass}>รหัสผ่านปัจจุบัน</span>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputClass}
        />
      </label>
      <label>
        <span className={labelClass}>รหัสผ่านใหม่</span>
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-mystic-muted">
          อย่างน้อย 8 ตัวอักษร
        </span>
      </label>
      <label>
        <span className={labelClass}>ยืนยันรหัสผ่านใหม่</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-[#FF6B6B]">
          {error}
        </p>
      )}

      <button type="submit" className={`self-start ${saveButtonClass}`}>
        เปลี่ยนรหัสผ่าน 🔒
      </button>
    </form>
  );
}

/* ---------- การตั้งค่าแอป ---------- */

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#EADFF7] p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-mystic-ink-deep">{title}</p>
        <p className="mt-0.5 text-xs text-mystic-muted">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export function NotificationSettings({ showToast }: ViewProps) {
  const [prefs, setPrefs] = useState({
    daily: true,
    universe: true,
    promo: false,
    weekly: true,
    sound: true,
  });

  const set = (key: keyof typeof prefs, label: string) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [key]: v }));
    showToast(v ? `เปิด${label}แล้ว 🔔` : `ปิด${label}แล้ว`);
  };

  return (
    <div className="flex flex-col gap-3">
      <ToggleRow
        title="ไพ่ประจำวัน"
        description="เตือนให้เปิดไพ่รับข้อความทุกเช้า"
        checked={prefs.daily}
        onChange={set("daily", "การเตือนไพ่ประจำวัน")}
      />
      <ToggleRow
        title="ข้อความจากจักรวาล"
        description="แจ้งเตือนเมื่อมีข้อความพิเศษถึงคุณ"
        checked={prefs.universe}
        onChange={set("universe", "ข้อความจากจักรวาล")}
      />
      <ToggleRow
        title="โปรโมชั่นร้านค้า"
        description="Deck และ E-book ลดราคา"
        checked={prefs.promo}
        onChange={set("promo", "โปรโมชั่นร้านค้า")}
      />
      <ToggleRow
        title="สรุปประจำสัปดาห์"
        description="สรุปการอ่านและบันทึกของคุณทุกสัปดาห์"
        checked={prefs.weekly}
        onChange={set("weekly", "สรุปประจำสัปดาห์")}
      />
      <ToggleRow
        title="เสียงแจ้งเตือน"
        description="เล่นเสียงเมื่อมีการแจ้งเตือน"
        checked={prefs.sound}
        onChange={set("sound", "เสียงแจ้งเตือน")}
      />
    </div>
  );
}

export function ReadingSettings({ showToast }: ViewProps) {
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState("กลาง");

  return (
    <div className="flex flex-col gap-3">
      <ToggleRow
        title="บันทึกผลการอ่านอัตโนมัติ"
        description="เก็บทุกการอ่านไว้ในประวัติโดยไม่ต้องกดบันทึก"
        checked={autoSave}
        onChange={(v) => {
          setAutoSave(v);
          showToast(v ? "เปิดบันทึกอัตโนมัติแล้ว ✨" : "ปิดบันทึกอัตโนมัติแล้ว");
        }}
      />

      <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#EADFF7] p-4">
        <span>
          <span className="block text-sm font-semibold text-mystic-ink-deep">
            ขนาดตัวอักษร
          </span>
          <span className="text-xs text-mystic-muted">
            ขนาดข้อความคำทำนาย
          </span>
        </span>
        <select
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            showToast(`ขนาดตัวอักษร: ${e.target.value}`);
          }}
          className="h-11 rounded-xl border border-[#EADFF7] bg-white px-3 text-sm font-semibold text-mystic-ink-deep outline-none focus:border-[#B89CFF]"
        >
          <option>เล็ก</option>
          <option>กลาง</option>
          <option>ใหญ่</option>
        </select>
      </label>
    </div>
  );
}

/* ---------- อื่นๆ ---------- */

const faqs = [
  {
    q: "เปิดไพ่ได้วันละกี่ครั้ง?",
    a: "สมาชิกทั่วไปเปิดไพ่ได้วันละ 3 ครั้ง ส่วนสมาชิก Premium เปิดได้ไม่จำกัด ทุกการอ่านจะถูกเก็บไว้ในหน้า “การอ่านของฉัน” ให้กลับมาดูได้เสมอ",
  },
  {
    q: "E-book ที่ซื้อแล้วอ่านได้ที่ไหน?",
    a: "เข้าได้จากปุ่ม E-book ในหน้า “เลือกไพ่” หรือหน้า “เกี่ยวกับ Deck” ของ deck นั้น ๆ ไฟล์เป็น PDF อ่านได้ทุกอุปกรณ์และดาวน์โหลดซ้ำได้ตลอด",
  },
  {
    q: "ผลการอ่านหายไป ทำยังไงดี?",
    a: "ตรวจสอบที่หน้า “การอ่านของฉัน” และลองใช้ตัวกรอง “ทั้งหมด” หากยังไม่พบ ให้ติดต่อแอดมินพร้อมแจ้งวันเวลาที่อ่าน เราช่วยกู้คืนให้ได้ภายใน 7 วัน",
  },
  {
    q: "ยกเลิกสมาชิก Premium ได้อย่างไร?",
    a: "ไปที่ การตั้งค่า → บัญชีผู้ใช้ หรือแจ้งแอดมินได้โดยตรง สิทธิ์จะยังใช้ได้จนถึงวันสิ้นสุดรอบบิลปัจจุบัน โดยไม่มีการเรียกเก็บเพิ่ม",
  },
  {
    q: "คำทำนายใช้แทนคำแนะนำผู้เชี่ยวชาญได้ไหม?",
    a: "ไพ่ของเราออกแบบเพื่อการปลอบประโลมใจและสร้างแรงบันดาลใจ ไม่สามารถใช้แทนคำแนะนำด้านการแพทย์ กฎหมาย หรือการเงินจากผู้เชี่ยวชาญได้นะ",
  },
];

export function HelpCenter({ showToast }: ViewProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.q}
            className="overflow-hidden rounded-2xl border border-[#EADFF7]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-3 p-4 text-left transition-colors ${
                isOpen ? "bg-mystic-lavender/40" : "hover:bg-mystic-lavender/25"
              }`}
            >
              <span className="text-sm font-bold text-mystic-ink-deep">
                {faq.q}
              </span>
              <span
                className={`shrink-0 text-mystic-purple transition-transform ${isOpen ? "rotate-90" : ""}`}
                aria-hidden="true"
              >
                ›
              </span>
            </button>
            {isOpen && (
              <p className="border-t border-[#F0EAF9] p-4 text-sm leading-relaxed text-mystic-ink/75">
                {faq.a}
              </p>
            )}
          </div>
        );
      })}

      <div className="mt-2 flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFF1FA] to-[#EEE3FF] p-5 text-center">
        <p className="text-sm font-semibold text-mystic-ink-deep">
          ยังไม่พบคำตอบที่ต้องการ?
        </p>
        <button
          type="button"
          onClick={() => showToast("ส่งข้อความถึงแอดมินแล้ว ตอบกลับภายใน 24 ชม. 💬")}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-mystic-purple shadow-pastel transition hover:scale-[1.03]"
        >
          <Icon name="chat" className="h-4 w-4" />
          ติดต่อแอดมิน
        </button>
      </div>
    </div>
  );
}

interface PolicySection {
  heading: string;
  body: string;
}

function PolicyContent({ sections }: { sections: PolicySection[] }) {
  return (
    <div className="flex flex-col gap-5">
      {sections.map((s, i) => (
        <section key={s.heading}>
          <h4 className="font-bold text-mystic-ink-deep">
            {i + 1}. {s.heading}
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-mystic-ink/75">
            {s.body}
          </p>
        </section>
      ))}
      <p className="text-xs text-mystic-muted">
        อัปเดตล่าสุด: 1 กรกฎาคม 2569
      </p>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <PolicyContent
      sections={[
        {
          heading: "ข้อมูลที่เราเก็บ",
          body: "เราเก็บเฉพาะข้อมูลที่จำเป็นต่อการใช้งาน ได้แก่ ชื่อที่แสดง อีเมล ประวัติการอ่านไพ่ และบันทึกที่คุณสร้างขึ้น เราไม่เก็บข้อมูลบัตรเครดิต โดยการชำระเงินทั้งหมดดำเนินการผ่านผู้ให้บริการที่ได้รับมาตรฐาน PCI DSS",
        },
        {
          heading: "การใช้ข้อมูลของคุณ",
          body: "ข้อมูลของคุณใช้เพื่อแสดงผลการอ่าน ปรับปรุงคำแนะนำ Deck ที่เหมาะกับคุณ และแจ้งเตือนตามที่คุณตั้งค่าไว้เท่านั้น เราไม่ขายหรือแบ่งปันข้อมูลส่วนตัวให้บุคคลที่สามเพื่อการโฆษณา",
        },
        {
          heading: "ความปลอดภัยของข้อมูล",
          body: "ข้อมูลทั้งหมดเข้ารหัสทั้งระหว่างส่งและจัดเก็บ ทีมงานเข้าถึงข้อมูลได้เฉพาะเมื่อจำเป็นต่อการช่วยเหลือคุณ และทุกการเข้าถึงถูกบันทึกไว้ตรวจสอบได้",
        },
        {
          heading: "สิทธิ์ของคุณ",
          body: "คุณสามารถขอดู แก้ไข ดาวน์โหลด หรือลบข้อมูลของคุณทั้งหมดได้ทุกเมื่อผ่านการติดต่อแอดมิน เราดำเนินการภายใน 30 วันตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
        },
        {
          heading: "คุกกี้และการติดตาม",
          body: "เราใช้คุกกี้เท่าที่จำเป็นต่อการเข้าสู่ระบบและจดจำการตั้งค่าของคุณ ไม่มีการใช้คุกกี้ติดตามพฤติกรรมข้ามเว็บไซต์",
        },
      ]}
    />
  );
}

export function TermsOfService() {
  return (
    <PolicyContent
      sections={[
        {
          heading: "การใช้บริการ",
          body: "Mystic Card เป็นบริการเปิดไพ่ Oracle และ Tarot ออนไลน์เพื่อความบันเทิงและการดูแลใจ ผู้ใช้ต้องมีอายุ 13 ปีขึ้นไป และใช้งานบัญชีของตนเองเท่านั้น",
        },
        {
          heading: "บัญชีและความปลอดภัย",
          body: "คุณมีหน้าที่รักษารหัสผ่านของตนเอง หากพบการใช้งานผิดปกติกรุณาแจ้งทีมงานทันที เราขอสงวนสิทธิ์ระงับบัญชีที่ละเมิดข้อกำหนดหรือสร้างความเสียหายต่อผู้ใช้อื่น",
        },
        {
          heading: "การซื้อ Deck และ E-book",
          body: "Deck และ E-book ที่ซื้อแล้วผูกกับบัญชีของคุณและใช้งานได้ตลอดไป ไม่สามารถโอนสิทธิ์หรือขายต่อได้ การคืนเงินทำได้ภายใน 7 วันหากยังไม่ได้เปิดใช้งานเนื้อหา",
        },
        {
          heading: "ทรัพย์สินทางปัญญา",
          body: "ภาพประกอบ ข้อความ และเนื้อหาทั้งหมดเป็นลิขสิทธิ์ของ Mystic Card ห้ามคัดลอก ดัดแปลง หรือนำไปใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร",
        },
        {
          heading: "ข้อจำกัดความรับผิด",
          body: "คำทำนายมีไว้เพื่อความบันเทิงและแรงบันดาลใจ การตัดสินใจใด ๆ จากผลการอ่านเป็นความรับผิดชอบของผู้ใช้ บริการนี้ไม่ใช่คำแนะนำทางการแพทย์ กฎหมาย หรือการเงิน",
        },
      ]}
    />
  );
}
