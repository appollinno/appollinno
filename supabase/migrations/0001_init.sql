-- Appollo Coffee Shop — initial schema
-- Postgres / Supabase. Run via `supabase db push` or the Supabase SQL editor.
-- This migration is documentation + a ready-to-apply schema; it is not yet
-- connected to a live Supabase project (see docs/ARCHITECTURE.md).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Customers (profile row linked 1:1 to Supabase Auth's auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  region text,
  postal_code text not null,
  country text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories (id),
  tagline text,
  description text,
  origin_country text,
  origin_region text,
  farm_or_cooperative text,
  altitude_min_m int,
  altitude_max_m int,
  roast_level text check (roast_level in ('Light', 'Medium', 'Medium-Dark', 'Dark')),
  process text check (process in ('Washed', 'Natural', 'Honey', 'Anaerobic')),
  tasting_notes text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  weight_grams int not null,
  label text not null,
  price_cents int not null check (price_cents >= 0),
  compare_at_price_cents int,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  variant_id uuid primary key references public.product_variants (id) on delete cascade,
  stock_on_hand int not null default 0 check (stock_on_hand >= 0),
  reorder_threshold int not null default 10,
  updated_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.coupons (
  code text primary key,
  discount_percent numeric(5, 2) not null check (discount_percent > 0 and discount_percent <= 100),
  active boolean not null default true,
  expires_at timestamptz
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers (id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal_cents int not null,
  discount_cents int not null default 0,
  shipping_cents int not null default 0,
  tax_cents int not null default 0,
  total_cents int not null,
  coupon_code text references public.coupons (code),
  shipping_address jsonb not null,
  payment_provider text,
  payment_reference text,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'authorized', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  product_name text not null,
  variant_label text not null,
  unit_price_cents int not null,
  quantity int not null check (quantity > 0)
);

-- ---------------------------------------------------------------------------
-- Saved products / wishlists
-- ---------------------------------------------------------------------------
create table if not exists public.saved_products (
  customer_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, product_id)
);

-- ---------------------------------------------------------------------------
-- CMS: journal articles, promo banners
-- ---------------------------------------------------------------------------
create table if not exists public.journal_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  category text,
  cover_image_url text,
  body jsonb not null default '[]',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_banners (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subtext text,
  cta_label text,
  cta_href text,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_product_variants_product on public.product_variants (product_id);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_orders_customer on public.orders (customer_id);
create index if not exists idx_product_reviews_product on public.product_reviews (product_id);

-- ---------------------------------------------------------------------------
-- Row Level Security (customers can only read/write their own data)
-- ---------------------------------------------------------------------------
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.saved_products enable row level security;

create policy "Customers read own profile" on public.customers
  for select using (auth.uid() = id);
create policy "Customers update own profile" on public.customers
  for update using (auth.uid() = id);

create policy "Customers manage own addresses" on public.addresses
  for all using (auth.uid() = customer_id);

create policy "Customers read own orders" on public.orders
  for select using (auth.uid() = customer_id);

create policy "Customers manage own saved products" on public.saved_products
  for all using (auth.uid() = customer_id);

-- Products, categories, reviews, journal and banners are public read;
-- writes are restricted to the service role (used by the admin dashboard).
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.categories enable row level security;
alter table public.journal_articles enable row level security;

create policy "Public read products" on public.products for select using (true);
create policy "Public read variants" on public.product_variants for select using (true);
create policy "Public read images" on public.product_images for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read journal" on public.journal_articles for select using (true);
