# Implementation Walkthrough

> 각 버전별 구현 내용과 변경 사항을 상세히 기록합니다. 최신 버전이 상단에 옵니다.

## v0.2.0: 메인 UI 및 데이터 페칭 구현 (2025-12-30)

### 1. 데이터 타입 정의

- **`types/database.types.ts`**: `Expression` 인터페이스 정의.

### 2. UI 컴포넌트 구현

- **`components/ExpressionCard.tsx`**: 개별 영어 표현을 보여주는 카드 UI. Tailwind CSS 활용.

### 3. 데이터 페칭 로직 (SSR/ISR)

- **`lib/expressions.ts`**: Supabase에서 표현 리스트를 가져오는 서버 측 함수 구현.
- **`app/page.tsx`**:
  - `getExpressions`를 사용하여 서버 컴포넌트에서 데이터 페칭.
  - `export const revalidate = 3600` 설정을 통해 1시간 간격 ISR 적용.
  - 데이터가 없을 경우를 대비한 Mock 데이터 fallback 및 Empty State UI 구현.

## v0.1.1: Supabase 클라이언트 및 환경 설정 (2025-12-30)

### 1. 의존성 설치

- `@supabase/ssr`, `@supabase/supabase-js` 패키지 설치.

### 2. Supabase 클라이언트 유틸리티 구현

- **`lib/supabase/client.ts`**: `createBrowserSupabase` - 브라우저 환경용 클라이언트 설정.
- **`lib/supabase/server.ts`**: `createServerSupabase` - 서버 컴포넌트 및 SSR용 클라이언트 설정 (Next.js 15+ `cookies()` 비동기 대응).

### 3. 환경 변수 템플릿 생성

- **`.env.local.example`**: 프로젝트 URL 및 Anon Key 설정을 위한 템플릿 파일 추가.

## v0.1.0: 프로젝트 스캐폴딩 및 설계 (2025-12-30)

- Command: `npx create-next-app@latest daily-english --ts --tailwind --eslint --app --no-src-dir`
- 기본 설정: TypeScript, Tailwind CSS, App Router 사용.

### 2. 문서화 (Documentation)

- **`docs/database_schema.md`**: Supabase `expressions` 테이블 스키마 정의 (UUID, 영어 표현, 뜻, 예문 등).
- **`docs/n8n_workflow_guide.md`**: n8n 자동화 로직 설계 (HTTP Request -> Gemini AI -> Supabase).
- **`docs/project_context.md`**: 프로젝트 규칙 및 아키텍처 정의.

### 3. 향후 계획 (Next Steps)

- Supabase 프로젝트 생성 및 테이블 실제 적용.
- Next.js에서 Supabase 클라이언트 연동 (`@supabase/ssr` 패키지 설치 예정).
- 메인 페이지 UI 구현 (카드 리스트 형태).
