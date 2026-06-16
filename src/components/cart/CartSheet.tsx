"use client";

import { useCart } from "@/lib/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    toast.success("Pesanan berhasil dibuat! (Demo)", {
      description: `${totalItems()} item senilai ${formatPrice(totalPrice())}`,
    });
    clearCart();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems() > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
              {totalItems() > 9 ? "9+" : totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Keranjang ({totalItems()} item)
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <ShoppingCart className="h-12 w-12 text-slate-200" />
              <p className="text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-slate-50 rounded-xl"
              >
                {/* Image */}
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatPrice(product.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (quantity >= product.stock) {
                          toast.error("Stok tidak mencukupi");
                          return;
                        }
                        updateQuantity(product.id, quantity + 1);
                      }}
                      className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Subtotal + delete */}
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => {
                      removeItem(product.id);
                      toast.success("Item dihapus dari keranjang");
                    }}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-800">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Checkout (Demo)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-400"
              onClick={() => {
                clearCart();
                toast.success("Keranjang dikosongkan");
              }}
            >
              Kosongkan Keranjang
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
