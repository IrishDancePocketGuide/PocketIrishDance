-- Pocket Irish Dance: email the app team about each new teacher request.
--
-- Run this AFTER schools.sql, in Supabase > SQL Editor > New query > Run.
-- Before it can send, save the Resend API key once (see the bottom of this file).
--
-- What it does:
--  * When a teacher asks to be a school's teacher, an email goes to pocketirishdance@gmail.com
--    with everything needed to check them, plus a "Review this request" button.
--  * The button opens a page in the app that works without signing in. It only works for that
--    one request, only while it is still waiting, and stops working once it is approved or declined.
--  * If the email can't be sent, the teacher's request still goes through as normal.

create extension if not exists pg_net with schema extensions;

-- One secret link per request. Nobody can read this table directly, not even the teacher.
create table if not exists public.claim_review_links (
  claim_id   uuid primary key references public.school_claims (id) on delete cascade,
  token      text not null unique,
  created_at timestamptz not null default now()
);
alter table public.claim_review_links enable row level security;
revoke all on public.claim_review_links from anon, authenticated, public;

create or replace function public.html_text(t text) returns text
language sql immutable set search_path = '' as $$
  select replace(replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;')
$$;

-- Sends the email. Runs after a new request is saved.
create or replace function public.email_new_claim() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  s public.schools;
  tok text := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  who text;
  other text;
  api_key text;
  row_html text := '';
  link text;
begin
  insert into public.claim_review_links (claim_id, token) values (new.id, tok);
  begin
    select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
    if api_key is null then return new; end if;
    select * into s from public.schools where id = new.school_id;
    select email::text into who from auth.users where id = new.user_id;
    select teacher_name into other from public.school_claims
      where school_id = new.school_id and status = 'approved' and id <> new.id;
    link := 'https://pocketirishdance.com/app.html#/review/' || tok;
    row_html :=
      '<h2 style="margin:0 0 12px">New teacher request</h2>'
      || '<p><b>' || public.html_text(new.teacher_name) || '</b> wants to be the teacher for <b>'
      || public.html_text(s.name) || '</b> (' || public.html_text(s.town) || ', ' || public.html_text(s.country) || ').</p>'
      || '<table cellpadding="4" style="border-collapse:collapse;font-size:14px">'
      || '<tr><td><b>Their email</b></td><td>' || public.html_text(who) || '</td></tr>'
      || '<tr><td><b>Qualification</b></td><td>' || public.html_text(coalesce(new.credential, 'Not given')) || '</td></tr>'
      || '<tr><td><b>How to check</b></td><td>' || public.html_text(coalesce(new.proof, 'Not given')) || '</td></tr>'
      || '<tr><td><b>Listed teachers</b></td><td>' || public.html_text(coalesce(s.listed_teachers, 'None on file')) || '</td></tr>'
      || '<tr><td><b>School email on file</b></td><td>' || public.html_text(coalesce(s.contact_email, 'None on file')) || '</td></tr>'
      || '<tr><td><b>School website</b></td><td>' || public.html_text(coalesce(s.website, 'None on file')) || '</td></tr>'
      || '<tr><td><b>From the list</b></td><td>' || public.html_text(coalesce(s.source, '')) || '</td></tr>'
      || case when other is not null then '<tr><td><b>Note</b></td><td>This school already has an approved teacher: '
           || public.html_text(other) || '</td></tr>' else '' end
      || '</table>'
      || '<p style="margin:20px 0"><a href="' || link || '" style="background:#e8735a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Review this request</a></p>'
      || '<p style="font-size:12px;color:#666">The button opens a page where you can approve or decline. It only works for this request. Don''t forward this email.</p>';
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object(
        'from', 'Pocket Irish Dance <hello@pocketirishdance.com>',
        'to', jsonb_build_array('pocketirishdance@gmail.com'),
        'subject', 'Teacher request: ' || new.teacher_name || ' for ' || s.name,
        'html', row_html)
    );
  exception when others then
    -- Never block the teacher's request because of an email problem.
    raise warning 'Teacher request email not sent: %', sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists email_new_claim on public.school_claims;
create trigger email_new_claim after insert on public.school_claims
  for each row when (new.status = 'pending') execute function public.email_new_claim();

-- The review page: read one waiting request by its secret link. No sign-in needed.
create or replace function public.review_claim(t text) returns table (
  status text, teacher_name text, credential text, proof text, email text, created_at timestamptz,
  school_name text, school_town text, school_country text, school_website text, school_source text,
  listed_teachers text, school_email text, other_teacher text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if t is null or char_length(t) <> 64 then raise exception 'This link isn''t valid'; end if;
  return query
    select c.status, c.teacher_name, c.credential, c.proof, u.email::text, c.created_at,
           s.name, s.town, s.country, s.website, s.source, s.listed_teachers, s.contact_email,
           (select o.teacher_name from public.school_claims o where o.school_id = s.id and o.status = 'approved' and o.id <> c.id)
    from public.claim_review_links l
    join public.school_claims c on c.id = l.claim_id
    join public.schools s on s.id = c.school_id
    left join auth.users u on u.id = c.user_id
    where l.token = t and l.created_at > now() - interval '60 days';
end;
$$;

-- The review page: approve or decline. The link stops working afterwards.
create or replace function public.review_decide(t text, approve boolean) returns text
language plpgsql security definer set search_path = '' as $$
declare cid uuid; sid uuid;
begin
  if t is null or char_length(t) <> 64 then raise exception 'This link isn''t valid'; end if;
  select l.claim_id into cid from public.claim_review_links l
    where l.token = t and l.created_at > now() - interval '60 days';
  if cid is null then raise exception 'This link has expired or was already used. Use the Teacher requests page in the app instead.'; end if;
  select school_id into sid from public.school_claims where id = cid and status = 'pending';
  if sid is null then
    delete from public.claim_review_links where claim_id = cid;
    raise exception 'That request isn''t waiting any more';
  end if;
  if approve and exists (select 1 from public.school_claims where school_id = sid and status = 'approved') then
    raise exception 'This school already has an approved teacher. Remove them on the Teacher requests page first.';
  end if;
  update public.school_claims set status = case when approve then 'approved' else 'declined' end, decided_at = now()
    where id = cid;
  delete from public.claim_review_links where claim_id = cid;
  return case when approve then 'approved' else 'declined' end;
end;
$$;

-- When a request is decided in the app instead, its email link stops working too.
create or replace function public.forget_review_link() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status <> 'pending' then delete from public.claim_review_links where claim_id = new.id; end if;
  return new;
end;
$$;
drop trigger if exists forget_review_link on public.school_claims;
create trigger forget_review_link after update of status on public.school_claims
  for each row execute function public.forget_review_link();

revoke all on function public.html_text(text), public.email_new_claim(), public.forget_review_link(),
  public.review_claim(text), public.review_decide(text, boolean) from anon, authenticated, public;
grant execute on function public.review_claim(text), public.review_decide(text, boolean) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- LAST STEP, done once: save the Resend API key so the database can send email.
-- In a NEW query, paste this line, put your key between the quotes, and Run:
--
--   select vault.create_secret('re_YOUR_KEY_HERE', 'resend_api_key');
--
-- (To change it later: select vault.update_secret((select id from vault.secrets where name = 'resend_api_key'), 're_NEW_KEY');)
