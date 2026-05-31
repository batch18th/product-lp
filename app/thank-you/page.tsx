import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type ThankYouProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const params = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#fbfaf7] px-4 py-10">
      <section className="card-surface w-full max-w-2xl rounded-2xl p-6 text-center sm:p-10">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#fff5dc] text-[#a97918]">
          <CheckCircle2 size={34} />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#a97918]">
          Order received
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-[#11100e] sm:text-4xl">
          Thank you for your order.
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#645f58]">
          We have received your order successfully.
        </p>

        <div className="mt-7 grid gap-3 rounded-2xl border border-[#e8e0d2] bg-[#fffaf0] p-5 text-left">
          {params.orderId ? <Info label="Order ID" value={params.orderId} /> : null}
          <Info label="Payment method" value="Cash On Delivery" />
          <Info
            label="Next step"
            value="Our sales representative will call you soon to confirm your order."
          />
        </div>

        <Link
          href="/"
          className="focus-ring mt-7 inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl bg-[#080808] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#24211d]"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </section>
    </main>
    <SiteFooter />
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-semibold text-neutral-600">{label}</span>
      <span className="text-right font-bold text-black">{value}</span>
    </div>
  );
}
