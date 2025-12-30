import { ExpressionCard } from "@/components/ExpressionCard";
import { getExpressions } from "@/lib/expressions";
import { Expression } from "@/types/database.types";

// Revalidate every hour
export const revalidate = 3600;

// Mock data as fallback for development
const MOCK_EXPRESSIONS: Expression[] = [
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

export default async function Home() {
  const expressionsFromDb = await getExpressions();
  const expressions =
    expressionsFromDb.length > 0 ? expressionsFromDb : MOCK_EXPRESSIONS;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Daily English
            </h1>
            <nav className="flex items-center gap-4">
              <span className="text-sm text-zinc-500">
                Every day, one new expression.
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Today&apos;s Expressions
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Learn useful English expressions collected from top blogs.
          </p>
        </div>

        {expressions.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">
              No expressions found. Come back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expressions.map((item) => (
              <ExpressionCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Daily English. Powered by n8n & Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
}
