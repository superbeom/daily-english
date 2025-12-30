# Project History & Q&A Logs

> 최신 항목이 상단에 위치합니다.

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
