-- Initial schema for migration start (template_repo aligned)
create schema if not exists app;

-- Projects table
create table if not exists app.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  wedding_date date,
  guest_count integer not null default 80,
  region text not null default 'Nordrhein-Westfalen',
  total_budget numeric(12,2) not null default 25000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Expenses table
create table if not exists app.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references app.projects(id) on delete cascade,
  category_key text not null,
  item text not null,
  estimated numeric(12,2) not null default 0,
  actual numeric(12,2) not null default 0,
  paid boolean not null default false,
  comment text,
  is_per_person boolean not null default false,
  cost_per_person numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_expenses_project_id on app.expenses(project_id);

-- Grants for API access (if app schema is exposed in Supabase settings)
grant usage on schema app to anon, authenticated, service_role;
grant all on all tables in schema app to anon, authenticated, service_role;
alter default privileges in schema app grant all on tables to anon, authenticated, service_role;
grant all on all sequences in schema app to anon, authenticated, service_role;
alter default privileges in schema app grant all on sequences to anon, authenticated, service_role;
