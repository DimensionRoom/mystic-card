-- =============================================================
-- Mystic Card — Supabase schema
-- รันไฟล์นี้ใน Dashboard → SQL Editor (ครั้งเดียว)
-- =============================================================

-- ---------- โปรไฟล์ผู้ใช้ (ผูกกับ auth.users จาก Google login) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  username text,
  avatar_url text,
  bio text default '',
  points integer not null default 250,
  language text not null default 'th',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Deck ที่ผู้ใช้ซื้อ/เป็นเจ้าของ ----------
create table if not exists public.owned_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deck_id text not null,
  purchased_at timestamptz not null default now(),
  unique (user_id, deck_id)
);

-- ---------- Deck ที่กดหัวใจไว้ ----------
create table if not exists public.deck_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  deck_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, deck_id)
);

-- ---------- ประวัติการอ่านไพ่ ----------
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deck_id text not null,
  deck_name text not null,
  deck_type text not null default 'Oracle',
  reading_type text not null default 'one-card',
  title text not null,
  preview text default '',
  card_count integer not null default 1,
  cards jsonb not null default '[]'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists readings_user_created_idx
  on public.readings (user_id, created_at desc);

-- ---------- โน้ตที่ผู้ใช้จดไว้ ----------
create table if not exists public.reading_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reading_id uuid references public.readings (id) on delete set null,
  deck_name text default '',
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------- การซื้อ E-book ----------
create table if not exists public.ebook_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deck_id text not null,
  price integer not null default 0,
  purchased_at timestamptz not null default now(),
  unique (user_id, deck_id)
);

-- =============================================================
-- Row Level Security: ทุกคนเห็นเฉพาะข้อมูลของตัวเอง
-- =============================================================
alter table public.profiles enable row level security;
alter table public.owned_decks enable row level security;
alter table public.deck_favorites enable row level security;
alter table public.readings enable row level security;
alter table public.reading_notes enable row level security;
alter table public.ebook_purchases enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own decks" on public.owned_decks;
create policy "own decks" on public.owned_decks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own favorites" on public.deck_favorites;
create policy "own favorites" on public.deck_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own readings" on public.readings;
create policy "own readings" on public.readings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own notes" on public.reading_notes;
create policy "own notes" on public.reading_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own purchases" on public.ebook_purchases;
create policy "own purchases" on public.ebook_purchases
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =============================================================
-- สมัครใหม่ (Google login ครั้งแรก):
-- สร้างโปรไฟล์อัตโนมัติ + แถม deck เริ่มต้น 6 สำรับ
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'นักเดินทาง'),
    split_part(coalesce(new.email, 'user'), '@', 1),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.owned_decks (user_id, deck_id)
  values
    (new.id, 'dreamy-unicorn'),
    (new.id, 'pastel-fairy'),
    (new.id, 'magic-cat'),
    (new.id, 'moonlight'),
    (new.id, 'little-love'),
    (new.id, 'mystic-time')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
