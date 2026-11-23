create type public.user_role as enum ('community', 'coordinator', 'admin');
create type public.observation_status as enum ('pending', 'verified', 'revision_required', 'rejected');
create type public.prediction_status as enum ('confident', 'needs_review', 'unrecognized');
create type public.site_condition as enum ('healthy', 'stressed', 'damaged', 'littered');
create type public.activity_status as enum ('planned', 'ongoing', 'completed', 'cancelled');

create table public.conservation_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'community',
  group_id uuid references public.conservation_groups (id) on delete set null,
  show_name_publicly boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.species (
  id uuid primary key default gen_random_uuid(),
  scientific_name text not null unique,
  local_name text,
  family text,
  leaf_traits text,
  model_label text unique,
  is_supported boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  is_sensitive boolean not null default false,
  group_id uuid references public.conservation_groups (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  location_id uuid references public.locations (id) on delete set null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  observed_at timestamptz not null,
  photo_path text not null,
  condition public.site_condition not null,
  notes text,
  species_id uuid references public.species (id) on delete set null,
  status public.observation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  observation_id uuid references public.observations (id) on delete set null,
  photo_path text not null,
  prediction_status public.prediction_status not null,
  predicted_label text,
  species_id uuid references public.species (id) on delete set null,
  confidence real not null check (confidence between 0 and 1),
  top_k jsonb not null default '[]'::jsonb,
  model_version text not null,
  created_at timestamptz not null default now()
);

create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.observations (id) on delete cascade,
  verifier_id uuid not null references public.profiles (id) on delete cascade,
  decision public.observation_status not null check (decision <> 'pending'),
  species_id uuid references public.species (id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  check (decision = 'verified' or note is not null)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location_id uuid references public.locations (id) on delete set null,
  group_id uuid references public.conservation_groups (id) on delete set null,
  source_observation_id uuid references public.observations (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status public.activity_status not null default 'planned',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table public.activity_participants (
  activity_id uuid not null references public.activities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (activity_id, user_id)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  cover_path text,
  author_id uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index observations_user_id_idx on public.observations (user_id, created_at desc);
create index observations_status_idx on public.observations (status, created_at desc);
create index observations_location_id_idx on public.observations (location_id);
create index predictions_user_id_idx on public.predictions (user_id, created_at desc);
create index verifications_observation_id_idx on public.verifications (observation_id);
create index activities_starts_at_idx on public.activities (starts_at);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger observations_set_updated_at before update on public.observations
  for each row execute function public.set_updated_at();
create trigger articles_set_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create function public.is_verifier()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() in ('coordinator', 'admin'), false);
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create function public.apply_verification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.observations
  set status = new.decision,
      species_id = coalesce(new.species_id, species_id)
  where id = new.observation_id;
  return new;
end;
$$;

create trigger verifications_apply after insert on public.verifications
  for each row execute function public.apply_verification();

create function public.reset_status_on_resubmit()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'revision_required'
     and new.status = old.status
     and new.user_id = (select auth.uid()) then
    new.status = 'pending';
  end if;
  return new;
end;
$$;

create trigger observations_reset_status before update on public.observations
  for each row execute function public.reset_status_on_resubmit();

alter table public.conservation_groups enable row level security;
alter table public.profiles enable row level security;
alter table public.species enable row level security;
alter table public.locations enable row level security;
alter table public.observations enable row level security;
alter table public.predictions enable row level security;
alter table public.verifications enable row level security;
alter table public.activities enable row level security;
alter table public.activity_participants enable row level security;
alter table public.articles enable row level security;

create policy "groups are readable" on public.conservation_groups
  for select to anon, authenticated using (true);
create policy "admins manage groups" on public.conservation_groups
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "read own profile or as verifier" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_verifier()));
create policy "update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (full_name, show_name_publicly, group_id) on public.profiles to authenticated;

create policy "species are readable" on public.species
  for select to anon, authenticated using (true);
create policy "admins manage species" on public.species
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "locations are readable" on public.locations
  for select to authenticated using (true);
create policy "contributors add locations" on public.locations
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "verifiers edit locations" on public.locations
  for update to authenticated using ((select public.is_verifier())) with check ((select public.is_verifier()));

create policy "read own observations or as verifier" on public.observations
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_verifier()));
create policy "submit own observations" on public.observations
  for insert to authenticated with check (user_id = (select auth.uid()) and status = 'pending');
create policy "revise own open observations" on public.observations
  for update to authenticated
  using (user_id = (select auth.uid()) and status in ('pending', 'revision_required'))
  with check (user_id = (select auth.uid()) and status in ('pending', 'revision_required'));
revoke update on public.observations from authenticated;
grant update (location_id, latitude, longitude, observed_at, photo_path, condition, notes) on public.observations to authenticated;

create policy "delete own pending observations" on public.observations
  for delete to authenticated using (user_id = (select auth.uid()) and status = 'pending');

create policy "read own predictions or as verifier" on public.predictions
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_verifier()));

create policy "read verifications of own observations or as verifier" on public.verifications
  for select to authenticated using (
    (select public.is_verifier())
    or exists (
      select 1 from public.observations o
      where o.id = observation_id and o.user_id = (select auth.uid())
    )
  );
create policy "verifiers record decisions" on public.verifications
  for insert to authenticated
  with check ((select public.is_verifier()) and verifier_id = (select auth.uid()));

create policy "activities are readable" on public.activities
  for select to anon, authenticated using (status <> 'cancelled' or (select public.is_verifier()));
create policy "verifiers manage activities" on public.activities
  for all to authenticated using ((select public.is_verifier())) with check ((select public.is_verifier()));

create policy "participants are readable" on public.activity_participants
  for select to authenticated using (true);
create policy "join activities" on public.activity_participants
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "leave activities" on public.activity_participants
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "published articles are readable" on public.articles
  for select to anon, authenticated using (published_at is not null and published_at <= now());
create policy "admins manage articles" on public.articles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create view public.public_map_points as
select
  o.id,
  case when l.is_sensitive then round(o.latitude::numeric, 2)::double precision else o.latitude end as latitude,
  case when l.is_sensitive then round(o.longitude::numeric, 2)::double precision else o.longitude end as longitude,
  coalesce(l.is_sensitive, false) as is_approximate,
  o.condition,
  o.observed_at,
  s.scientific_name,
  s.local_name,
  l.name as location_name
from public.observations o
left join public.locations l on l.id = o.location_id
left join public.species s on s.id = o.species_id
where o.status = 'verified';

grant select on public.public_map_points to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('observation-photos', 'observation-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "upload own observation photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'observation-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "read own observation photos or as verifier" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'observation-photos'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_verifier()))
  );
create policy "delete own observation photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'observation-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  resolved_role public.user_role;
begin
  select role into resolved_role from public.profiles where id = (event ->> 'user_id')::uuid;
  claims := coalesce(event -> 'claims', '{}'::jsonb);
  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(resolved_role, 'community')::text));
  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
grant select on table public.profiles to supabase_auth_admin;

create policy "auth admin reads roles" on public.profiles
  as permissive for select to supabase_auth_admin using (true);
