-- Run this in Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.labels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity integer not null default 0,
  pending_quantity integer not null default 0,
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'processed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chemicals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity integer not null default 0,
  pending_quantity integer not null default 0,
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'processed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packing_materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity integer not null default 0,
  pending_quantity integer not null default 0,
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'processed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists labels_set_updated_at on public.labels;
create trigger labels_set_updated_at
before update on public.labels
for each row
execute procedure set_updated_at();

drop trigger if exists chemicals_set_updated_at on public.chemicals;
create trigger chemicals_set_updated_at
before update on public.chemicals
for each row
execute procedure set_updated_at();

drop trigger if exists packing_materials_set_updated_at on public.packing_materials;
create trigger packing_materials_set_updated_at
before update on public.packing_materials
for each row
execute procedure set_updated_at();

-- Optional for local development without auth restrictions.
-- Prefer RLS policies in production.
alter table public.labels disable row level security;
alter table public.chemicals disable row level security;
alter table public.packing_materials disable row level security;
