-- Run this in Supabase SQL Editor

create table if not exists products (
  id          bigint primary key generated always as identity,
  name        text not null,
  category    text not null default 'Микрофоны',
  brand       text,
  price       integer not null default 0,
  images      text[] default '{}',
  description text,
  in_stock    boolean default true,
  badge       text check (badge in ('hot','new','low_stock','recommended') or badge is null),
  rating      numeric(2,1),
  reviews     integer,
  use_cases   text[] default '{}',
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- Allow public read
alter table products enable row level security;

create policy "Public read" on products
  for select using (true);

create policy "Auth insert/update/delete" on products
  for all using (auth.role() = 'anon');

-- Allow anon full access (for admin panel without auth)
drop policy if exists "Auth insert/update/delete" on products;
create policy "Anon full access" on products
  for all to anon using (true) with check (true);
