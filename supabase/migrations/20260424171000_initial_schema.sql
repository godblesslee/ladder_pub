create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  nickname text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'organizer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'organizer' check (role in ('organizer', 'admin')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.beers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  brewery_name text not null,
  product_name text not null,
  style_name text not null,
  volume_ml integer,
  country_code text,
  abv numeric(4, 2),
  image_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.review_template_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.review_templates(id) on delete cascade,
  version_number integer not null,
  snapshot_json jsonb not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (template_id, version_number)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'ongoing', 'ended')),
  template_version_id uuid references public.review_template_versions(id),
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  participation_status text not null default 'joined' check (participation_status in ('invited', 'joined', 'cancelled')),
  joined_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists public.event_beers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  beer_id uuid not null references public.beers(id) on delete cascade,
  serving_order integer,
  custom_label text,
  vintage text,
  batch_no text,
  blind_code text,
  notes text,
  created_at timestamptz not null default now(),
  unique (event_id, beer_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  event_beer_id uuid not null references public.event_beers(id) on delete cascade,
  beer_id uuid not null references public.beers(id) on delete cascade,
  template_version_id uuid not null references public.review_template_versions(id),
  total_score numeric(5, 2),
  public_note text,
  private_note text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'locked')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, event_id, event_beer_id)
);

create table if not exists public.review_answers (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  field_key text not null,
  value_text text,
  value_number numeric(6, 2),
  value_json jsonb,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.event_beers enable row level security;
alter table public.reviews enable row level security;
alter table public.review_answers enable row level security;

create policy "public can read published events"
on public.events
for select
using (status in ('published', 'ongoing', 'ended'));

create policy "participants can read event participants"
on public.event_participants
for select
using (auth.uid() = user_id);

create policy "participants can read event beers"
on public.event_beers
for select
using (
  exists (
    select 1
    from public.event_participants ep
    where ep.event_id = event_beers.event_id
      and ep.user_id = auth.uid()
  )
);

create policy "users manage own reviews"
on public.reviews
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage own review answers"
on public.review_answers
for all
using (
  exists (
    select 1
    from public.reviews r
    where r.id = review_answers.review_id
      and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.reviews r
    where r.id = review_answers.review_id
      and r.user_id = auth.uid()
  )
);
