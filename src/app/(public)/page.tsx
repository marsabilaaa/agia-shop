import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import ProductCard from "@/components/products/ProductCard";
import SearchFilter from "@/components/products/SearchFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";

type SearchParams = {
  search?: string;
  category?: string;
};

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

async function ProductGrid({ search, category }: SearchParams) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products, error } = await query;

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>Gagal memuat produk. Coba refresh halaman.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 space-y-3">
        <PackageSearch className="h-12 w-12 mx-auto text-slate-300" />
        <p className="font-medium">Produk tidak ditemukan</p>
        <p className="text-sm">Coba kata kunci atau kategori lain</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { search, category } = await searchParams;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 font-[family-name:var(--font-heading)]">
          Semua Produk
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Temukan produk terbaik pilihan kami
        </p>
      </div>

      {/* Search & Filter */}
      <Suspense>
        <SearchFilter />
      </Suspense>

      {/* Product Grid */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid search={search} category={category} />
      </Suspense>
    </div>
  );
}
