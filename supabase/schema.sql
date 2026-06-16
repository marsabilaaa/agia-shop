-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- PRODUCTS TABLE
create table products (
id uuid default uuid_generate_v4() primary key,
name text not null,
description text,
price numeric(12, 2) not null,
category text not null,
stock integer not null default 0,
image_url text,
created_at timestamptz default now(),
updated_at timestamptz default now()
);
-- CONVERSATIONS TABLE
create table conversations (
id uuid default uuid_generate_v4() primary key,
session_id text not null unique,
created_at timestamptz default now(),
updated_at timestamptz default now()
);
-- MESSAGES TABLE
create table messages (
id uuid default uuid_generate_v4() primary key,
conversation_id uuid references conversations(id) on delete cascade not null,
role text not null check (role in ('user', 'assistant')),
content text not null,
created_at timestamptz default now()
);
-- Index untuk performa
create index messages_conversation_id_idx on messages(conversation_id);
create index conversations_session_id_idx on conversations(session_id);
-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
new.updated_at = now();
return new;
end;
$$ language plpgsql;
create trigger update_products_updated_at
before update on products
for each row execute function update_updated_at_column();
create trigger update_conversations_updated_at
before update on conversations
for each row execute function update_updated_at_column();
-- RLS
alter table products enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
-- Products: public bisa baca, hanya authenticated (admin) bisa write
create policy "Products are viewable by everyone"
on products for select using (true);
create policy "Admins can insert products"
on products for insert
with check (auth.role() = 'authenticated');
create policy "Admins can update products"
on products for update
using (auth.role() = 'authenticated');
create policy "Admins can delete products"
on products for delete
using (auth.role() = 'authenticated');
-- Conversations & Messages: public bisa insert/read (untuk chatbot)
create policy "Anyone can create conversations"
on conversations for insert with check (true);
create policy "Anyone can view conversations"
on conversations for select using (true);
create policy "Anyone can update conversations"
on conversations for update using (true);
create policy "Anyone can create messages"
on messages for insert with check (true);
create policy "Anyone can view messages"
on messages for select using (true);
-- Seed: 
insert into products (name, description, price, category, stock, image_url) values
('Kemeja Oxford Putih', 'Kemeja oxford premium bahan katun 100%, cocok untuk formal maupun kasual.', 159000, 'Pakaian', 50, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'),
('Celana Chino Slim', 'Celana chino slim fit bahan stretch, nyaman dipakai seharian.', 219000, 'Pakaian', 35, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'),
('Sepatu Sneakers Putih', 'Sneakers kasual warna putih bersih, cocok dipadukan dengan outfit apapun.', 389000, 'Sepatu', 20, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
('Tas Ransel Laptop', 'Tas ransel kapasitas 25L, tahan air, kompartemen laptop 15 inch.', 299000, 'Tas', 15, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
('Hoodie Oversize Abu', 'Hoodie fleece tebal warna abu-abu, oversize fit.', 249000, 'Pakaian', 40, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500'),
('Topi Baseball Hitam', 'Topi baseball adjustable, bahan kanvas premium.', 89000, 'Aksesori', 60, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500');
