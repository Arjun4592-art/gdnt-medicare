import Link from "next/link";
import Reveal from "@/components/Reveal";
import { IconBadge } from "@/components/IconBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | GDNT Medicare Pvt. Ltd.",
  description: "Learn about GDNT Medicare Pvt. Ltd. — a GMP-certified pharmaceutical supplier trusted by doctors and medical stores.",
};

const VALUES = [
  {
    t: "Genuine, Always",
    d: "Every batch is verified and traceable back to the manufacturer.",
    icon: (
      <>
        <path d="M12 3l8 3.5v5c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-5L12 3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    t: "Compliance First",
    d: "Licensed operations meeting all pharmaceutical trade regulations.",
    icon: (
      <>
        <path d="M7 3h7l4 4v14H7z" strokeLinejoin="round" />
        <path d="M14 3v4h4" strokeLinejoin="round" />
        <path d="M9.5 13.2l1.8 1.8L15 11" />
      </>
    ),
  },
  {
    t: "Transparent Pricing",
    d: "No hidden costs — clear trade rates communicated upfront.",
    icon: (
      <>
        <path d="M12 4v16M8 8h5.5a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5H16" />
      </>
    ),
  },
  {
    t: "Reliable Supply",
    d: "Consistent stock availability and dependable dispatch timelines.",
    icon: (
      <>
        <rect x="3" y="7" width="12" height="10" rx="2" strokeLinejoin="round" />
        <path d="M15 10.5h3.5l2.5 3.5V17h-6" strokeLinejoin="round" />
        <circle cx="8" cy="18" r="1.6" />
        <circle cx="17.5" cy="18" r="1.6" />
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="max-w-[1240px] mx-auto px-8 py-5 text-[13px] text-muted">
        <Link href="/" className="hover:text-forest">Home</Link>
        <span className="mx-1.5">/</span>About Us
      </div>

      <section className="pt-4 pb-24">
        <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Our Story
            </div>
            <h1 className="text-3xl md:text-[44px] font-extrabold text-navy leading-tight">
              Expert care for a healthier tomorrow
            </h1>
            <p className="mt-5 text-base text-muted leading-relaxed">
              GDNT Medicare Pvt. Ltd. was founded with one purpose — to make genuine, quality-assured medicines easily
              accessible to the doctors and medical stores who depend on them. We work directly with certified
              manufacturers and maintain strict quality checks at every stage, from sourcing to dispatch.
            </p>
            <p className="mt-4 text-base text-muted leading-relaxed">
              Today, we supply a growing catalog of formulations across cardiac, diabetes, respiratory, wellness, and
              general care categories — trusted by clinics and pharmacies across the region.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative h-[380px] rounded-[20px] overflow-hidden bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center">
              <svg viewBox="0 0 200 200" fill="none" className="w-[45%] opacity-85">
                <path d="M100 30c-30 0-50 22-50 50 0 36 50 66 50 66s50-30 50-66c0-28-20-50-50-50z" stroke="#fff" strokeWidth="2" />
                <path d="M100 65v40M80 85h40" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </Reveal>
        </div>

        <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {[
            ["500+", "Pharmacy Partners"],
            ["80+", "Formulations"],
            ["GMP", "Certified Facility"],
            ["24hr", "Response Time"],
          ].map(([num, lbl], i) => (
            <Reveal key={lbl} delay={i * 80}>
              <div className="text-center py-8 px-4 bg-bg-soft rounded-2xl border border-line">
                <div className="text-[32px] font-extrabold text-forest">{num}</div>
                <div className="text-[12.5px] text-muted mt-1.5 font-semibold">{lbl}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 bg-bg-soft">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="max-w-[620px] mx-auto mb-14 text-center">
            <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">What guides how we work</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className="mx-auto mb-4 w-fit">
                  <IconBadge from="#14A876" to="#0B4F38">
                    {v.icon}
                  </IconBadge>
                </div>
                <h4 className="text-base font-extrabold mb-2 text-navy">{v.t}</h4>
                <p className="text-[13px] text-muted leading-relaxed">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal>
            <div className="bg-gradient-to-br from-forest to-forest-dark rounded-3xl px-6 md:px-16 py-16 text-center text-white">
              <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-[#CDEFDD] font-bold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> Partner With Us
              </div>
              <h2 className="text-3xl md:text-[38px] font-extrabold mb-3.5">Let&apos;s work together</h2>
              <p className="text-white/75 max-w-[460px] mx-auto mb-8 text-[15px]">
                Reach out to discuss stocking our range at your clinic or pharmacy.
              </p>
              <Link href="/contact" className="inline-block bg-white text-forest px-8 py-[15px] rounded-lg font-extrabold text-sm transition-transform hover:-translate-y-0.5">
                Contact Our Team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
