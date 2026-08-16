create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.one_more_second_scores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Player',
  best_seconds numeric(10, 3) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_more_second_scores_best_seconds_range
    check (best_seconds >= 0 and best_seconds <= 86400)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.keep_best_one_more_second_score()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.user_id = old.user_id;
    if new.best_seconds < old.best_seconds then
      new.best_seconds = old.best_seconds;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists one_more_second_scores_set_updated_at on public.one_more_second_scores;
create trigger one_more_second_scores_set_updated_at
before update on public.one_more_second_scores
for each row execute function public.set_updated_at();

drop trigger if exists one_more_second_scores_keep_best on public.one_more_second_scores;
create trigger one_more_second_scores_keep_best
before insert or update on public.one_more_second_scores
for each row execute function public.keep_best_one_more_second_score();

create index if not exists one_more_second_scores_best_seconds_idx
  on public.one_more_second_scores (best_seconds desc, updated_at asc);

alter table public.profiles enable row level security;
alter table public.one_more_second_scores enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Anyone can read One More Second scores" on public.one_more_second_scores;
create policy "Anyone can read One More Second scores"
on public.one_more_second_scores
for select
to anon, authenticated
using (true);

drop policy if exists "Users can insert own One More Second score" on public.one_more_second_scores;
create policy "Users can insert own One More Second score"
on public.one_more_second_scores
for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update own One More Second score" on public.one_more_second_scores;
create policy "Users can update own One More Second score"
on public.one_more_second_scores
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.one_more_second_scores from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select on table public.one_more_second_scores to anon, authenticated;
grant insert, update on table public.one_more_second_scores to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'one_more_second_scores'
  ) then
    execute 'alter publication supabase_realtime add table public.one_more_second_scores';
  end if;
end $$;
