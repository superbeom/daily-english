# n8n Workflow Guide

이 문서는 n8n을 사용하여 영어 블로그를 자동화하는 워크플로우 설정을 안내합니다.

## 🏗️ 전체 워크플로우 구조

1. **Schedule Trigger**: 주기적 실행 (예: 매일 오전 9시)
2. **HTTP Request**: 블로그 URL에서 HTML 가져오기
3. **Gemini Node (LLM)**: 가져온 텍스트에서 표현 추출 및 가공
4. **Supabase Node**: 가공된 데이터를 DB에 저장

---

## 🤖 Gemini API 설정 (무료)

1. [Google AI Studio](https://aistudio.google.com/)에서 API Key를 발급받습니다.
2. n8n에서 `Google Gemini Chat Model` 노드를 추가하고 API Key를 등록합니다.
3. 모델은 `gemini-1.5-flash`를 권장합니다. (가장 빠르고 무료 티어가 넉넉함)

---

## ✍️ AI 프롬프트 (가공 양식)

Gemini 노드의 프롬프트에 아래 내용을 입력하여 일관된 데이터를 얻습니다.

**Prompt:**

```text
당신은 최고의 영어 교육 콘텐츠 에디터입니다.
제공된 HTML 텍스트에서 학습자가 배우기에 가장 유용한 실용 영어 표현을 딱 하나만 선정해주세요.

결과는 반드시 아래의 JSON 형식으로만 답변하세요:
{
  "expression": "영어 표현",
  "meaning": "한국어 뜻",
  "example_en": "영어 예문 (표현이 포함된 자연스러운 문장)",
  "example_kr": "위 예문의 한국어 해석",
  "tags": ["카테고리1", "카테고리2"]
}

입력 데이터: {{ $json.body }}
```

---

## 🔗 데이터 연동 (Supabase)

n8n의 `Supabase` 노드를 사용하여 추출된 JSON 데이터를 `expressions` 테이블에 Insert 합니다.

- **Table**: `expressions`
- **Columns**: `expression`, `meaning`, `example_en`, `example_kr`, `origin_url`

---

## 💡 팁

- **Duplicate Check**: 동일한 표현이 이미 DB에 있는지 확인하는 로직을 n8n에서 추가하면 중복 포스팅을 방지할 수 있습니다.
- **HTML Cleanup**: 스크래핑한 데이터가 너무 크면 토큰 제한에 걸릴 수 있으므로, HTML 노드에서 `main`이나 `article` 태그만 추출하는 것이 좋습니다.
