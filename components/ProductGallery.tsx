"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { product } from "@/lib/product";

export function ProductGallery() {
  const [active, setActive] = useState(0);
  const images = product.images;
  const current = images[active];

  const next = () => setActive((value) => (value + 1) % images.length);
  const previous = () =>
    setActive((value) => (value - 1 + images.length) % images.length);

  const alt = useMemo(
    () => `${product.displayName} design ${active + 1}`,
    [active],
  );

  return (
    <div className="space-y-4">
      <div className="card-surface relative overflow-hidden rounded-2xl bg-white">
        <div className="relative aspect-square">
          <Image
            src={current}
            alt={alt}
            fill
            className="object-contain p-5 sm:p-6"
            sizes="(max-width: 768px) 100vw, 48vw"
            priority={active === 0}
          />
        </div>
        <button
          type="button"
          aria-label="Previous product image"
          onClick={previous}
          className="focus-ring absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg transition hover:bg-[#d6a23a]"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next product image"
          onClick={next}
          className="focus-ring absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg transition hover:bg-[#d6a23a]"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`Show product image ${index + 1}`}
            onClick={() => setActive(index)}
            className={`focus-ring relative aspect-square overflow-hidden rounded-xl border bg-white transition ${
              active === index ? "border-[#d6a23a] ring-2 ring-[#d6a23a]" : "border-[#e8e0d2]"
            }`}
          >
            <Image
              src={image}
              alt={`${product.displayName} thumbnail ${index + 1}`}
              fill
              className="object-contain p-1"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
