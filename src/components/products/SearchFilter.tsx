"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const CATEGORIES = [
  "Pakaian",
  "Sepatu",
  "Tas",
  "Aksesori",
  "Elektronik",
  "Lainnya",
];

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset ke page 1 kalau filter berubah
      params.delete("page");
      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [searchParams, router],
  );

  const clearAll = () => {
    startTransition(() => {
      router.push("/");
    });
  };

  const hasFilter = search || category;

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9 bg-white"
          placeholder="Cari produk..."
          defaultValue={search}
          onChange={(e) => {
            const val = e.target.value;
            const timeout = setTimeout(() => updateParams("search", val), 400);
            return () => clearTimeout(timeout);
          }}
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
        )}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[var(--text-secondary)] font-medium">
          Kategori:
        </span>
        <button
          type="button"
          className={`chip-inactive rounded-full ${category === "" ? "chip-active" : ""}`}
          onClick={() => updateParams("category", "")}
        >
          Semua
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip-inactive rounded-full ${category === cat ? "chip-active" : ""}`}
            onClick={() =>
              updateParams("category", cat === category ? "" : cat)
            }
          >
            {cat}
          </button>
        ))}

        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={clearAll}
          >
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
