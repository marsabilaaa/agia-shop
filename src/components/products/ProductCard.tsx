import Link from "next/link";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

type Props = {
  product: Product;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--surface-border)] card-hover transition-all duration-200 overflow-hidden group">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-slate-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-slate-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-slate-800 text-sm leading-snug line-clamp-2">
              {product.name}
            </h3>
            <Badge className="badge-brand text-xs shrink-0">
              {product.category}
            </Badge>
          </div>

          {product.description && (
            <p className="text-xs text-slate-400 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-[var(--brand-red)]">
              {formatPrice(product.price)}
            </span>
            <span
              className={`text-xs ${product.stock < 10 ? "text-amber-500" : "text-slate-400"}`}
            >
              {product.stock < 10
                ? `Sisa ${product.stock}`
                : `Stok ${product.stock}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
