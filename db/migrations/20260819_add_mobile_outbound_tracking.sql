alter table public.outbound_clicks
  add column if not exists operator text,
  add column if not exists plan_key text,
  add column if not exists data_gb integer,
  add column if not exists is_unlimited boolean,
  add column if not exists price integer,
  add column if not exists binding_months integer,
  add column if not exists sort_mode text;

alter table public.outbound_clicks
  alter column agreement_type drop not null,
  alter column annual_usage_kwh drop not null,
  alter column estimated_monthly_cost drop not null;

comment on column public.outbound_clicks.operator is
  'Mobile operator name for mobile outbound clicks. Nullable for non-mobile clicks.';

comment on column public.outbound_clicks.plan_key is
  'Mobile plan key for mobile outbound clicks. Nullable for non-mobile clicks.';

comment on column public.outbound_clicks.data_gb is
  'Included mobile data in GB for mobile outbound clicks. Null for unlimited data and non-mobile clicks.';

comment on column public.outbound_clicks.is_unlimited is
  'Whether the mobile plan has unlimited data. Nullable for non-mobile clicks.';

comment on column public.outbound_clicks.price is
  'Displayed monthly mobile plan price in SEK. Nullable for non-mobile clicks.';

comment on column public.outbound_clicks.binding_months is
  'Mobile plan binding period in months. Nullable for non-mobile clicks.';

comment on column public.outbound_clicks.sort_mode is
  'Mobile comparison sort mode at click time. Nullable for non-mobile clicks.';
