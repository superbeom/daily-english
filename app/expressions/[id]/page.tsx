import { getExpressionById } from "@/lib/expressions";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Revalidate this page every hour
export const revalidate = 3600;

export default async function ExpressionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const expression = await getExpressionById(id);

  if (!expression) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-8 sm:p-12">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Expression of the day
              </span>
              <time className="text-sm text-zinc-400">
                {new Date(expression.published_at).toLocaleDateString()}
              </time>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {expression.expression}
            </h1>
            <p className="text-2xl font-medium text-zinc-600 dark:text-zinc-400">
              {expression.meaning}
            </p>

            <div className="my-10 border-t border-zinc-100 dark:border-zinc-800" />

            <div className="space-y-8">
              <div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">
                  Conversation Example
                </h2>
                <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-800/50">
                  <p className="text-xl leading-relaxed text-zinc-800 dark:text-zinc-200">
                    &quot;{expression.example_en}&quot;
                  </p>
                  <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 font-medium">
                    &quot;{expression.example_kr}&quot;
                  </p>
                </div>
              </div>

              {expression.tags && expression.tags.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {expression.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {expression.origin_url && (
            <div className="bg-zinc-50 px-8 py-6 dark:bg-zinc-800/30 sm:px-12">
              <p className="text-sm text-zinc-500">
                Source:{" "}
                <a
                  href={expression.origin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-300"
                >
                  Original Blog Post ↗
                </a>
              </p>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
