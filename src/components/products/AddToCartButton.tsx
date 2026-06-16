"use client";

import { useCart } from "@/lib/cart";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  product: Product;
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.stock === 0) return;
    addItem(product);
    setAdded(true);
    toast.success(`${product.name} ditambahkan ke keranjang`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      className="w-full transition-all"
      size="lg"
      disabled={product.stock === 0}
      onClick={handleAdd}
    >
      {added ? (
        <>
          <Check className="h-4 w-4 mr-2" /> Ditambahkan!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
        </>
      )}
    </Button>
  );
}
