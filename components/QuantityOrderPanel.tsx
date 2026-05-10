"use client";

import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { formatMoney, getOrderTotal, product } from "@/lib/product";
import { OrderButton } from "./OrderButton";

export function QuantityOrderPanel() {
  const [quantity, setQuantity] = useState(1);
  const totals = getOrderTotal(quantity);

  return (
    <div className="card-surface rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e8e0d2] pb-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#a97918]">
            Today&apos;s Offer
          </p>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-3xl font-black text-black">
              {formatMoney(product.offerPrice)}
            </span>
            <span className="text-lg text-neutral-500 line-through">
              {formatMoney(product.regularPrice)}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-[#080808] px-3 py-2 text-sm font-bold text-[#f5c965]">
          Buy 3, Save 10%
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Quantity</span>
          <div className="flex items-center rounded-xl border border-[#ded4c4] bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="focus-ring grid size-11 place-items-center transition hover:bg-[#fff5dc]"
            >
              <Minus size={18} />
            </button>
            <span className="grid h-11 w-14 place-items-center border-x border-[#ded4c4] font-bold">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => value + 1)}
              className="focus-ring grid size-11 place-items-center transition hover:bg-[#fff5dc]"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        <PriceLine label="Subtotal" value={formatMoney(totals.subtotal)} />
        <PriceLine
          label="Combo discount"
          value={totals.discount > 0 ? `-${formatMoney(totals.discount)}` : formatMoney(0)}
        />
        <PriceLine label="Delivery fee" value="Free" />
        <div className="flex items-center justify-between border-t border-[#e8e0d2] pt-3 text-xl font-black">
          <span>Total</span>
          <span>{formatMoney(totals.total)}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <OrderButton quantity={quantity} label="Purchase Now" />
        <OrderButton quantity={quantity} label="Buy Now" variant="dark" />
      </div>

      <div className="mt-5 grid gap-3 text-sm font-semibold text-[#645f58] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-[#a97918]" />
          Fast delivery
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#a97918]" />
          Cash on Delivery
        </div>
      </div>
    </div>
  );
}

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-neutral-700">
      <span>{label}</span>
      <span className="font-semibold text-black">{value}</span>
    </div>
  );
}
