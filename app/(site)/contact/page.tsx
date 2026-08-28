import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { IconBadge } from "@/components/IconBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | GDNT Medicare Pvt. Ltd.",
  description: "Get in touch with GDNT Medicare Pvt. Ltd. via form, WhatsApp, phone, or email for product enquiries and trade pricing.",
};

const METHODS = [
  {
    title: "Fill the Enquiry Form",
    body: "We typically respond within a few hours during business days.",
    icon: <path d="M4 4h16v12H8l-4 4V4z" strokeLinejoin="round" />,
  },
  {
    title: "WhatsApp Chat",
    body: <a href="https://wa.me/919876543210" className="text-forest font-bold">+91 98765 43210</a>,
    icon: <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.7-1.2A9 9 0 1012 3z" strokeLinejoin="round" />,
  },
  {
    title: "Call Us",
    body: <a href="tel:+919876543210" className="text-forest font-bold">+91 98765 43210</a>,
    icon: (
      <path
        d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 3a2 2 0 01-.4 2.1L8.1 10a16 16 0 006 6l1.2-1.3a2 2 0 012.1-.4c1 .3 2 .5 3 .7a2 2 0 011.6 2z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Email",
    body: <a href="mailto:orders@gdntmedicare.com" className="text-forest font-bold">orders@gdntmedicare.com</a>,
    icon: <path d="M3 5h18v14H3z M3 7l9 6 9-6" strokeLinejoin="round" />,
  },
];

export default function ContactPage() {
  return (
    <>
      <div className="max-w-[1240px] mx-auto px-8 py-5 text-[13px] text-muted">
        <Link href="/" className="hover:text-forest">Home</Link>
        <span className="mx-1.5">/</span>Contact
      </div>

      <section className="pt-4 pb-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <Reveal className="max-w-[620px] mx-auto mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-forest font-bold mb-4 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Get in Touch
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">We&apos;d love to hear from you</h2>
            <p className="mt-3.5 text-muted text-[15px] leading-relaxed">
              Reach us through whichever channel is easiest — form, WhatsApp, phone, or email.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div className="flex flex-col gap-4">
              {METHODS.map((m, i) => (
                <Reveal key={m.title} delay={i * 70}>
                  <div className="flex gap-4 items-start p-5 bg-bg-soft rounded-2xl border border-line transition-all hover:-translate-y-1 hover:shadow-[0_16px_30px_-16px_rgba(20,24,31,0.15)]">
                    <IconBadge from="#14A876" to="#0B4F38" size={44} shape="square">
                      {m.icon}
                    </IconBadge>
                    <div>
                      <h5 className="text-sm font-extrabold text-navy">{m.title}</h5>
                      <p className="text-[13px] text-muted mt-0.5">{m.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={4 * 70}>
                <div className="flex gap-4 items-start p-5 bg-bg-soft rounded-2xl border border-line transition-all hover:-translate-y-1 hover:shadow-[0_16px_30px_-16px_rgba(20,24,31,0.15)]">
                  <IconBadge from="#14A876" to="#0B4F38" size={44} shape="square">
                    <path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" strokeLinejoin="round" />
                    <circle cx="12" cy="11" r="2.2" />
                  </IconBadge>
                  <div>
                    <h5 className="text-sm font-extrabold text-navy">Office Address</h5>
                    <p className="text-[13px] text-muted mt-0.5">GDNT Medicare Pvt. Ltd., Industrial Area, New Delhi, India</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
