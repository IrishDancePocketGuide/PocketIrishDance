-- Pocket Irish Dance: friend groups, shared wins and cheers.
--
-- Paste this whole file into Supabase > SQL Editor > New query, and click Run.
-- It is safe to run on a new, empty project.
--
-- Privacy rules this enforces (see the plan doc):
--   * Only signed-in parents or guardians who confirmed they are 18+ can do anything.
--   * People only ever see the groups they belong to, and what was shared in them.
--   * Groups are hidden: joining needs the invite code.
--   * A win is shared on purpose, one at a time; it holds a first name or nickname only.
--   * Deleting an account deletes everything that person put online.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  display_name       text not null check (char_length(btrim(display_name)) between 1 and 40),
  adult_confirmed_at timestamptz not null default now(),
  created_at         timestamptz not null default now()
);

create table public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 60),
  invite_code text not null unique check (invite_code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  created_at  timestamptz not null default now()
);

create table public.group_members (
  group_id  uuid not null references public.groups (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  role      text not null default 'member' check (role in ('organiser', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);

create table public.wins (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  dancer_name text not null check (char_length(btrim(dancer_name)) between 1 and 30),
  feis        text check (char_length(feis) <= 80),
  feis_date   date,
  dance       text check (char_length(dance) <= 60),
  level       text check (char_length(level) <= 40),
  place       smallint check (place between 1 and 999),
  entrants    smallint check (entrants between 1 and 999),
  milestone   text check (char_length(milestone) <= 80),
  created_at  timestamptz not null default now(),
  -- The user must still be in the group (enforced by the insert policy) and
  -- a win must say something.
  check (dance is not null or milestone is not null)
);
create index wins_group_idx on public.wins (group_id, created_at desc);

create table public.cheers (
  id         uuid primary key default gen_random_uuid(),
  win_id     uuid not null references public.wins (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  kind       text not null check (kind in (
               'clap', 'heart', 'shamrock', 'star',
               'congrats', 'well_danced', 'so_proud', 'next_time')),
  created_at timestamptz not null default now(),
  unique (win_id, user_id, kind)
);
create index cheers_win_idx on public.cheers (win_id);

-- Reports go to the app owner (seen in the Supabase dashboard), not to the group.
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  win_id      uuid references public.wins (id) on delete set null,
  group_id    uuid references public.groups (id) on delete set null,
  reporter_id uuid references public.profiles (id) on delete set null,
  reason      text check (char_length(reason) <= 500),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpers (security definer so policies don't loop back on themselves)
-- ---------------------------------------------------------------------------

create function public.is_member(g uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.group_members m
                 where m.group_id = g and m.user_id = auth.uid());
$$;

create function public.is_organiser(g uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.group_members m
                 where m.group_id = g and m.user_id = auth.uid() and m.role = 'organiser');
$$;

create function public.shares_group_with(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.group_members a
                 join public.group_members b on b.group_id = a.group_id
                 where a.user_id = auth.uid() and b.user_id = other);
$$;

create function public.new_invite_code() returns text
language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- no I, O, 0, 1
  code text;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.groups where invite_code = code);
  end loop;
  return code;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security: nothing is readable or writable unless a policy says so
-- ---------------------------------------------------------------------------

alter table public.profiles      enable row level security;
alter table public.groups        enable row level security;
alter table public.group_members enable row level security;
alter table public.wins          enable row level security;
alter table public.cheers        enable row level security;
alter table public.reports       enable row level security;

-- Profiles: your own, plus people you share a group with (display name only matters).
create policy "read own or group-mates" on public.profiles for select to authenticated
  using (id = auth.uid() or public.shares_group_with(id));
create policy "create own" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Groups: members read; organisers rename. Create, join, leave go through functions below.
create policy "members read" on public.groups for select to authenticated
  using (public.is_member(id));
create policy "organiser renames" on public.groups for update to authenticated
  using (public.is_organiser(id)) with check (public.is_organiser(id));

-- Members: see who is in your groups; organisers can remove people.
create policy "members read" on public.group_members for select to authenticated
  using (public.is_member(group_id));
create policy "organiser removes" on public.group_members for delete to authenticated
  using (public.is_organiser(group_id) and user_id <> auth.uid());

-- Wins: members read; you share your own into your groups; you or the organiser remove.
create policy "members read" on public.wins for select to authenticated
  using (public.is_member(group_id));
create policy "share own" on public.wins for insert to authenticated
  with check (user_id = auth.uid() and public.is_member(group_id));
create policy "owner or organiser removes" on public.wins for delete to authenticated
  using (user_id = auth.uid() or public.is_organiser(group_id));

-- Cheers: members read and add their own; you can take back your own.
create policy "members read" on public.cheers for select to authenticated
  using (exists (select 1 from public.wins w where w.id = win_id and public.is_member(w.group_id)));
create policy "cheer own" on public.cheers for insert to authenticated
  with check (user_id = auth.uid()
              and exists (select 1 from public.wins w where w.id = win_id and public.is_member(w.group_id)));
create policy "remove own" on public.cheers for delete to authenticated
  using (user_id = auth.uid());

-- Reports: you can file one about a win in your group, and see your own.
create policy "file report" on public.reports for insert to authenticated
  with check (reporter_id = auth.uid()
              and exists (select 1 from public.wins w where w.id = win_id
                          and w.group_id = reports.group_id and public.is_member(w.group_id)));
create policy "read own reports" on public.reports for select to authenticated
  using (reporter_id = auth.uid());

-- Only signed-in users get table access at all; the public (anon) key gets nothing.
revoke all on all tables in schema public from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, update on public.groups to authenticated;
grant select, delete on public.group_members to authenticated;
grant select, insert, delete on public.wins to authenticated;
grant select, insert, delete on public.cheers to authenticated;
grant select, insert on public.reports to authenticated;

-- Even an organiser may only change a group's name.
revoke update on public.groups from authenticated;
grant update (name) on public.groups to authenticated;
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Actions the app calls
-- ---------------------------------------------------------------------------

-- Make a group; the caller becomes its organiser.
create function public.create_group(group_name text) returns public.groups
language plpgsql security definer set search_path = '' as $$
declare g public.groups;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Please finish setting up your account first';
  end if;
  if (select count(*) from public.group_members where user_id = auth.uid() and role = 'organiser') >= 10 then
    raise exception 'You can organise up to 10 groups';
  end if;
  insert into public.groups (name, invite_code)
    values (btrim(group_name), public.new_invite_code()) returning * into g;
  insert into public.group_members (group_id, user_id, role) values (g.id, auth.uid(), 'organiser');
  return g;
end;
$$;

-- Join with an invite code. Groups can't be found any other way.
create function public.join_group(code text) returns public.groups
language plpgsql security definer set search_path = '' as $$
declare g public.groups;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Please finish setting up your account first';
  end if;
  select * into g from public.groups where invite_code = upper(btrim(code));
  if g.id is null then raise exception 'That invite code didn''t match a group'; end if;
  if exists (select 1 from public.group_members where group_id = g.id and user_id = auth.uid()) then
    return g;
  end if;
  if (select count(*) from public.group_members where group_id = g.id) >= 50 then
    raise exception 'This group is full (50 people)';
  end if;
  insert into public.group_members (group_id, user_id) values (g.id, auth.uid());
  return g;
end;
$$;

-- Leave a group. If the last organiser leaves, the longest-standing member takes over;
-- if nobody is left, the group and everything in it is deleted.
create function public.leave_group(g uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.group_members where group_id = g and user_id = auth.uid();
  if not exists (select 1 from public.group_members where group_id = g) then
    delete from public.groups where id = g;
  elsif not exists (select 1 from public.group_members where group_id = g and role = 'organiser') then
    update public.group_members set role = 'organiser'
      where group_id = g and user_id = (select user_id from public.group_members
                                        where group_id = g order by joined_at limit 1);
  end if;
end;
$$;

-- Organiser makes a fresh invite code (the old one stops working).
create function public.new_group_code(g uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare code text;
begin
  if not public.is_organiser(g) then raise exception 'Only the organiser can do that'; end if;
  code := public.new_invite_code();
  update public.groups set invite_code = code where id = g;
  return code;
end;
$$;

-- Delete my account and everything I put online. Groups I was alone in go too.
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
declare g uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  for g in select group_id from public.group_members where user_id = auth.uid() loop
    perform public.leave_group(g);
  end loop;
  delete from auth.users where id = auth.uid();
end;
$$;

-- Functions: signed-in users only (Supabase lets anyone run new functions by default).
revoke all on all functions in schema public from anon, public;
grant execute on function public.is_member(uuid), public.is_organiser(uuid),
  public.shares_group_with(uuid), public.create_group(text), public.join_group(text),
  public.leave_group(uuid), public.new_group_code(uuid), public.delete_my_account()
  to authenticated;
