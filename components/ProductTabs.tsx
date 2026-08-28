"use client";

import { useState } from "react";
import { Product } from "@/lib/products";

const TABS = ["Description", "Usage & Dosage", "Safety Info"] as const;

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");

  return (
    <div>
      <div className="flex gap-8 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3.5 text-sm font-bold relative transition-colors ${
              active === tab ? "text-forest" : "text-muted hover:text-navy"
            }`}
          >
            {tab}
            {active === tab && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-forest" />}
          </button>
        ))}
      </div>
      <div className="py-8 text-[14.5px] leading-relaxed text-muted max-w-[700px]">
        {active === "Description" && (
          <p>
            {product.name} contains {product.salt}, indicated for {product.desc.toLowerCase()}. Manufactured under
            GMP-certified conditions and supplied in {product.pack} packs. Trade pricing and bulk order details
            available on enquiry.
          </p>
        )}
        {active === "Usage & Dosage" && (
          <p>
            Dosage should be determined by a registered medical practitioner based on patient condition, age, and
            severity. This information is provided for trade reference only and is not a substitute for professional
            medical advice.
          </p>
        )}
        {active === "Safety Info" && (
          <p>
            Keep out of reach of children. Do not use beyond the expiry date printed on the pack. Report any adverse
            reactions to your supervising physician. Full prescribing information is available on request.
          </p>
        )}
      </div>
    </div>
  );
}
