"use client";

import { useState, FormEvent } from "react";
import { submitEnquiry } from "@/lib/actions/enquiries";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitEnquiry({
        name: formData.get("name") as string,
        store_name: formData.get("store_name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        product_name: formData.get("product_name") as string,
        product_id: null,
        message: formData.get("message") as string,
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError("Something went wrong — please try again or contact us via WhatsApp/phone.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-soft border border-line rounded-[18px] p-10">
      <h3 className="text-[19px] font-extrabold text-navy mb-6">Send an Enquiry</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy mb-2">Full Name</label>
            <input name="name" required type="text" placeholder="Dr. Ramesh Gupta" className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale" />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-2">Clinic / Store Name</label>
            <input name="store_name" type="text" placeholder="City Medical Store" className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy mb-2">Phone Number</label>
            <input name="phone" required type="tel" placeholder="+91 00000 00000" className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale" />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-2">Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-navy mb-2">Product / Requirement</label>
          <input name="product_name" type="text" placeholder="e.g. Amlogard 5mg — bulk quote" className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale" />
        </div>
        <div>
          <label className="block text-xs font-bold text-navy mb-2">Message</label>
          <textarea name="message" rows={4} placeholder="Tell us more about your requirement..." className="w-full border border-line rounded-lg px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-forest text-white py-4 rounded-lg font-bold text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {loading ? "Sending..." : "Send Enquiry"}
        </button>
        {submitted && (
          <p className="text-forest text-[13px] font-bold text-center">✓ Thanks! We&apos;ll get back to you shortly.</p>
        )}
        {error && (
          <p className="text-[#C0392B] text-[13px] font-bold text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
