# n8n Optimization Guide: AI-Driven Generation & Duplicate Check

이 문서는 외부 블로그 스크래핑 방식에서 벗어나, **AI가 스스로 카테고리별 유용한 표현을 선정하고 생성하는 방식**으로 전환하는 가이드입니다. 이 구조는 외부 의존성을 제거하여 워크플로우의 안정성을 극대화합니다.

## 🏗️ 목표 구조 (Target Architecture)

1.  **Schedule Trigger** (매일 9시 실행)
2.  **Code Node** (카테고리 랜덤 선택 - Business, Travel, Native Slang 등)
3.  **Gemini (Expression Generator)** (선택된 카테고리에 맞는 표현 1개 생성)
4.  **Supabase (Check Duplicate)** (DB 중복 확인)
5.  **If Node** (중복 여부 판단)
6.  **Gemini (Content Generator)** (상세 콘텐츠 생성 - 중복이 아닐 때만 실행)
7.  **Code Node (Parse JSON)** (Gemini 응답을 순수 JSON 객체로 변환)
8.  **Supabase (Insert)** (저장)

---

## 🛠️ 단계별 설정 가이드 (Step-by-Step)

### 1단계: 기존 HTTP Request 제거 및 Code 노드 추가

1.  기존의 `HTTP Request` 노드를 삭제합니다.
2.  **Code** 노드를 추가하고 이름을 `Pick Category`로 설정합니다.
3.  다음 코드를 입력하여 실행 때마다 카테고리를 랜덤하게 하나 뽑도록 합니다.

    ```javascript
    const categories = [
      "미국 원어민이 매일 쓰는 생활 표현",
      "비즈니스 미팅에서 꼭 필요한 영어 표현",
      "여행지에서 유용한 필수 영어 표현",
      "미드나 영화에 자주 나오는 트렌디한 표현",
      "감정을 표현하는 섬세한 영어 단어",
      "자주 틀리는 콩글리시 교정",
    ];

    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    return {
      json: {
        category: randomCategory,
      },
    };
    ```

### 2단계: Gemini Expression Generator 설정 (표현 생성)

`Pick Category` 노드 뒤에 **Google Gemini Chat Model** 노드를 연결합니다.

- **Name**: `Gemini Expression Generator`
- **Prompt**:

  ```text
  Role: Professional English Teacher
  Task: Suggest ONE useful English expression related to the category below.

  Category: {{ $('Pick Category').item.json.category }}

  Requirements:
  1. The expression must be practical and widely used.
  2. Output MUST be a clean JSON object.

  Output Format (JSON):
  {
    "expression": "Hold your horses",
    "meaning": "잠깐 기다리세요 / 진정하세요"
  }
  ```

### 3단계: Supabase 중복 체크 노드 추가

`Gemini Expression Generator` 뒤에 **Supabase** 노드를 추가합니다.

- **Name**: `Check Duplicate`
- **Operation**: `Get All`
- **Table**: `expressions`
- **Return All**: `True`
- **Limit**: `1`
- **Filters**:
  - **Column**: `expression`
  - **Operator**: `Equal`
  - **Value**: `{{ $('Gemini Expression Generator').item.json.expression }}`

### 4단계: If 노드 추가 (조건 분기)

`Check Duplicate` 뒤에 **If** 노드를 추가합니다.

- **Name**: `If New`
- **Conditions**:
  - Number: `{{ $items('Check Duplicate').length }}` **Equal** `0`
  - (데이터가 없으면 0이므로 새로운 표현임)

### 5단계: Gemini Content Generator 설정 (상세 내용 생성)

`If New` 노드의 **True** (위쪽) 출력에 새로운 **Google Gemini Chat Model** 노드를 연결합니다.

- **Name**: `Gemini Content Generator`
- **Prompt (Define below)**:

  ```text
  Role: Professional English Content Creator.
  Task: Create a detailed study card for the following English expression.

  Expression: {{ $('Gemini Expression Generator').item.json.expression }}
  Meaning: {{ $('Gemini Expression Generator').item.json.meaning }}
  Category: {{ $('Pick Category').item.json.category }}

  Requirements:
  1. Tone: Friendly, humorous, and engaging (target audience: 20-30s). Use emojis appropriately.
  2. Constraint: Do NOT address the reader as "Kids", "Students", or "Children". Use a general, relatable tone suitable for young adults.
  3. Output MUST be a valid JSON object matching the schema below.
  4. 'content' field must be a nested JSON object.
  5. Refer to the 'Example Output' below to maintain consistency in style and tone.

  Example Output (Reference this style):
  [
    {
      "expression": "under the weather",
      "meaning": "몸이 좀 안 좋아",
      "content": {
        "tip": "🚨 **꿀팁 방출!** 'under the weather'는 진짜 심각하게 아플 때보다는 가볍게 '컨디션이 안 좋다', '감기 기운이 있다' 정도의 느낌이에요. 😷 만약 진짜 심하게 아프다면 'I'm sick' 또는 'I have a fever'처럼 구체적으로 말하는 게 좋아요. 😉 그리고 이 표현은 뱃사람들이 배에서 날씨가 안 좋을 때 아픈 사람을 갑판 아래로 보내 '날씨 아래'에 있게 했다는 유래가 있대요! 완전 신기하죠? ⚓️🌊",
        "quiz": {
          "answer": "B",
          "question": "다음 중 'I'm feeling a bit under the weather.'와 가장 비슷한 상황은?\n\nA. 🥳 파티에서 신나게 춤추고 있다.\nB. 😴 침대에서 밍기적거리며 몸이 좀 으슬으슬하다.\nC. 🏋️‍♀️ 헬스장에서 역기를 들고 운동하고 있다."
        },
        "dialogue": [
          { "en": "Hey, you look a bit down. Are you okay?", "kr": "야, 너 좀 시무룩해 보인다. 괜찮아?" },
          { "en": "I'm feeling a bit under the weather today, so I think I'll just head home early.", "kr": "오늘 몸이 좀 안 좋아서, 일찍 집에 가려고 해." }
        ],
        "situation": "🌟 아침에 일어났는데 왠지 모르게 몸이 축 처지고, 컨디션이 별로일 때! 😱 '아, 나 오늘 뭔가 좀 별론데... 병든 병아리 같아...' 할 때 쓰는 핵인싸 표현이에요! 진짜 아픈 건 아닌데 그렇다고 완전 쌩쌩하지도 않을 때, 가볍게 내 상태를 말하고 싶을 때 찰떡같이 쓸 수 있답니다! 🤒✨"
      },
      "tags": ["daily", "health"]
    },
    {
      "expression": "I'm swamped.",
      "meaning": "일이 너무 많아서 정신없이 바빠요! 🤯",
      "content": {
        "tip": "'I'm busy'도 맞지만, 'swamped'는 '너무 바빠서 감당하기 힘들다'는 느낌을 더 강하게 전달해요. 😵‍💫 마치 일에 잠겨서 허우적거리는 그림을 떠올리면 좋아요. 시험 기간이나 마감일이 코앞일 때 써먹기 딱 좋답니다! 🚀",
        "quiz": {
          "answer": "swamped",
          "question": "주말에 약속이 있는데, 갑자기 일이 쏟아져서 못 갈 것 같아요. 이럴 때 쓸 수 있는 가장 적절한 표현은? 🤔 'I'm ______.'"
        },
        "dialogue": [
          { "en": "Hey, wanna grab some coffee after work?", "kr": "저기, 퇴근하고 커피 한 잔 할래요?" },
          { "en": "Oh, I'd love to, but I'm totally swamped with reports right now.", "kr": "아, 그러고 싶은데 지금 보고서 때문에 완전 정신이 없어요." }
        ],
        "situation": "가끔 업무나 과제, 약속이 한꺼번에 몰려서 정신이 하나도 없을 때 있죠? 😱 마치 늪에 빠진 것처럼 할 일이 머리 위까지 차오를 때! '나 완전 바빠요!' 대신 이 표현을 써보세요. 훨씬 생생하게 내 상황을 전달할 수 있어요. 😉"
      },
      "tags": ["daily", "emotion", "business"]
    },
    {
      "expression": "Hang in there!",
      "meaning": "힘내! / 버텨! / 조금만 더 참고 견뎌!",
      "content": {
        "tip": "이 표현은 'Keep going!' (계속해!), 'Don't give up!' (포기하지 마!)와 비슷한 뉘앙스를 가지고 있어요. 🗣️ 좌절하지 않고 끈기 있게 버티라는 응원의 메시지를 담고 있죠! 너무 심각한 상황보다는 친구나 동료에게 가볍게 용기를 줄 때 아주 유용하답니다! 😊 'Never give up!' 보다는 조금 더 부드러운 느낌이에요. 💖",
        "quiz": {
          "answer": "b) Hang in there!",
          "question": "중요한 시험이나 마감 직전 너무 힘들어하고 있을 때, '조금만 더 버텨! 넌 할 수 있어!'라고 응원하고 싶다면 다음 중 어떤 표현이 가장 적절할까요?"
        },
        "dialogue": [
          { "en": "I'm so stressed about this final exam. I just want to give up!", "kr": "나 이 시험 때문에 너무 스트레스받아. 그냥 포기하고 싶어!" },
          { "en": "Hang in there! You've studied so hard, I'm sure you'll do great!", "kr": "힘내! 너 정말 열심히 공부했잖아, 분명 잘할 거야!" }
        ],
        "situation": "시험 기간에 밤샘 공부하다가 지쳐 쓰러질 것 같을 때! 😵‍💫 아니면 새로운 도전에 직면해서 '아, 진짜 포기하고 싶다...'라는 생각이 들 때 있잖아요? 그럴 때 쓰는 마법의 주문이에요! ✨ '조금만 더 힘내!', '조금만 더 버텨!'라고 응원하고 싶을 때 이 표현이 딱이랍니다! 💪 마치 게임에서 마지막 보스를 잡으러 가는 길에 서로에게 포기하지 말라고 외치는 것과 같아요! 🎮"
      },
      "tags": ["daily", "encouragement", "friends", "motivation", "study"]
    }
  ]

  Output Format (JSON):
  {
    "expression": "Expression here",
    "meaning": "Korean meaning",
    "content": {
      "situation": "Detailed description of the situation where this expression is used (in Korean).",
      "dialogue": [
        { "en": "English sentence A", "kr": "Korean translation A" },
        { "en": "English sentence B", "kr": "Korean translation B" }
      ],
      "tip": "Usage tips, nuances, or similar expressions (in Korean).",
      "quiz": {
        "question": "A short quiz question",
        "answer": "Answer"
      }
    },
    "tags": ["tag1", "tag2", "Category Name"]
  }
  ```

### 6단계: JSON Parsing (문자열 -> JSON 변환)

Gemini가 JSON을 문자열(`text`)로 반환할 경우를 대비하여 **Code** 노드를 추가합니다.
`Gemini Content Generator`와 `Supabase Insert` 사이에 연결하세요.

- **Name**: `Parse JSON`
- **Code**:

  ````javascript
  // Gemini의 응답에서 JSON 문자열 부분만 추출하여 파싱합니다.
  const rawText = $input.first().json.text;
  // 마크다운 코드 블록(```json ... ```) 제거
  const cleanJson = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return {
      json: JSON.parse(cleanJson),
    };
  } catch (error) {
    return {
      json: {
        error: "JSON Parsing Failed",
        raw: rawText,
      },
    };
  }
  ````

### 7단계: Supabase Insert 설정

`Parse JSON` 노드 뒤에 **Supabase** 노드를 연결하여 최종 데이터를 저장합니다.

- **Operation**: `Create`
- **Table**: `expressions`
- **Columns to Ignore**: `id`, `created_at` (DB 자동 생성)
- **Mapping**: `Parse JSON`의 JSON 출력값을 각 컬럼(`expression`, `meaning`, `content`, `tags`)에 매핑합니다.

---

## ✅ 완료 확인

1.  **Execute Workflow**를 실행합니다.
2.  `Pick Category`가 랜덤한 주제를 뽑고, Gemini가 그에 맞는 표현을 생성하는지 확인합니다.
3.  이미 DB에 있는 표현이라면 `If New`에서 False로 빠지는지 확인합니다.
