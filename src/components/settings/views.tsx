import { useEffect, useState } from "react";
import Icon from "../Icon";
import Toggle from "./Toggle";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";

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
  const { t } = useLanguage();
  // เริ่มด้วยชื่อจริงจาก Google ทันที (ไม่ใช้ "น้องดาว" ค้างระหว่างรอ profile โหลด)
  const [name, setName] = useState(displayName);
  const [username, setUsername] = useState(
    () => user?.email?.split("@")[0] ?? "nongdao",
  );
  const [bio, setBio] = useState(() =>
    user ? "" : t.settingsViews.defaultBio,
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
      showToast(t.settingsViews.profileSavedToast);
      return;
    }
    setSaving(true);
    const ok = await updateProfile({
      display_name: name,
      username,
      bio,
    });
    setSaving(false);
    showToast(
      ok
        ? t.settingsViews.profileSavedToast
        : t.settingsViews.profileSaveFailedToast,
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={t.settingsViews.avatarAlt.replace("{name}", name)}
          referrerPolicy="no-referrer"
          className="h-20 w-20 rounded-full object-cover shadow-pastel"
        />
        <button
          type="button"
          onClick={() => showToast(t.settingsViews.uploadPhotoToast)}
          className="rounded-full border border-mystic-border-purple px-5 py-2 text-sm font-semibold text-mystic-purple transition-colors hover:bg-mystic-lavender/60"
        >
          {t.settingsViews.changePhotoButton}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>{t.settingsViews.displayNameLabel}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>{t.settingsViews.usernameLabel}</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label>
        <span className={labelClass}>{t.settingsViews.bioLabel}</span>
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
        {saving ? t.settingsViews.savingButton : t.settingsViews.saveButton}
      </button>
    </form>
  );
}

export function EmailSettings({ showToast }: ViewProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [newEmail, setNewEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-2xl border border-[#EADFF7] bg-[#FBF8FF] p-4">
        <div>
          <p className="text-sm font-semibold text-mystic-ink-deep">
            {t.settingsViews.currentEmailLabel}
          </p>
          <p className="mt-0.5 break-all text-mystic-purple">
            {user?.email ?? "nongdao@mysticcard.app"}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-500">
          {t.settingsViews.verifiedBadge}
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newEmail.includes("@")) {
            showToast(t.settingsViews.invalidEmailToast);
            return;
          }
          setNewEmail("");
          showToast(
            t.settingsViews.verificationSentToast.replace(
              "{email}",
              newEmail,
            ),
          );
        }}
        className="flex flex-col gap-4"
      >
        <label>
          <span className={labelClass}>{t.settingsViews.newEmailLabel}</span>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={t.settingsViews.newEmailPlaceholder}
            className={inputClass}
          />
        </label>
        <button type="submit" className={`self-start ${saveButtonClass}`}>
          {t.settingsViews.sendVerificationButton}
        </button>
      </form>

      <div className="flex items-center justify-between rounded-2xl border border-[#EADFF7] p-4">
        <div>
          <p className="text-sm font-semibold text-mystic-ink-deep">
            {t.settingsViews.newsletterTitle}
          </p>
          <p className="mt-0.5 text-xs text-mystic-muted">
            {t.settingsViews.newsletterDesc}
          </p>
        </div>
        <Toggle
          checked={newsletter}
          onChange={(v) => {
            setNewsletter(v);
            showToast(
              v
                ? t.settingsViews.newsletterOnToast
                : t.settingsViews.newsletterOffToast,
            );
          }}
          label={t.settingsViews.newsletterTitle}
        />
      </div>
    </div>
  );
}

export function PasswordSettings({ showToast }: ViewProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current)
      return setError(t.settingsViews.currentPasswordRequiredError);
    if (next.length < 8)
      return setError(t.settingsViews.passwordTooShortError);
    if (next !== confirm)
      return setError(t.settingsViews.passwordMismatchError);
    setError(null);
    setCurrent("");
    setNext("");
    setConfirm("");
    showToast(t.settingsViews.passwordChangedToast);
  };

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <label>
        <span className={labelClass}>
          {t.settingsViews.currentPasswordLabel}
        </span>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputClass}
        />
      </label>
      <label>
        <span className={labelClass}>{t.settingsViews.newPasswordLabel}</span>
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-mystic-muted">
          {t.settingsViews.minCharsHint}
        </span>
      </label>
      <label>
        <span className={labelClass}>
          {t.settingsViews.confirmPasswordLabel}
        </span>
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
        {t.settingsViews.changePasswordButton}
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
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState({
    daily: true,
    universe: true,
    promo: false,
    weekly: true,
    sound: true,
  });

  const set = (key: keyof typeof prefs, label: string) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [key]: v }));
    showToast(
      v
        ? t.settingsViews.toggleOnToast.replace("{label}", label)
        : t.settingsViews.toggleOffToast.replace("{label}", label),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <ToggleRow
        title={t.settingsViews.dailyCardTitle}
        description={t.settingsViews.dailyCardDesc}
        checked={prefs.daily}
        onChange={set("daily", t.settingsViews.dailyCardToggleLabel)}
      />
      <ToggleRow
        title={t.settingsViews.universeMessageTitle}
        description={t.settingsViews.universeMessageDesc}
        checked={prefs.universe}
        onChange={set("universe", t.settingsViews.universeMessageTitle)}
      />
      <ToggleRow
        title={t.settingsViews.shopPromoTitle}
        description={t.settingsViews.shopPromoDesc}
        checked={prefs.promo}
        onChange={set("promo", t.settingsViews.shopPromoTitle)}
      />
      <ToggleRow
        title={t.settingsViews.weeklyDigestTitle}
        description={t.settingsViews.weeklyDigestDesc}
        checked={prefs.weekly}
        onChange={set("weekly", t.settingsViews.weeklyDigestTitle)}
      />
      <ToggleRow
        title={t.settingsViews.soundTitle}
        description={t.settingsViews.soundDesc}
        checked={prefs.sound}
        onChange={set("sound", t.settingsViews.soundTitle)}
      />
    </div>
  );
}

type FontSize = "small" | "medium" | "large";

export function ReadingSettings({ showToast }: ViewProps) {
  const { t } = useLanguage();
  const fontSizeOptions: { id: FontSize; label: string }[] = [
    { id: "small", label: t.settingsViews.fontSizeSmall },
    { id: "medium", label: t.settingsViews.fontSizeMedium },
    { id: "large", label: t.settingsViews.fontSizeLarge },
  ];
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  return (
    <div className="flex flex-col gap-3">
      <ToggleRow
        title={t.settingsViews.autoSaveTitle}
        description={t.settingsViews.autoSaveDesc}
        checked={autoSave}
        onChange={(v) => {
          setAutoSave(v);
          showToast(
            v
              ? t.settingsViews.autoSaveOnToast
              : t.settingsViews.autoSaveOffToast,
          );
        }}
      />

      <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#EADFF7] p-4">
        <span>
          <span className="block text-sm font-semibold text-mystic-ink-deep">
            {t.settingsViews.fontSizeTitle}
          </span>
          <span className="text-xs text-mystic-muted">
            {t.settingsViews.fontSizeDesc}
          </span>
        </span>
        <select
          value={fontSize}
          onChange={(e) => {
            const next = e.target.value as FontSize;
            setFontSize(next);
            const label = fontSizeOptions.find((o) => o.id === next)!.label;
            showToast(
              t.settingsViews.fontSizeChangedToast.replace("{size}", label),
            );
          }}
          className="h-11 rounded-xl border border-[#EADFF7] bg-white px-3 text-sm font-semibold text-mystic-ink-deep outline-none focus:border-[#B89CFF]"
        >
          {fontSizeOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/* ---------- อื่นๆ ---------- */

export function HelpCenter({ showToast }: ViewProps) {
  const { t } = useLanguage();
  const faqs = [
    { q: t.settingsViews.faq1Q, a: t.settingsViews.faq1A },
    { q: t.settingsViews.faq2Q, a: t.settingsViews.faq2A },
    { q: t.settingsViews.faq3Q, a: t.settingsViews.faq3A },
    { q: t.settingsViews.faq4Q, a: t.settingsViews.faq4A },
    { q: t.settingsViews.faq5Q, a: t.settingsViews.faq5A },
  ];
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
          {t.settingsViews.noAnswerTitle}
        </p>
        <button
          type="button"
          onClick={() => showToast(t.settingsViews.contactSentToast)}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-mystic-purple shadow-pastel transition hover:scale-[1.03]"
        >
          <Icon name="chat" className="h-4 w-4" />
          {t.settingsViews.contactAdminButton}
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
  const { t } = useLanguage();
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
        {t.settingsViews.lastUpdated}
      </p>
    </div>
  );
}

export function PrivacyPolicy() {
  const { t } = useLanguage();
  return (
    <PolicyContent
      sections={[
        {
          heading: t.settingsViews.privacy1Heading,
          body: t.settingsViews.privacy1Body,
        },
        {
          heading: t.settingsViews.privacy2Heading,
          body: t.settingsViews.privacy2Body,
        },
        {
          heading: t.settingsViews.privacy3Heading,
          body: t.settingsViews.privacy3Body,
        },
        {
          heading: t.settingsViews.privacy4Heading,
          body: t.settingsViews.privacy4Body,
        },
        {
          heading: t.settingsViews.privacy5Heading,
          body: t.settingsViews.privacy5Body,
        },
      ]}
    />
  );
}

export function TermsOfService() {
  const { t } = useLanguage();
  return (
    <PolicyContent
      sections={[
        {
          heading: t.settingsViews.terms1Heading,
          body: t.settingsViews.terms1Body,
        },
        {
          heading: t.settingsViews.terms2Heading,
          body: t.settingsViews.terms2Body,
        },
        {
          heading: t.settingsViews.terms3Heading,
          body: t.settingsViews.terms3Body,
        },
        {
          heading: t.settingsViews.terms4Heading,
          body: t.settingsViews.terms4Body,
        },
        {
          heading: t.settingsViews.terms5Heading,
          body: t.settingsViews.terms5Body,
        },
      ]}
    />
  );
}
