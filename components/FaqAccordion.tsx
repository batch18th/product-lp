"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Faq } from "@/lib/product";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="card-surface divide-y divide-[#e8e0d2] rounded-2xl">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-[#26221d] transition hover:bg-[#fffaf0]"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen ? (
              <div className="px-5 pb-5 text-sm leading-6 text-[#645f58]">
                {faq.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
