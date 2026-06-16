import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartSheet from "@/components/cart/CartSheet";

export default function Navbar() {
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-slate-800" />
          <span className="text-xl font-bold text-slate-800 font-[family-name:var(--font-heading)]">
            AGIA Shop
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Produk
          </Link>
          <CartSheet />
        </nav>
      </div>
    </header>
  );
}
