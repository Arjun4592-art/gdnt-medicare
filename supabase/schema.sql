-- ============================================================
-- GDNT Medicare — Supabase Database Schema
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  type text not null,              -- Tablets, Syrup, Capsules, Ointment
  pack_size text not null,         -- e.g. "10x10", "100ml"
  composition text not null,       -- salt/composition
  description text,
  price numeric(10,2) not null,
  mrp numeric(10,2) not null,
  stock_quantity integer not null default 0,
  reorder_level integer not null default 15,
  rating numeric(2,1) default 4.5,
  reviews_count integer default 0,
  image_url text,                  -- Supabase Storage URL (first/main image — kept for backward compat)
  images text[] default '{}',      -- Up to 4 Supabase Storage URLs, shown as product gallery
  is_active boolean default true,  -- show/hide on public site
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- If you already ran this schema before the `images` column existed,
-- this adds it without touching your existing data (safe to re-run).
alter table products add column if not exists images text[] default '{}';

-- ============================================================
-- ENQUIRIES TABLE (contact form + product enquiry submissions)
-- ============================================================
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  store_name text,
  phone text not null,
  email text,
  product_name text,               -- what they enquired about (optional)
  product_id uuid references products(id) on delete set null,
  message text,
  status text not null default 'New' check (status in ('New', 'Responded')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table products enable row level security;
alter table enquiries enable row level security;

-- Public (anonymous) users can READ active products only
create policy "Public can view active products"
  on products for select
  using (is_active = true);

-- Public (anonymous) users can INSERT enquiries (submit contact form)
create policy "Public can submit enquiries"
  on enquiries for insert
  with check (true);

-- Authenticated admins can do everything on products
create policy "Admins can manage products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Authenticated admins can view/update all enquiries
create policy "Admins can manage enquiries"
  on enquiries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- No seed data — your products table starts empty.
-- Add real products via the Admin Dashboard (/admin) once you've
-- created your admin login (see SUPABASE_SETUP.md step 4).
-- ============================================================

-- ============================================================
-- STORAGE BUCKET for product images
-- 1. Go to Storage tab in Supabase Dashboard → Create bucket "product-images" → Public bucket: ON
-- 2. Then run the policies below so the admin dashboard can upload (and the
--    public site can view) product photos.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
