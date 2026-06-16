import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalProducts },
    { count: totalConversations },
    { count: totalMessages },
    { data: lowStock },
    { data: products },
    { data: categoryStats },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("conversations").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("name, stock")
      .lt("stock", 10)
      .order("stock"),
    supabase.from("products").select("price, stock"),
    supabase.from("products").select("category"),
  ]);

  // Hitung total nilai inventori
  const inventoryValue =
    products?.reduce((sum, p) => sum + p.price * p.stock, 0) ?? 0;

  // Hitung distribusi kategori
  const categoryCount =
    categoryStats?.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

  const sortedCategories = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1],
  );

  const maxCategoryCount = Math.max(...Object.values(categoryCount), 1);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Produk
            </CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-800">
              {totalProducts ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Nilai Inventori
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-800">
              {formatPrice(inventoryValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Percakapan
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-800">
              {totalConversations ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {totalMessages ?? 0} pesan total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Stok Menipis
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-800">
              {lowStock?.length ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">produk stok &lt; 10</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribusi Kategori */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-700">
              Distribusi Kategori
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedCategories.length === 0 ? (
              <p className="text-sm text-slate-400">Tidak ada data</p>
            ) : (
              sortedCategories.map(([cat, count]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-500 font-medium">
                      {count} produk
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / maxCategoryCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Stok Menipis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-700">
              Produk Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!lowStock || lowStock.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <p className="text-sm">Semua stok aman ✓</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {lowStock.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-700 truncate max-w-[200px]">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${(p.stock / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-amber-500 font-medium w-12 text-right">
                        Sisa {p.stock}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
