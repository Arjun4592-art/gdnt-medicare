"use client";

import { useState } from "react";
import Image from "next/image";
import ProductIcon from "./ProductIcon";
import { ProductIcon as IconType } from "@/lib/products";

export default function ProductGallery({ images, icon, name }: { images: string[]; icon: IconType; name: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const activeSrc = hasImages ? images[Math.min(active, images.length - 1)] : null;

  return (
    <div>
      <div className="h-[420px] rounded-2xl bg-bg-soft flex items-center justify-center mb-3.5 overflow-hidden relative">
        {activeSrc ? (
          <Image src={activeSrc} alt={name} fill className="object-contain" priority />
        ) : (
          <ProductIcon icon={icon} className="w-[140px] h-[140px]" />
        )}
      </div>

      {hasImages ? (
        <div className="flex gap-2.5">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative w-[72px] h-[72px] rounded-xl bg-bg-soft border-2 overflow-hidden cursor-pointer transition-colors ${
                i === active ? "border-forest" : "border-transparent hover:border-forest"
              }`}
            >
              <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-[72px] h-[72px] rounded-xl bg-bg-soft border-2 flex items-center justify-center ${
                i === 0 ? "border-forest" : "border-transparent"
              }`}
            >
              <ProductIcon icon={icon} className="w-8 h-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
