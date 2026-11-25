-- Pocket Irish Dance: schools, teachers and sharing scores with your teacher.
--
-- Run this AFTER schema.sql. Paste this whole file into Supabase > SQL Editor > New query, and click Run.
-- It only ADDS new tables and functions. It doesn't change or delete anything Friends already uses.
--
-- Privacy rules this enforces:
--   * Anyone signed in can find a school and see the name of its approved teacher.
--   * A teacher's claim on a school only counts after the app team approves it (by hand).
--   * A school has at most one approved teacher at a time.
--   * Nothing is shared with a teacher until a parent agrees, for one dancer, to that named teacher.
--   * Once agreed, that dancer's results stay shared (and kept up to date) until the parent stops.
--   * Stopping deletes everything that was shared, straight away.
--   * If the teacher changes, the new teacher sees nothing until the family agrees again.
--   * The teacher sees the dancer's name and results only: no photos, no parent notes, no email.
--   * The app team (admins) approve teachers but can't read anyone's shared results through the app.
--   * Deleting an account deletes the family's shares, or the teacher's claim, with it.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- The app team. Add yourself once with the line at the very end of this file.
create table public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table public.schools (
  id         uuid primary key default gen_random_uuid(),
  -- Many Irish dance schools don't have "Irish" in their name, so any name is allowed.
  name       text not null check (char_length(btrim(name)) between 3 and 80),
  org        text not null check (org in ('clrg', 'comhdhail', 'wida', 'idtana', 'crn', 'crdm', 'other')),
  town       text not null check (char_length(btrim(town)) between 2 and 60),
  country    text not null check (char_length(btrim(country)) between 2 and 40),
  website    text check (char_length(website) <= 200),
  -- Where the school came from: an organization's official list, or a parent adding it.
  source     text check (char_length(source) <= 80),
  -- Teacher names the school's own website lists. Only a help for the app team when checking a claim.
  listed_teachers text check (char_length(listed_teachers) <= 300),
  -- The school's public email from that list. Only the app team sees it, to check a teacher.
  contact_email   text check (char_length(contact_email) <= 120),
  added_by   uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index schools_name_town_idx on public.schools (lower(btrim(name)), lower(btrim(town)));

-- A teacher asking to be the teacher for a school. Only 'approved' claims can see anything.
create table public.school_claims (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references public.schools (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  teacher_name text not null check (char_length(btrim(teacher_name)) between 2 and 60),
  credential   text check (char_length(credential) <= 80),
  proof        text check (char_length(proof) <= 500),
  status       text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'ended')),
  decided_at   timestamptz,
  created_at   timestamptz not null default now()
);
create unique index school_claims_one_teacher on public.school_claims (school_id) where status = 'approved';
create unique index school_claims_one_open on public.school_claims (school_id, user_id) where status in ('pending', 'approved');
create index school_claims_user_idx on public.school_claims (user_id);

-- A family agreeing to share one dancer's results with one approved teacher.
create table public.score_shares (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  school_id        uuid not null references public.schools (id) on delete cascade,
  claim_id         uuid not null references public.school_claims (id) on delete cascade,
  dancer_key       text not null check (char_length(dancer_key) between 1 and 40),
  dancer_name      text not null check (char_length(btrim(dancer_name)) between 1 and 40),
  agreed_at        timestamptz not null default now(),
  synced_at        timestamptz,
  unique (user_id, dancer_key)
);
create index score_shares_claim_idx on public.score_shares (claim_id);

-- The shared results themselves: a copy of the results on the parent's phone, kept up to date.
create table public.shared_results (
  share_id   uuid not null references public.score_shares (id) on delete cascade,
  result_key text not null check (char_length(result_key) between 1 and 40),
  feis_date  date,
  feis       text check (char_length(feis) <= 80),
  dance      text check (char_length(dance) <= 60),
  level      text check (char_length(level) <= 40),
  champ      boolean not null default false,
  place      smallint check (place between 1 and 999),
  entrants   smallint check (entrants between 1 and 999),
  marks      text check (char_length(marks) <= 20),
  recall     boolean not null default false,
  judges     jsonb not null default '[]' check (jsonb_typeof(judges) = 'array' and pg_column_size(judges) < 20000),
  comments   jsonb not null default '[]' check (jsonb_typeof(comments) = 'array' and pg_column_size(comments) < 20000),
  primary key (share_id, result_key)
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.app_admins a where a.user_id = auth.uid());
$$;

-- True when the claim is mine and approved (so I'm currently that school's teacher).
create function public.is_my_approved_claim(c uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.school_claims s
                 where s.id = c and s.user_id = auth.uid() and s.status = 'approved');
$$;

create function public.can_see_share(sh uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.score_shares x
                 where x.id = sh and (x.user_id = auth.uid() or public.is_my_approved_claim(x.claim_id)));
$$;

create function public.require_profile() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Please finish setting up your account first';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.app_admins     enable row level security;
alter table public.schools        enable row level security;
alter table public.school_claims  enable row level security;
alter table public.score_shares   enable row level security;
alter table public.shared_results enable row level security;

-- Schools are a public list of Irish dance schools (to signed-in people).
create policy "signed in read" on public.schools for select to authenticated using (true);

-- Claims: a teacher sees their own. Admins use the functions below.
create policy "read own" on public.school_claims for select to authenticated using (user_id = auth.uid());

-- Shares: the family sees their own; the approved teacher they agreed to sees them too.
create policy "family or teacher reads" on public.score_shares for select to authenticated
  using (user_id = auth.uid() or public.is_my_approved_claim(claim_id));
create policy "family or teacher reads" on public.shared_results for select to authenticated
  using (public.can_see_share(share_id));

-- All changes go through the functions below.
revoke all on public.app_admins, public.schools, public.school_claims, public.score_shares, public.shared_results
  from anon, authenticated;
grant select on public.school_claims, public.score_shares, public.shared_results to authenticated;
-- Everyone signed in can see a school's name and place, but not the teacher list or email kept for checking.
grant select (id, name, org, town, country, website, source, created_at) on public.schools to authenticated;

-- ---------------------------------------------------------------------------
-- Actions the app calls
-- ---------------------------------------------------------------------------

-- Find schools by name or town, with the approved teacher's name if there is one.
create function public.find_schools(q text) returns table (
  id uuid, name text, org text, town text, country text, website text, teacher_name text, claim_id uuid)
language sql stable security definer set search_path = '' as $$
  select s.id, s.name, s.org, s.town, s.country, s.website, c.teacher_name, c.id
  from public.schools s
  left join public.school_claims c on c.school_id = s.id and c.status = 'approved'
  where auth.uid() is not null
    and (s.name ilike '%' || btrim(q) || '%' or s.town ilike '%' || btrim(q) || '%')
  order by s.name, s.town
  limit 30;
$$;

-- One school, with its approved teacher.
create function public.get_school(sid uuid) returns table (
  id uuid, name text, org text, town text, country text, website text, teacher_name text, claim_id uuid)
language sql stable security definer set search_path = '' as $$
  select s.id, s.name, s.org, s.town, s.country, s.website, c.teacher_name, c.id
  from public.schools s
  left join public.school_claims c on c.school_id = s.id and c.status = 'approved'
  where auth.uid() is not null and s.id = sid;
$$;

-- Add a school that isn't listed yet (Irish dance schools only, which the app asks parents to respect).
create function public.add_school(school_name text, school_org text, school_town text, school_country text, school_website text)
returns public.schools
language plpgsql security definer set search_path = '' as $$
declare s public.schools;
begin
  perform public.require_profile();
  select * into s from public.schools
    where lower(btrim(name)) = lower(btrim(school_name)) and lower(btrim(town)) = lower(btrim(school_town));
  if s.id is not null then return s; end if;
  if (select count(*) from public.schools where added_by = auth.uid() and created_at > now() - interval '1 day') >= 5 then
    raise exception 'You can add up to 5 schools a day';
  end if;
  insert into public.schools (name, org, town, country, website, source, added_by)
    values (btrim(school_name), school_org, btrim(school_town), btrim(school_country),
            nullif(btrim(coalesce(school_website, '')), ''), 'Added by a parent', auth.uid())
    returning * into s;
  return s;
end;
$$;

-- A teacher asks to be the teacher for a school. The app team checks and approves it.
create function public.claim_school(sid uuid, name text, cred text, how_to_check text) returns public.school_claims
language plpgsql security definer set search_path = '' as $$
declare c public.school_claims;
begin
  perform public.require_profile();
  if exists (select 1 from public.school_claims where school_id = sid and status = 'approved') then
    raise exception 'This school already has an approved teacher. If that''s wrong, email pocketirishdance@gmail.com';
  end if;
  select * into c from public.school_claims where school_id = sid and user_id = auth.uid() and status = 'pending';
  if c.id is not null then return c; end if;
  if (select count(*) from public.school_claims where user_id = auth.uid() and created_at > now() - interval '1 day') >= 3 then
    raise exception 'You can send up to 3 requests a day';
  end if;
  insert into public.school_claims (school_id, user_id, teacher_name, credential, proof)
    values (sid, auth.uid(), btrim(name), nullif(btrim(coalesce(cred, '')), ''), nullif(btrim(coalesce(how_to_check, '')), ''))
    returning * into c;
  return c;
end;
$$;

-- A teacher withdraws a request, or stops being the school's teacher.
-- Families' shares with them are deleted, so nothing is left behind.
create function public.end_my_claim(c uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.school_claims where id = c and user_id = auth.uid()) then
    raise exception 'That request isn''t yours';
  end if;
  delete from public.score_shares where claim_id = c;
  update public.school_claims set status = 'ended', decided_at = now()
    where id = c and status in ('pending', 'approved');
end;
$$;

-- A family agrees to share one dancer's results with the school's approved teacher.
-- Agreeing again (for example after the teacher changed) moves the share to the new teacher.
create function public.share_with_teacher(sid uuid, expected_claim uuid, dkey text, dname text) returns public.score_shares
language plpgsql security definer set search_path = '' as $$
declare c uuid; sh public.score_shares;
begin
  perform public.require_profile();
  select id into c from public.school_claims where school_id = sid and status = 'approved';
  if c is null then raise exception 'This school doesn''t have an approved teacher yet'; end if;
  -- The parent agreed to a named teacher. If it changed in the meantime, don't share.
  if c <> expected_claim then raise exception 'The teacher for this school just changed. Please look again before you agree.'; end if;
  if exists (select 1 from public.school_claims where id = c and user_id = auth.uid()) then
    raise exception 'You''re this school''s teacher, so there''s no need to share with yourself';
  end if;
  insert into public.score_shares (user_id, school_id, claim_id, dancer_key, dancer_name)
    values (auth.uid(), sid, c, dkey, btrim(dname))
  on conflict (user_id, dancer_key) do update
    set school_id = excluded.school_id, claim_id = excluded.claim_id, dancer_name = excluded.dancer_name,
        agreed_at = case when score_shares.claim_id = excluded.claim_id then score_shares.agreed_at else now() end
  returning * into sh;
  -- A different school or teacher: start fresh, nothing carries over.
  if sh.agreed_at = now() then delete from public.shared_results where share_id = sh.id; end if;
  return sh;
end;
$$;

-- Stop sharing one dancer. Deletes everything the teacher could see for that dancer.
create function public.stop_sharing(dkey text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.score_shares where user_id = auth.uid() and dancer_key = dkey;
end;
$$;

-- Replace the shared copy of a dancer's results with what's on the parent's phone now.
create function public.sync_shared_results(sh uuid, items jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.score_shares where id = sh and user_id = auth.uid()) then
    raise exception 'That share isn''t yours';
  end if;
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) > 2000 then
    raise exception 'Too many results to share at once';
  end if;
  delete from public.shared_results where share_id = sh;
  insert into public.shared_results (share_id, result_key, feis_date, feis, dance, level, champ, place, entrants, marks, recall, judges, comments)
  select sh, r.result_key, r.feis_date, r.feis, r.dance, r.level, coalesce(r.champ, false), r.place, r.entrants, r.marks,
         coalesce(r.recall, false), coalesce(r.judges, '[]'), coalesce(r.comments, '[]')
  from jsonb_to_recordset(items) as r(result_key text, feis_date date, feis text, dance text, level text, champ boolean,
       place smallint, entrants smallint, marks text, recall boolean, judges jsonb, comments jsonb);
  update public.score_shares set synced_at = now() where id = sh;
end;
$$;

-- ----- app team only -----

create function public.admin_claims() returns table (
  id uuid, status text, teacher_name text, credential text, proof text, email text, created_at timestamptz,
  school_id uuid, school_name text, school_org text, school_town text, school_country text, school_website text,
  school_source text, listed_teachers text, school_email text, other_teacher text, families bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Only the app team can do that'; end if;
  return query
    select c.id, c.status, c.teacher_name, c.credential, c.proof, u.email::text, c.created_at,
           s.id, s.name, s.org, s.town, s.country, s.website, s.source, s.listed_teachers, s.contact_email,
           (select o.teacher_name from public.school_claims o where o.school_id = s.id and o.status = 'approved' and o.id <> c.id),
           (select count(*) from public.score_shares x where x.claim_id = c.id)
    from public.school_claims c
    join public.schools s on s.id = c.school_id
    left join auth.users u on u.id = c.user_id
    where c.status in ('pending', 'approved')
    order by (c.status = 'pending') desc, c.created_at desc
    limit 200;
end;
$$;

-- Approve or decline a teacher's request.
create function public.admin_decide_claim(c uuid, approve boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare sid uuid;
begin
  if not public.is_admin() then raise exception 'Only the app team can do that'; end if;
  select school_id into sid from public.school_claims where id = c and status = 'pending';
  if sid is null then raise exception 'That request isn''t waiting any more'; end if;
  if approve and exists (select 1 from public.school_claims where school_id = sid and status = 'approved') then
    raise exception 'This school already has an approved teacher. Remove them first.';
  end if;
  update public.school_claims set status = case when approve then 'approved' else 'declined' end, decided_at = now()
    where id = c;
end;
$$;

-- Remove an approved teacher (for example if a family reports them). Their shares are deleted.
create function public.admin_remove_teacher(c uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Only the app team can do that'; end if;
  delete from public.score_shares where claim_id = c;
  update public.school_claims set status = 'ended', decided_at = now() where id = c and status = 'approved';
end;
$$;

-- Functions: signed-in users only.
revoke all on function public.is_admin(), public.is_my_approved_claim(uuid), public.can_see_share(uuid),
  public.require_profile(), public.find_schools(text), public.get_school(uuid),
  public.add_school(text, text, text, text, text), public.claim_school(uuid, text, text, text),
  public.end_my_claim(uuid), public.share_with_teacher(uuid, uuid, text, text), public.stop_sharing(text),
  public.sync_shared_results(uuid, jsonb), public.admin_claims(), public.admin_decide_claim(uuid, boolean),
  public.admin_remove_teacher(uuid)
  from anon, public;
grant execute on function public.is_admin(), public.is_my_approved_claim(uuid), public.can_see_share(uuid),
  public.find_schools(text), public.get_school(uuid),
  public.add_school(text, text, text, text, text), public.claim_school(uuid, text, text, text),
  public.end_my_claim(uuid), public.share_with_teacher(uuid, uuid, text, text), public.stop_sharing(text),
  public.sync_shared_results(uuid, jsonb), public.admin_claims(), public.admin_decide_claim(uuid, boolean),
  public.admin_remove_teacher(uuid)
  to authenticated;

-- The school list itself is in school-list.sql. Run that next.

-- ---------------------------------------------------------------------------
-- Make the app's own account an admin, so it can approve teachers.
-- Sign in to the app once with pocketirishdance@gmail.com first, then run this file.
-- (Running it again later is fine for this line.)
-- ---------------------------------------------------------------------------
insert into public.app_admins (user_id)
  select id from auth.users where lower(email) = 'pocketirishdance@gmail.com'
  on conflict do nothing;
