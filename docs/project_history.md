# Project History & Q&A Logs

> 최신 항목이 상단에 위치합니다.

## 2025-12-30: Supabase 연동 및 메인 UI 구현

### ✅ 진행 사항

- Supabase 클라이언트 설정 (`@supabase/ssr`) 및 환경 변수 템플릿(`.env.local.example`) 생성.
- `createBrowserSupabase`, `createServerSupabase` 유틸리티 함수 구현 (명확한 명명 규칙 적용).
- `Expression` 타입 정의 및 `ExpressionCard` UI 컴포넌트 구현.
- 메인 페이지(`app/page.tsx`) 데이터 페칭 및 ISR(1시간) 적용.

### 💬 주요 Q&A 및 의사결정

**Q. 왜 `createClient` 대신 `createBrowserSupabase`, `createServerSupabase`를 사용하나?**

- **A.** Next.js 환경에서 브라우저와 서버용 클라이언트의 역할(쿠키 접근 등)이 명확히 다르며, 한 파일에서 두 클라이언트를 동시에 다룰 때의 이름 충돌 및 혼동을 방지하기 위함.

**Q. 데이터가 없을 때의 처리는?**

- **A.** 개발 초기 단계에서 UI 확인을 위해 Mock 데이터를 Fallback으로 사용하도록 구현하였으며, 실제 DB 데이터가 있을 경우 이를 우선적으로 보여줌.

## 2025-12-30: 프로젝트 초기 설정 (Project Initialization)

### ✅ 진행 사항

- Next.js 15 + Tailwind CSS + TypeScript 프로젝트 생성 (`daily-english`).
- `src` 디렉토리 없는 구조 채택.
- 문서화 구조 수립 (`docs/` 폴더 내 컨텍스트, 히스토리, 워크스루).
- 데이터베이스 스키마 설계 (Supabase) 및 n8n 워크플로우 가이드 작성.

### 💬 주요 Q&A 및 의사결정

**Q. Next.js + n8n 아키텍처는 적합한가?**

- **A.** 매우 적합함. n8n이 백엔드/데이터 파이프라인 역할을 담당하고, Next.js는 뷰어 역할에 집중하여 효율적임.

**Q. LLM 비용 문제 (OpenAI vs Gemini)?**

- **A.** **Google Gemini 1.5 Flash**를 사용하기로 결정.
- 이유: OpenAI는 유료(종량제)인 반면, Gemini는 강력한 무료 티어(일 1,500회 요청 무료)를 제공하여 초기 운영 비용을 0원으로 만들 수 있음.

**Q. 프로젝트 폴더 구조는?**

- **A.** 최신 Next.js 트렌드에 맞춰 `src` 폴더 없이 루트에 `app`을 두는 구조로 진행.
