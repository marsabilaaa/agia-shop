"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  "Pakaian",
  "Sepatu",
  "Tas",
  "Aksesori",
  "Elektronik",
  "Lainnya",
];

type Props = {
  product?: Product
  onSuccess: (action: 'add' | 'edit') => void
  onCancel?: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    category: product?.category ?? "",
    stock: product?.stock?.toString() ?? "",
    image_url: product?.image_url ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      category: form.category,
      stock: parseInt(form.stock),
      image_url: form.image_url.trim() || null,
    };

    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      setError("Gagal menyimpan produk. Coba lagi.");
      setLoading(false);
      return;
    }

    router.refresh();
    onSuccess(product ? 'edit' : 'add');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Kemeja Oxford Putih"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Deskripsi produk..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Harga (Rp) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="1000"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="159000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stok *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            placeholder="50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Kategori *</Label>
        <Select
          value={form.category}
          onValueChange={(val) => handleChange("category", val)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL Gambar</Label>
        <Input
          id="image_url"
          type="url"
          value={form.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
            </>
          ) : product ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Produk"
          )}
        </Button>
      </div>
    </form>
  );
}
