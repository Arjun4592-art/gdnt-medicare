-- ============================================================
-- GDNT Medicare — Categories table
-- Run this once in Supabase Dashboard -> SQL Editor -> New Query.
-- Safe to re-run.
-- ============================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Category names are unique, ignoring upper/lower case ("Skin care" = "Skin Care")
create unique index if not exists categories_name_unique
  on categories (lower(name));

alter table categories enable row level security;

drop policy if exists "Public can view categories" on categories;
create policy "Public can view categories"
  on categories for select
  using (true);

drop policy if exists "Admins can manage categories" on categories;
create policy "Admins can manage categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Bring in every category your products already use, so nothing is lost.
insert into categories (name)
select distinct trim(category)
from products
where category is not null and trim(category) <> ''
on conflict do nothing;
