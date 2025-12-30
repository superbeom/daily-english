# Database Schema (Supabase)

이 프로젝트는 Supabase를 데이터베이스로 사용합니다. 아래 SQL을 Supabase SQL Editor에서 실행하여 테이블을 생성하세요.

## 1. Expressions Table

영어 표현과 예문을 저장하는 핵심 테이블입니다.
v0.2 업데이트: 대화문(dialogue), 상황(situation) 등 풍부한 콘텐츠를 담기 위해 구조를 개선했습니다.

```sql
create table expressions (
  id uuid default gen_random_uuid() primary key,
  expression text not null,                -- 영어 표현 (예: "Break a leg")
  meaning text not null,                   -- 한국어 뜻
  content jsonb not null default '{}'::jsonb, -- 상세 콘텐츠 (situation, dialogue, tip, quiz 등)
  origin_url text,                         -- 스크래핑한 원본 URL
  tags text[],                             -- 태그 (예: business, daily)
  published_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 인덱스 설정 (검색 성능 향상)
create index idx_expressions_published_at on expressions (published_at desc);
create index idx_expressions_tags on expressions using gin (tags); -- GIN index for array
create index idx_expressions_content on expressions using gin (content); -- GIN index for jsonb
```

### Content JSONB Structure

```json
{
  "situation": "상황 설명 텍스트",
  "dialogue": [
    {"en": "Speaker A English", "kr": "A 해석"},
    {"en": "Speaker B English", "kr": "B 해석"}
  ],
  "tip": "유용한 팁이나 뉘앙스",
  "quiz": {"question": "...", "answer": "..."}
}
```

## 2. Scraping Targets Table (Optional)

스크래핑할 URL 리스트를 관리하고 싶다면 아래 테이블을 추가로 사용하세요.

```sql
create table scraping_targets (
  id uuid default gen_random_uuid() primary key,
  url text not null unique,
  site_name text,
  is_active boolean default true,
  last_scraped_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
```
