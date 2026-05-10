"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { product, getOrderTotal } from "@/lib/product";

type OrderButtonProps = {
  quantity?: number;
  label?: string;
  variant?: "gold" | "dark" | "light";
  className?: string;
};

export function OrderButton({
  quantity = 1,
  label = "Order Now",
  variant = "gold",
  className = "",
}: OrderButtonProps) {
  const { total } = getOrderTotal(quantity);
  const params = new URLSearchParams({
    productName: product.displayName,
    quantity: String(quantity),
    pricePerPiece: String(product.offerPrice),
    totalPrice: String(total),
  });

  const styles = {
    gold:
      "bg-[#d6a23a] text-black hover:bg-[#f1bd53] shadow-[0_14px_34px_rgba(214,162,58,0.25)]",
    dark: "bg-[#080808] text-white hover:bg-[#24211d] shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
    light: "bg-white text-black hover:bg-[#fff5dc] shadow-[0_10px_28px_rgba(0,0,0,0.1)]",
  };

  return (
    <Link
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black uppercase tracking-wide transition hover:-translate-y-0.5 sm:min-h-[3.25rem] sm:px-6 ${styles[variant]} ${className}`}
      href={`/checkout?${params.toString()}`}
    >
      <ShoppingBag size={18} aria-hidden="true" />
      {label}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}
