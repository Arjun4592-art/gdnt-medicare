"use client";

import { useMemo, useState } from "react";
import { Product, CATEGORIES } from "@/lib/products";
import ProductCard from "./ProductCard";

const FORMS = ["Tablets", "Capsules", "Syrup", "Ointment"];

export default function ShopFilters({ products }: { products: Product[] }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [forms, setForms] = useState<string[]>([]);
  const [sort, setSort] = useState("Featured");

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  // Only offer categories that actually exist in the live product data, falling
  // back to the suggested list if the store hasn't been stocked yet.
  const activeCategories = useMemo(() => {
    const inData = Array.from(new Set(products.map((p) => p.cat))).sort();
    return inData.length > 0 ? inData : CATEGORIES;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (categories.length > 0 && !categories.includes(p.cat)) return false;
      if (availability.length > 0 && !availability.includes(p.stock)) return false;
      if (forms.length > 0 && !forms.includes(p.type)) return false;
      return true;
    });

    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, categories, availability, forms, sort]);

  const anyFilterActive = categories.length > 0 || availability.length > 0 || forms.length > 0;

  return (
    <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-9 items-start">
      <aside className="bg-bg-soft border border-line rounded-2xl p-6 lg:sticky lg:top-24 w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-[13px] font-extrabold text-navy">Category</h5>
            {anyFilterActive && (
              <button
                onClick={() => {
                  setCategories([]);
                  setAvailability([]);
                  setForms([]);
                }}
                className="text-[11px] font-bold text-forest hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <label className="flex items-center gap-2.5 text-[13.5px] text-muted py-1.5 cursor-pointer hover:text-navy">
            <input
              type="checkbox"
              checked={categories.length === 0}
              onChange={() => setCategories([])}
              className="accent-forest w-[15px] h-[15px]"
            />{" "}
            All Products
          </label>
          {activeCategories.map((c) => (
            <label key={c} className="flex items-center gap-2.5 text-[13.5px] text-muted py-1.5 cursor-pointer hover:text-navy">
              <input
                type="checkbox"
                checked={categories.includes(c)}
                onChange={() => toggle(categories, setCategories, c)}
                className="accent-forest w-[15px] h-[15px]"
              />{" "}
              {c}
            </label>
          ))}
        </div>
        <div className="mb-6">
          <h5 className="text-[13px] font-extrabold text-navy mb-4">Availability</h5>
          {["In Stock", "Low Stock"].map((a) => (
            <label key={a} className="flex items-center gap-2.5 text-[13.5px] text-muted py-1.5 cursor-pointer hover:text-navy">
              <input
                type="checkbox"
                checked={availability.includes(a)}
                onChange={() => toggle(availability, setAvailability, a)}
                className="accent-forest w-[15px] h-[15px]"
              />{" "}
              {a}
            </label>
          ))}
        </div>
        <div>
          <h5 className="text-[13px] font-extrabold text-navy mb-4">Form</h5>
          {FORMS.map((f) => (
            <label key={f} className="flex items-center gap-2.5 text-[13.5px] text-muted py-1.5 cursor-pointer hover:text-navy">
              <input
                type="checkbox"
                checked={forms.includes(f)}
                onChange={() => toggle(forms, setForms, f)}
                className="accent-forest w-[15px] h-[15px]"
              />{" "}
              {f}
            </label>
          ))}
        </div>
      </aside>

      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="text-[13.5px] text-muted">Showing {filtered.length} products</div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-line rounded-lg px-3.5 py-2.5 text-[13px] font-semibold text-navy bg-white"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted text-sm bg-bg-soft rounded-2xl border border-line">
              No products match these filters.
            </div>
          ) : (
            filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={(i % 6) * 60} />)
          )}
        </div>
      </div>
    </div>
  );
}
