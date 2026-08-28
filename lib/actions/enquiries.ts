"use server";

import { createClient } from "@/lib/supabase/server";
import { NewEnquiry } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

// Submit a new enquiry (public — from contact form or product page)
// Also sends an email notification to the admin (see sendEnquiryEmail below)
export async function submitEnquiry(enquiry: NewEnquiry) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .insert({ ...enquiry, status: "New" })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Fire-and-forget email notification — do not block the user response on this
  sendEnquiryEmail(enquiry).catch((err) => console.error("Email notification failed:", err));

  revalidatePath("/admin");
  return data;
}

// Fetch all enquiries (admin only)
export async function getEnquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Mark an enquiry as responded (admin only)
export async function markResponded(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ status: "Responded" }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ============================================================
// EMAIL NOTIFICATION
// Uses Resend (resend.com) — free for up to 3,000 emails/month.
// Sign up free, verify a sender (or use their test domain), add RESEND_API_KEY to .env.local
// ============================================================
async function sendEnquiryEmail(enquiry: NewEnquiry) {
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set — skipping email notification. Enquiry is still saved in the database.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Using Resend's shared test sender by default — swap to your own verified
      // domain (e.g. notify@gdntmedicare.com) once you've added and verified it in Resend.
      from: "GDNT Medicare Website <onboarding@resend.dev>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL || "orders@gdntmedicare.com",
      reply_to: enquiry.email || undefined, // lets you hit "Reply" and go straight to the customer
      subject: `New Enquiry: ${enquiry.name}${enquiry.product_name ? ` — ${enquiry.product_name}` : ""}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #0F6E4E;">New enquiry received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Name</strong></td><td style="padding: 6px 0;">${enquiry.name}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Store/Clinic</strong></td><td style="padding: 6px 0;">${enquiry.store_name || "-"}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Phone</strong></td><td style="padding: 6px 0;">${enquiry.phone}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Email</strong></td><td style="padding: 6px 0;">${enquiry.email || "-"}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Product</strong></td><td style="padding: 6px 0;">${enquiry.product_name || "-"}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470; vertical-align: top;"><strong>Message</strong></td><td style="padding: 6px 0;">${enquiry.message || "-"}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #5B6470;">View and respond to this enquiry in your <a href="https://gdntmedicare.com/admin" style="color: #0F6E4E;">admin dashboard</a>.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Resend API error (${res.status}):`, body);
  }
}
