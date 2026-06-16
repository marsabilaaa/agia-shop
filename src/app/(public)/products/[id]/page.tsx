import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "@/components/products/AddToCartButton";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6 text-slate-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-slate-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="h-20 w-20 text-slate-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.stock < 10 && (
                  <Badge
                    variant="outline"
                    className="text-amber-500 border-amber-200"
                  >
                    Stok terbatas
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold text-slate-800 font-[family-name:var(--font-heading)]">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </p>

              {product.description && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Package className="h-4 w-4" />
                <span>
                  {product.stock > 0
                    ? `${product.stock} unit tersedia`
                    : "Stok habis"}
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <AddToCartButton product={product} />
              <p className="text-xs text-center text-slate-400">
                Tanya chatbot kami untuk rekomendasi produk lainnya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
