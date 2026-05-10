"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { product } from "@/lib/product";

const navItems = [
  { label: "Product", href: "/#order" },
  { label: "Benefits", href: "/#benefits" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070706]/94 text-white shadow-[0_10px_35px_rgba(0,0,0,0.16)] backdrop-blur-md">
      <div className="container-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <Image
            src="/1000039114.png"
            alt={`${product.brandName} logo`}
            width={148}
            height={74}
            className="h-auto w-[106px] object-contain sm:w-[128px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-neutral-200 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md transition hover:text-[#f5c965] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6a23a]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/checkout"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#d6a23a] px-5 text-sm font-black uppercase tracking-wide text-black shadow-[0_12px_28px_rgba(214,162,58,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f1bd53]"
          >
            <ShoppingBag size={17} aria-hidden="true" />
            Order Now
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid size-10 place-items-center rounded-xl border border-white/15 text-white md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#070706] md:hidden">
          <div className="container-shell grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              className="rounded-md px-1 py-2 text-sm font-semibold text-neutral-200 transition hover:text-[#f5c965]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="focus-ring mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d6a23a] px-4 text-sm font-black uppercase tracking-wide text-black"
            >
              <ShoppingBag size={17} aria-hidden="true" />
              Order Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
