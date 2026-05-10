import { Suspense } from "react";
import { CheckoutForm } from "./CheckoutForm";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] py-10">
      <div className="container-shell">
        <div className="h-96 animate-pulse rounded-lg bg-white shadow-sm" />
      </div>
    </main>
  );
}
