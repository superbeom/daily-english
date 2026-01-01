"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { getCategoryConfig } from "@/lib/ui-config";
import { CATEGORIES } from "@/lib/constants";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // URL 파라미터가 외부에서 변경될 때 (예: 뒤로가기 또는 태그 클릭) 동기화
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 0);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1); // -1 for tolerance
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, tag: null }); // 검색 시 기존 태그 필터는 해제
  };

  const clearSearch = () => {
    setSearchInput("");
    updateFilters({ search: null, tag: null });
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={
            currentTag
              ? `Filtering by tag: #${currentTag}`
              : "Search expressions..."
          }
          className="w-full pl-12 pr-12 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
        />
        {(searchInput || currentTag) && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      <div className="space-y-4">
        {/* Category Chips */}
        <div className="relative">
          {/* Left Fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-zinc-50 to-transparent dark:from-black z-10 pointer-events-none transition-opacity duration-300 ${
              showLeftFade ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Right Fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-zinc-50 to-transparent dark:from-black z-10 pointer-events-none transition-opacity duration-300 ${
              showRightFade ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 px-1"
          >
            <div className="flex gap-2 pr-2">
              {CATEGORIES.map((cat) => {
                const config =
                  cat === "all"
                    ? { Icon: Filter, textStyles: "text-zinc-500" }
                    : {
                        Icon: getCategoryConfig(cat).icon,
                        textStyles: getCategoryConfig(cat).textStyles,
                      };

                const isActive = currentCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => updateFilters({ category: cat })}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 cursor-pointer
                      ${
                        isActive
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black border-zinc-900 dark:border-zinc-100 shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }
                    `}
                  >
                    <config.Icon
                      className={`w-3.5 h-3.5 ${
                        !isActive && config.textStyles
                      }`}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
