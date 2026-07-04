import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  points: number;
}

interface AuthContextValue {
  /** false เมื่อยังไม่ได้ตั้งค่า VITE_SUPABASE_ANON_KEY — UI จะใช้ mock ทั้งหมด */
  isConfigured: boolean;
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  /**
   * ชื่อที่ควรแสดงผลเสมอ: profiles.display_name → ชื่อจาก Google โดยตรง →
   * ส่วนหน้าอีเมล → mock "น้องดาว" เฉพาะตอนไม่ได้ล็อกอินจริงเท่านั้น
   * ใช้ค่านี้แทนการ fallback เป็น "น้องดาว" เองในแต่ละ component
   */
  displayName: string;
  avatarUrl: string;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (
    patch: Partial<Pick<Profile, "display_name" | "username" | "bio">>,
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface GoogleUserMeta {
  full_name?: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, bio, points")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) void fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) void fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const updateProfile = useCallback(
    async (
      patch: Partial<Pick<Profile, "display_name" | "username" | "bio">>,
    ) => {
      if (!supabase || !user) return false;
      const { error } = await supabase
        .from("profiles")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (!error) await fetchProfile(user.id);
      return !error;
    },
    [user, fetchProfile],
  );

  // เมื่อมีการล็อกอินจริง ให้ใช้ชื่อ/รูปจาก Google ทันที ไม่ต้องรอ profiles โหลดเสร็จ
  // "น้องดาว" เป็น mock persona ที่โชว์เฉพาะตอนไม่มี session จริงเท่านั้น
  const googleMeta = user?.user_metadata as GoogleUserMeta | undefined;
  const displayName =
    profile?.display_name ??
    (user
      ? (googleMeta?.full_name ??
        googleMeta?.name ??
        user.email?.split("@")[0] ??
        "นักเดินทาง")
      : "น้องดาว");
  const avatarUrl =
    profile?.avatar_url ??
    (user
      ? (googleMeta?.avatar_url ?? googleMeta?.picture ?? "/img/avatar.png")
      : "/img/avatar.png");

  return (
    <AuthContext.Provider
      value={{
        isConfigured: isSupabaseConfigured,
        loading,
        user,
        profile,
        displayName,
        avatarUrl,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
