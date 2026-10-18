create extension if not exists "uuid-ossp";

create table agents (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  momo_number text not null unique,
  momo_network text not null,
  referral_code text unique not null,
  balance_earned numeric(10,2) not null default 0,
  created_at timestamptz default now()
);
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  subdomain text unique not null,
  whatsapp_number text not null,
  owner_momo_number text not null,
  owner_momo_network text not null,
  paystack_subaccount_code text unique,
  is_active boolean default false,
  activation_fee_paid boolean default false,
  agent_id uuid references agents(id) on delete set null,
  created_at timestamptz default now()
);
create table products (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  name text not null, description text,
  price numeric(10,2) not null, image_url text,
  is_available boolean default true,
  created_at timestamptz default now()
);
create table orders (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  customer_name text not null, customer_phone text not null,
  total_amount numeric(10,2) not null,
  platform_fee numeric(10,2) default 0.20,
  vendor_amount numeric(10,2) not null,
  payment_status text default 'PENDING',
  paystack_reference text unique not null,
  items jsonb not null,
  created_at timestamptz default now()
);
create table payouts (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  amount numeric(10,2) not null,
  status text default 'PENDING', momo_reference text,
  created_at timestamptz default now()
);
create index on vendors(subdomain);
create index on vendors(agent_id);
create index on products(vendor_id);
create index on orders(vendor_id);

-- Atomic commission credit (avoids read-modify-write races)
create or replace function credit_agent(p_agent uuid, p_amount numeric) returns void
language sql as $$ update agents set balance_earned = balance_earned + p_amount where id = p_agent $$;

-- Lock everything down: only the server (service role) touches these tables.
alter table agents enable row level security;
alter table vendors enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table payouts enable row level security;
