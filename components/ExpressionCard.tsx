import Link from "next/link";
import { Expression } from "@/types/database";
import { getDictionary } from "@/lib/i18n";
import { formatDate } from "@/lib/i18n/format";

interface ExpressionCardProps {
  item: Expression;
  locale: string;
}

export function ExpressionCard({ item, locale }: ExpressionCardProps) {
  const dict = getDictionary(locale);
  const content = item.content[locale] || item.content["ko"];
  const meaning = item.meaning[locale] || item.meaning["ko"];

  return (
    <Link href={`/expressions/${item.id}`} className="block h-full">
      <div className="group h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {dict.card.label}
            </span>
            <span className="text-xs text-zinc-400">
              {formatDate(item.published_at, locale, {})}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {item.expression}
          </h3>
          <p className="mt-1 text-lg font-medium text-zinc-600 dark:text-zinc-400">
            {meaning}
          </p>
        </div>

        <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div>
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-tight">
              {dict.card.situationQuestion}
            </p>
            <p className="mt-1 text-zinc-800 dark:text-zinc-200 leading-relaxed line-clamp-2">
              {content?.situation || dict.card.noDescription}
            </p>
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
