"use client";

import { useEffect } from "react";

type MetaPurchaseEventProps = {
  orderId?: string;
  value: number;
};

export function MetaPurchaseEvent({ orderId, value }: MetaPurchaseEventProps) {
  useEffect(() => {
    if (!Number.isFinite(value) || value <= 0) return;

    const storageKey = orderId
      ? `faithwear-meta-purchase-${orderId}`
      : `faithwear-meta-purchase-${value}`;

    if (globalThis.sessionStorage?.getItem(storageKey)) return;

    const firePurchase = () => {
      if (!globalThis.fbq) return false;

      globalThis.fbq("track", "Purchase", {
        value,
        currency: "NPR",
      });
      globalThis.sessionStorage?.setItem(storageKey, "1");
      return true;
    };

    if (firePurchase()) return;

    const timeout = globalThis.setTimeout(firePurchase, 700);
    return () => globalThis.clearTimeout(timeout);
  }, [orderId, value]);

  return null;
}
