/** 
* USERS -> CUSTOMERS
* Note: in this app, Organizations are the entities that subscribe.
* So the 'customers' table will map organization_id to stripe_customer_id
*/

create table customers (
  -- this is the organization_id
  id uuid references organizations(id) not null primary key,
  stripe_customer_id text
);

alter table customers enable row level security;
-- No policies for now, only service role should act on this usually, or read-only for users in org.

/** 
* PRODUCTS
* Note: This is an exact mirror of Stripe's Product object. 
*/
create table products (
  id text primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);

alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/** 
* PRICES
* Note: This is an exact mirror of Stripe's Price object. 
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');

create table prices (
  id text primary key,
  product_id text references products(id),
  active boolean,
  description text,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type pricing_type,
  interval pricing_plan_interval,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);

alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/** 
* SUBSCRIPTIONS
* Note: subscriptions are linked to an organization_id
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');

create table subscriptions (
  id text primary key,
  organization_id uuid references organizations(id) not null,
  status subscription_status,
  metadata jsonb,
  price_id text references prices(id),
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  trial_end timestamp with time zone default timezone('utc'::text, now())
);

alter table subscriptions enable row level security;

create policy "Can only view own organization's subscriptions." on subscriptions for select
  using (
    exists (
      select 1 from user_organizations uo
      where uo.organization_id = subscriptions.organization_id
      and uo.user_id = auth.uid()
    )
  );
