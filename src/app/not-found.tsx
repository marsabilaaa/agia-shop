import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <PackageSearch className="h-16 w-16 mx-auto text-slate-300" />
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="text-slate-500">Halaman tidak ditemukan</p>
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}
