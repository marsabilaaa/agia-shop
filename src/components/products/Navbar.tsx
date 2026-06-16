import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartSheet from "@/components/cart/CartSheet";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-[var(--surface-border)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-[var(--text-primary)]" />
          <span className="text-xl font-bold text-[var(--text-primary)] heading">
            <span className="text-brand-gradient">AGIA Shop</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Link
            href="/"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Produk
          </Link>
          <CartSheet />
        </nav>

        <div className="md:hidden">
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
