import Image from "next/image";
import {
  CheckCircle2,
  Gift,
  Headphones,
  Heart,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { OrderButton } from "@/components/OrderButton";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantityOrderPanel } from "@/components/QuantityOrderPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatMoney, product } from "@/lib/product";

const trustItems = [
  { label: "Cash on Delivery available", icon: ShieldCheck },
  { label: "Fast delivery across Nepal", icon: Truck },
  { label: "Friendly customer support", icon: Headphones },
  { label: "Easy order process", icon: PackageCheck },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#fbfaf7]">
        <Hero />
        <TrustBar />
        <Showcase />
        <Benefits />
        <Testimonials />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="soft-grid bg-[#080808] text-white">
      <div className="container-shell grid min-h-[calc(84vh-4rem)] items-center gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_0.86fr] lg:gap-14 lg:py-16">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-[#d6a23a]/35 bg-[#d6a23a]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f5c965]">
            Cash on Delivery available
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.04] sm:text-5xl lg:text-[3.6rem]">
            {product.headline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-200 sm:text-lg lg:text-xl">
            {product.subheadline}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
            {product.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <OrderButton label="Purchase Now" />
            <OrderButton label="Order Now" variant="light" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-200">
            <span className="font-bold text-[#f7d57b]">
              Offer Price: {formatMoney(product.offerPrice)}
            </span>
            <span className="line-through">{formatMoney(product.regularPrice)}</span>
            <span>Free delivery</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[380px] lg:max-w-[410px]">
          <div className="absolute inset-8 rounded-full bg-[#c99a35]/18 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-[#d6a23a]/30 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-square">
              <Image
                src={product.images[0]}
                alt={`${product.displayName} hero`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 86vw, 440px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-[#e8e0d2] bg-white py-5">
      <div className="container-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg px-1 py-1">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff5dc] text-[#a97918]">
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-[#26221d]">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="order" className="section-pad bg-[#fbfaf7]">
      <div className="container-shell grid items-center gap-9 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
        <ProductGallery />
        <div className="flex flex-col justify-center">
          <p className="section-kicker">Product Showcase</p>
          <h2 className="section-title mt-3">
            {product.displayName}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-[#645f58]">{product.description}</p>
          <ul className="mt-5 grid gap-3">
            {product.benefits.slice(0, 4).map((benefit) => (
              <li key={benefit} className="flex gap-3 text-sm font-semibold text-[#26221d]">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#a97918]" size={18} />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <QuantityOrderPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const icons = [Sparkles, Heart, Gift, ShieldCheck, PackageCheck, Truck];

  return (
    <section id="benefits" className="section-pad bg-white">
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">Why Buy This Product</p>
          <h2 className="section-title mt-3">
            A meaningful T-shirt made for comfort, style, and faith.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.benefits.map((benefit, index) => {
            const Icon = icons[index] ?? CheckCircle2;
            return (
              <div
                key={benefit}
              className="card-surface rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(27,21,10,0.1)]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#080808] text-[#f5c965]">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <p className="mt-4 font-bold leading-6 text-[#26221d]">{benefit}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8">
          <OrderButton label="Order Now" />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="reviews" className="section-pad bg-[#080808] text-white">
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f5c965]">
            Customer Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            Loved by customers who value comfort and meaning.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {product.testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.18)]"
            >
              <div className="mb-4 flex text-[#f5c965]" aria-hidden="true">
                {"*****"}
              </div>
              <blockquote className="leading-7 text-neutral-100">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-neutral-300">{testimonial.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="section-pad bg-[#fbfaf7]">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.75fr_1fr]">
        <div>
          <p className="section-kicker">Questions</p>
          <h2 className="section-title mt-3">
            Frequently asked questions
          </h2>
          <p className="mt-4 leading-7 text-[#645f58]">
            Everything customers usually want to know before ordering with Cash
            on Delivery.
          </p>
          <div className="mt-6">
            <OrderButton label="Buy Now" variant="dark" />
          </div>
        </div>
        <FaqAccordion faqs={product.faqs} />
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#080808] py-14 text-center text-white lg:py-20">
      <div className="container-shell">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f5c965]">
          Cash on Delivery available
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
          Ready to order your Christian Bible Verse Print T-Shirt?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-neutral-300">
          Place your order now. Our sales representative will call you soon to
          confirm your size, design, and delivery location.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <OrderButton label="Purchase Now" />
          <OrderButton label="Order Now" variant="light" />
        </div>
      </div>
    </section>
  );
}
