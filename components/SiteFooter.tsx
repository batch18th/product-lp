import Image from "next/image";
import Link from "next/link";
import { Mail, ShieldCheck, Truck } from "lucide-react";
import { product } from "@/lib/product";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e8e0d2] bg-[#070706] text-white">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.15fr_1fr] md:items-center">
        <div>
          <Link href="/" className="focus-ring inline-flex rounded-md">
            <Image
              src="/1000039114.png"
              alt={`${product.brandName} logo`}
              width={170}
              height={85}
              className="h-auto w-[130px] object-contain sm:w-[150px]"
            />
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-300">
            Premium Christian Bible Verse T-shirts with easy Cash on Delivery
            ordering across Nepal.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-neutral-200 sm:grid-cols-3 md:text-right">
          <div className="flex items-center gap-2 md:justify-end">
            <ShieldCheck size={18} className="text-[#f5c965]" />
            Cash on Delivery
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <Truck size={18} className="text-[#f5c965]" />
            Fast delivery
          </div>
          <a
            href={`mailto:${product.replyToEmail}`}
            className="focus-ring flex items-center gap-2 rounded-md md:justify-end"
          >
            <Mail size={18} className="text-[#f5c965]" />
            Support
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-shell text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} {product.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
