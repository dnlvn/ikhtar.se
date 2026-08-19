alter table public.outbound_clicks
  add column if not exists adset_id text,
  add column if not exists ad_id text;

comment on column public.outbound_clicks.adset_id is
  'Meta ad set id captured from landing URL parameter adset_id when marketing consent is granted. Nullable for non-Meta traffic and historical rows.';

comment on column public.outbound_clicks.ad_id is
  'Meta ad id captured from landing URL parameter ad_id when marketing consent is granted. Nullable for non-Meta traffic and historical rows.';
