import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByIdAsync, getRelatedProductsAsync } from "@/lib/data";
import { getDiscountPercent } from "@/lib/products";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import ProductTabs from "@/components/ProductTabs";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdAsync(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | GDNT Medicare Pvt. Ltd.`,
    description: `${product.salt} — ${product.desc}. Available in ${product.pack} packs.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdAsync(id);
  if (!product) notFound();

  const related = await getRelatedProductsAsync(product);
  const discount = getDiscountPercent(product.price, product.mrp);

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-8 py-5 text-[13px] text-muted">
        <Link href="/" className="hover:text-forest">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-forest">Shop</Link>
        <span className="mx-1.5">/</span>
        {product.name}
      </div>

      <section className="pt-4">
        <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <ProductGallery images={product.images} icon={product.icon} name={product.name} />

          <div>
            <div className="text-[11px] font-extrabold text-gold uppercase tracking-wide">{product.type} · {product.pack}</div>
            <h1 className="text-[30px] font-extrabold text-navy mt-2.5">{product.name}</h1>
            <div className="text-sm text-muted mt-1.5">{product.salt}</div>

            <div className="flex items-center gap-4 mt-5 py-5 border-t border-b border-line">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="text-[28px] font-extrabold text-navy">₹{product.price}</div>
                  {discount > 0 && (
                    <span className="text-[11px] font-extrabold text-white bg-gold px-2.5 py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted mt-0.5">
                  MRP <span className="line-through">₹{product.mrp}</span> · Trade price on request
                </div>
              </div>
              <div
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  color: product.stock === "In Stock" ? "#0F6E4E" : "#C79A48",
                  background: product.stock === "In Stock" ? "#EAF6EF" : "#FDF3E3",
                }}
              >
                {product.stock}
              </div>
            </div>

            <div className="mt-6">
              {[
                ["Composition", product.salt],
                ["Form", product.type],
                ["Pack Size", product.pack],
                ["Category", product.cat],
                ["Storage", "Store below 30°C, protect from light"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-3 border-b border-line text-[13.5px]">
                  <span className="text-muted font-semibold">{k}</span>
                  <span className="text-navy font-bold text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3.5 mt-7">
              <Link href="/contact" className="bg-forest text-white px-8 py-4 rounded-lg font-bold text-sm inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v12H8l-4 4V4z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                Send Enquiry
              </Link>
              <a href="https://wa.me/919876543210" className="border-[1.5px] border-line px-8 py-[15px] rounded-lg font-bold text-sm inline-flex items-center gap-2 transition-colors hover:border-forest hover:text-forest">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.7-1.2A9 9 0 1012 3z" stroke="#0F6E4E" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                WhatsApp
              </a>
              <a href="tel:+919876543210" className="border-[1.5px] border-line px-8 py-[15px] rounded-lg font-bold text-sm transition-colors hover:border-forest hover:text-forest">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1240px] mx-auto px-8">
          <ProductTabs product={product} />
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <h2 className="text-3xl font-extrabold text-navy mb-10">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
