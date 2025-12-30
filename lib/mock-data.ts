import { Expression } from "@/types/database.types";

export const MOCK_EXPRESSIONS: Expression[] = [
  {
    id: "1",
    expression: "Break a leg",
    meaning: "행운을 빌어",
    example_en: "You have a big presentation today? Break a leg!",
    example_kr: "오늘 중요한 발표가 있다고요? 행운을 빌어요!",
    tags: ["daily", "idiom"],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    expression: "Under the weather",
    meaning: "몸 상태가 좋지 않은",
    example_en:
      "I'm feeling a bit under the weather today, so I think I'll stay home.",
    example_kr: "오늘 몸이 좀 안 좋아서 집에 있어야 할 것 같아요.",
    tags: ["health", "daily"],
    published_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    expression: "Bite the bullet",
    meaning: "어려움을 참다, 울며 겨자 먹기로 하다",
    example_en:
      "I hate going to the dentist, but I'll just have to bite the bullet.",
    example_kr: "치과 가는 건 정말 싫지만, 그냥 꾹 참고 다녀와야겠어.",
    tags: ["idiom", "resilience"],
    published_at: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];
