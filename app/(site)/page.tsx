import Link from "next/link";
import { getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { IconBadge } from "@/components/IconBadge";

const CATEGORY_TILES = [
  {
    label: "Tablets & Capsules",
    count: "32 items",
    bg: "#FDEDEC",
    stroke: "#C0392B",
    icon: (
      <>
        <rect x="4.5" y="8.5" width="15" height="7" rx="3.5" />
        <line x1="12" y1="8.5" x2="12" y2="15.5" />
      </>
    ),
  },
  {
    label: "Syrups & Liquids",
    count: "14 items",
    bg: "#EAF6EF",
    stroke: "#0F6E4E",
    icon: (
      <>
        <path d="M10 3.5h4v4l3 4.5v7a2 2 0 01-2 2h-6a2 2 0 01-2-2v-7l3-4.5v-4z" strokeLinejoin="round" />
        <line x1="8.5" y1="14" x2="15.5" y2="14" />
      </>
    ),
  },
  {
    label: "Injectables",
    count: "9 items",
    bg: "#EAF1FB",
    stroke: "#2E6FBE",
    icon: (
      <>
        <path d="M20 4l-2.5 2.5M8 14l6-6 2 2-6 6-3.5 1.5L5 19l1.5-4.5L8 14z" strokeLinejoin="round" />
        <line x1="12" y1="8" x2="14" y2="10" />
        <line x1="10" y1="10" x2="12" y2="12" />
      </>
    ),
  },
  {
    label: "Ointments & Creams",
    count: "11 items",
    bg: "#FDF3E3",
    stroke: "#C79A48",
    icon: (
      <>
        <rect x="7" y="5" width="10" height="15" rx="2" strokeLinejoin="round" />
        <path d="M10 5V3h4v2" />
        <line x1="9.5" y1="12" x2="14.5" y2="12" />
      </>
    ),
  },
  {
    label: "Wellness & Supplements",
    count: "10 items",
    bg: "#F1EAFB",
    stroke: "#7B4FC9",
    icon: (
      <>
        <path d="M12 21c-5-2-8-6-8-11a8 8 0 0116 0c0 5-3 9-8 11z" strokeLinejoin="round" />
        <path d="M12 16V8M9 11c1.5 1 4.5 1 6 0" />
      </>
    ),
  },
  {
    label: "First Aid & Essentials",
    count: "6 items",
    bg: "#EAF6EF",
    stroke: "#0F6E4E",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" strokeLinejoin="round" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </>
    ),
  },
];

const WHY_US = [
  {
    t: "GMP-Certified Sourcing",
    d: "Every batch is traceable and compliant with pharmaceutical standards.",
    icon: (
      <>
        <path d="M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    t: "Direct Trade Pricing",
    d: "No hidden markups — transparent rates for bulk and retail orders.",
    icon: (
      <>
        <path d="M12 4v16M8 8h5.5a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5H16" />
      </>
    ),
  },
  {
    t: "Fast Regional Dispatch",
    d: "Warehousing built for quick turnaround to clinics and pharmacies.",
    icon: (
      <>
        <rect x="3" y="7" width="12" height="10" rx="2" strokeLinejoin="round" />
        <path d="M15 10.5h3.5l2.5 3.5V17h-6" strokeLinejoin="round" />
        <circle cx="8" cy="18" r="1.6" />
        <circle cx="17.5" cy="18" r="1.6" />
      </>
    ),
  },
  {
    t: "Dedicated Support",
    d: "Real people on WhatsApp, phone, and email for orders & queries.",
    icon: (
      <>
        <path d="M4 12a8 8 0 0116 0v5a2 2 0 01-2 2h-1v-6h3M4 17v-5h3v6H6a2 2 0 01-2-2z" strokeLinejoin="round" />
      </>
    ),
  },
];

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-pale to-white pt-[70px] pb-10">
        <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Healthier Today, Brighter Tomorrow
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-[38px] md:text-[58px] font-extrabold leading-[1.1] text-navy">
                Your Trusted <br />
                <span className="text-forest">Pharmaceutical</span> Partner
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 text-base text-muted leading-relaxed max-w-[460px]">
                Quality medicines, genuine products. GDNT Medicare supplies doctors and medical stores with GMP-certified formulations — enquire directly, no middlemen.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="flex flex-wrap gap-4 mt-9">
                <Link href="/shop" className="bg-forest text-white px-8 py-4 rounded-lg font-bold text-sm inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-10px_rgba(15,110,78,0.4)]">
                  Browse Catalog
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8h11M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </Link>
                <Link href="/contact" className="border-[1.5px] border-line px-8 py-[15px] rounded-lg font-bold text-sm transition-colors hover:border-forest hover:text-forest">
                  Talk to Our Team
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="flex flex-wrap gap-7 mt-11">
                <div className="flex items-center gap-2.5 text-[13px] font-semibold text-navy">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.6-10-9.2C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.4C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.8C19.5 16.4 12 21 12 21z" stroke="#0F6E4E" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                  100% Genuine
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-semibold text-navy">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="14" height="11" rx="2" stroke="#0F6E4E" strokeWidth="1.6" /><path d="M17 10h2.5l2 3v5H17" stroke="#0F6E4E" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                  Fast Dispatch
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-semibold text-navy">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z" stroke="#0F6E4E" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                  GMP Certified
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="relative h-[460px] rounded-[20px] overflow-hidden bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center">
              <svg viewBox="0 0 200 200" fill="none" className="w-[55%] opacity-90">
                <path d="M100 20c-8 0-14 6-14 14 0 10 14 18 14 18s14-8 14-18c0-8-6-14-14-14z" stroke="#fff" strokeWidth="2" opacity=".9" />
                <circle cx="60" cy="100" r="34" stroke="#fff" strokeWidth="2" opacity=".5" />
                <circle cx="140" cy="110" r="46" stroke="#fff" strokeWidth="2" opacity=".7" />
                <path d="M120 100h40M140 80v40" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="animate-float absolute top-[8%] -left-[6%] bg-white px-4.5 py-3.5 rounded-xl shadow-[0_20px_44px_-16px_rgba(20,24,31,0.25)] flex gap-2.5 items-center">
                <div className="w-9 h-9 rounded-full bg-forest-pale flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#0F6E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="9" stroke="#0F6E4E" strokeWidth="1.6" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy">500+ Partners</div>
                  <div className="text-[10px] text-muted">Doctors &amp; pharmacies</div>
                </div>
              </div>
              <div className="animate-float absolute bottom-[10%] -right-[6%] bg-white px-4.5 py-3.5 rounded-xl shadow-[0_20px_44px_-16px_rgba(20,24,31,0.25)] flex gap-2.5 items-center" style={{ animationDelay: "1.4s" }}>
                <div className="w-9 h-9 rounded-full bg-forest-pale flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#0F6E4E" strokeWidth="1.6" /><path d="M4 9h16" stroke="#0F6E4E" strokeWidth="1.6" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy">80+ Formulations</div>
                  <div className="text-[10px] text-muted">Across 6 categories</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="max-w-[620px] mx-auto mb-14 text-center">
            <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Shop by Category
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">A catalog built for prescribers</h2>
            <p className="mt-3.5 text-muted text-[15px] leading-relaxed">
              Six ranges covering the everyday needs of clinics, hospitals, and retail pharmacies.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4.5">
            {CATEGORY_TILES.map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <Link
                  href="/shop"
                  className="group block bg-bg-soft border border-line rounded-2xl px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_36px_-18px_rgba(20,24,31,0.18)] hover:border-transparent"
                >
                  <div
                    className="w-14 h-14 rounded-full mx-auto mb-3.5 flex items-center justify-center transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ background: c.bg }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="1.6" strokeLinecap="round">
                      {c.icon}
                    </svg>
                  </div>
                  <div className="text-[13px] font-bold text-navy">{c.label}</div>
                  <div className="text-[11px] text-forest mt-1 font-semibold">{c.count} →</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-bg-soft">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="max-w-[620px] mx-auto mb-14 text-center">
            <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Featured Products
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">Recently added to the catalog</h2>
            <p className="mt-3.5 text-muted text-[15px] leading-relaxed">
              Full composition and trade pricing available — tap any product for complete details.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted text-sm">
                No products yet. Add products from the{" "}
                <Link href="/admin" className="text-forest font-bold underline">
                  admin dashboard
                </Link>{" "}
                once Supabase is connected.
              </div>
            ) : (
              products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)
            )}
          </div>
          <Reveal className="text-center mt-10">
            <Link href="/shop" className="inline-block border-[1.5px] border-line px-8 py-[15px] rounded-lg font-bold text-sm transition-colors hover:border-forest hover:text-forest">
              View All Products
            </Link>
          </Reveal>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="max-w-[620px] mx-auto mb-14 text-center">
            <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-gold font-bold mb-4 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Built on reliability, not just range</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {WHY_US.map((item, i) => (
              <Reveal key={item.t} delay={i * 80}>
                <div className="mx-auto mb-4 w-fit">
                  <IconBadge from="#C79A48" to="#8B6D3F">
                    {item.icon}
                  </IconBadge>
                </div>
                <h4 className="text-base font-extrabold mb-2">{item.t}</h4>
                <p className="text-[13px] text-white/65 leading-relaxed">{item.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="bg-gradient-to-br from-forest to-forest-dark rounded-3xl px-6 md:px-16 py-16 text-center text-white">
              <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-[#CDEFDD] font-bold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> Get in Touch
              </div>
              <h2 className="text-3xl md:text-[38px] font-extrabold mb-3.5">Ready to stock genuine medicines?</h2>
              <p className="text-white/75 max-w-[460px] mx-auto mb-8 text-[15px]">
                Reach our team directly — by form, WhatsApp, phone, or email. We usually respond within a few hours.
              </p>
              <div className="flex flex-wrap gap-3.5 justify-center">
                <Link href="/contact" className="bg-white text-forest px-8 py-[15px] rounded-lg font-extrabold text-sm transition-transform hover:-translate-y-0.5">
                  Send an Enquiry
                </Link>
                <a href="https://wa.me/919876543210" className="border-[1.5px] border-white/40 text-white px-8 py-[15px] rounded-lg font-extrabold text-sm transition-colors hover:bg-white/10 hover:border-white">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
