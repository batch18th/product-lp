"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatMoney, getOrderTotal, product } from "@/lib/product";

type FormErrors = Record<string, string>;

const ORDER_ERROR_MESSAGE = "Something went wrong. Please try again or contact us.";

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const order = useMemo(() => {
    const quantity = Math.max(Number(searchParams.get("quantity") ?? 1), 1);
    const pricePerPiece = Number(searchParams.get("pricePerPiece") ?? product.offerPrice);
    const computedTotal = getOrderTotal(quantity).total;
    const totalPrice = Number(searchParams.get("totalPrice") ?? computedTotal);

    return {
      productName: searchParams.get("productName") || product.displayName,
      quantity: Number.isFinite(quantity) ? quantity : 1,
      pricePerPiece: Number.isFinite(pricePerPiece) ? pricePerPiece : product.offerPrice,
      totalPrice: Number.isFinite(totalPrice) ? totalPrice : computedTotal,
    };
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      productName: order.productName,
      quantity: order.quantity,
      pricePerPiece: order.pricePerPiece,
      totalPrice: order.totalPrice,
    };

    const nextErrors = validateClient(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(response.status === 400 ? result.error || ORDER_ERROR_MESSAGE : ORDER_ERROR_MESSAGE);
      }

      const params = new URLSearchParams({
        orderId: result.orderId,
        productName: order.productName,
        quantity: String(order.quantity),
        totalPrice: String(order.totalPrice),
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : ORDER_ERROR_MESSAGE,
      );
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfaf7] py-8 lg:py-14">
        <div className="container-shell">
          <Link
            href="/"
            className="focus-ring mb-6 inline-flex items-center gap-2 rounded-md text-sm font-bold text-[#645f58] transition hover:text-black"
          >
            <ArrowLeft size={18} />
            Back to product
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.58fr] lg:gap-8">
            <section className="card-surface rounded-2xl p-5 sm:p-7 lg:p-8">
              <p className="section-kicker">
                Secure Cash On Delivery Checkout
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-[#11100e] sm:text-4xl">
                Complete your order
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-[#645f58]">
                Fill in your details. Our sales representative will call you soon
                to confirm your order.
              </p>

            {serverError ? (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {serverError}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
              <Field
                label="Full Name"
                name="customerName"
                placeholder="Enter your full name"
                error={errors.customerName}
              />
              <Field
                label="Phone Number"
                name="phone"
                placeholder="Enter your phone number"
                error={errors.phone}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                error={errors.email}
              />
              <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="location">
                  Exact Location
                </label>
                <textarea
                  id="location"
                  name="location"
                  rows={4}
                  placeholder="Kindly share your exact location"
                className="field-control min-h-32 text-sm"
                />
                {errors.location ? <ErrorText message={errors.location} /> : null}
              </div>

              <div className="grid gap-4 rounded-2xl border border-[#e8e0d2] bg-[#fffaf0] p-4 sm:grid-cols-2">
                <ReadOnlyField label="Product Name" value={order.productName} />
                <ReadOnlyField label="Quantity" value={String(order.quantity)} />
                <ReadOnlyField
                  label="Price Per Piece"
                  value={formatMoney(order.pricePerPiece)}
                />
                <ReadOnlyField label="Total Price" value={formatMoney(order.totalPrice)} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="focus-ring inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl bg-[#d6a23a] px-6 py-3 text-sm font-black uppercase tracking-wide text-black shadow-[0_14px_34px_rgba(214,162,58,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f1bd53] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Submitting Order...
                  </>
                ) : (
                  "Order Now"
                )}
              </button>
            </form>
          </section>

          <aside className="rounded-2xl border border-[#d6a23a]/25 bg-[#080808] p-5 text-white shadow-[0_22px_70px_rgba(0,0,0,0.18)] sm:p-7 lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f5c965]">
              Order Summary
            </p>
            <h2 className="mt-2 text-2xl font-black">{order.productName}</h2>
            <div className="mt-6 space-y-3 text-sm">
              <SummaryLine label="Quantity" value={String(order.quantity)} />
              <SummaryLine label="Price Per Piece" value={formatMoney(order.pricePerPiece)} />
              <SummaryLine label="Delivery Fee" value="Free" />
              <div className="flex items-center justify-between border-t border-white/15 pt-4 text-lg font-black">
                <span>Total</span>
                <span>{formatMoney(order.totalPrice)}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm text-neutral-200">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#f7d57b]" size={18} />
                Cash on Delivery. Pay only when your order arrives.
              </div>
              <div className="flex gap-2">
                <LockKeyhole className="mt-0.5 shrink-0 text-[#f7d57b]" size={18} />
                Your order details are submitted securely to our team.
              </div>
            </div>
          </aside>
        </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  error,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="field-control text-sm"
      />
      {error ? <ErrorText message={error} /> : null}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#7a7165]">{label}</p>
      <p className="mt-1 font-bold text-black">{value}</p>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-neutral-200">
      <span>{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

function ErrorText({ message }: { message: string }) {
  return <p className="mt-2 text-sm font-semibold text-red-600">{message}</p>;
}

function validateClient(payload: {
  customerName: string;
  phone: string;
  email: string;
  location: string;
}) {
  const errors: FormErrors = {};
  if (!payload.customerName) errors.customerName = "Name is required.";
  if (!payload.phone) errors.phone = "Phone number is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!payload.location) errors.location = "Exact location is required.";
  return errors;
}
