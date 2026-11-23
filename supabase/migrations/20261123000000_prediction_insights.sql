alter table public.predictions
  add column observed_traits text[] not null default '{}',
  add column photo_quality text check (photo_quality in ('good', 'fair', 'poor')),
  add column photo_feedback text,
  add column agreement real check (agreement between 0 and 1);

create index activity_participants_user_id_idx on public.activity_participants (user_id);
create index locations_group_id_idx on public.locations (group_id);
