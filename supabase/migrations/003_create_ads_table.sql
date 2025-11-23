-- 広告管理テーブルの作成
create table if not exists public.ads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  ad_slot text not null,
  location text not null check (location in ('sidebar', 'article_top', 'article_bottom')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシーの設定
alter table public.ads enable row level security;

-- 一般ユーザーは有効な広告のみ閲覧可能
create policy "Anyone can view active ads"
  on public.ads for select
  using (is_active = true);

-- 認証済みユーザーは全ての広告を閲覧可能
create policy "Authenticated users can view all ads"
  on public.ads for select
  to authenticated
  using (true);

-- 認証済みユーザーは広告を作成可能
create policy "Authenticated users can create ads"
  on public.ads for insert
  to authenticated
  with check (true);

-- 認証済みユーザーは広告を更新可能
create policy "Authenticated users can update ads"
  on public.ads for update
  to authenticated
  using (true);

-- 認証済みユーザーは広告を削除可能
create policy "Authenticated users can delete ads"
  on public.ads for delete
  to authenticated
  using (true);

-- updated_at自動更新トリガー
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_ads_updated_at
  before update on public.ads
  for each row
  execute procedure public.handle_updated_at();
