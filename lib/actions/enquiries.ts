'use server'

import { createClient } from '@/lib/supabase/server'
import { NewEnquiry } from '@/lib/supabase/types'
import { revalidatePath } from 'next/cache'
import { after } from 'next/server'

export type SubmitEnquiryResult = { ok: true } | { ok: false; error: string }

const clean = (v: string | null | undefined, max: number) =>
  (v ?? '').toString().trim().slice(0, max)

// Submit a new enquiry (public — from the contact form).
//
// IMPORTANT: visitors are anonymous, and the database only lets anonymous users
// INSERT into `enquiries` (see supabase/schema.sql) — they have no SELECT rights.
// So this must NOT chain `.select()` after `.insert()`: reading the new row back
// is a SELECT, which row-level security blocks, and the whole submit then fails.
//
// Returns a result object instead of throwing, because Next.js hides the message
// of errors thrown from server actions in production.
export async function submitEnquiry(
  enquiry: NewEnquiry,
): Promise<SubmitEnquiryResult> {
  const data: NewEnquiry = {
    name: clean(enquiry.name, 120),
    store_name: clean(enquiry.store_name, 160) || null,
    phone: clean(enquiry.phone, 30),
    email: clean(enquiry.email, 160) || null,
    product_name: clean(enquiry.product_name, 200) || null,
    product_id: enquiry.product_id ?? null,
    message: clean(enquiry.message, 3000) || null,
  }

  if (!data.name) return { ok: false, error: 'Please enter your name.' }
  if (data.phone.replace(/\D/g, '').length < 8)
    return { ok: false, error: 'Please enter a valid phone number.' }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { ok: false, error: 'Please enter a valid email address.' }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('enquiries')
      .insert({ ...data, status: 'New' })

    if (error) {
      console.error('Enquiry insert failed:', error.code, error.message)
      return {
        ok: false,
        error:
          "We couldn't send your enquiry right now. Please try again, or contact us on WhatsApp or phone.",
      }
    }
  } catch (err) {
    console.error('Enquiry insert crashed:', err)
    return {
      ok: false,
      error:
        "We couldn't send your enquiry right now. Please try again, or contact us on WhatsApp or phone.",
    }
  }

  // Email alert runs after the response is sent (and is kept alive on serverless hosts).
  after(() =>
    sendEnquiryEmail(data).catch((err) =>
      console.error('Email notification failed:', err),
    ),
  )

  revalidatePath('/admin')
  return { ok: true }
}

// Fetch all enquiries (admin only)
export async function getEnquiries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// Mark an enquiry as responded (admin only)
export async function markResponded(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('enquiries')
    .update({ status: 'Responded' })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// ============================================================
// EMAIL NOTIFICATION
// Uses Resend (resend.com) — free for up to 3,000 emails/month.
// Sign up free, verify a sender (or use their test domain), add RESEND_API_KEY to .env.local
// ============================================================
const esc = (v: string | null | undefined) =>
  (v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

async function sendEnquiryEmail(enquiry: NewEnquiry) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      'RESEND_API_KEY not set — skipping email notification. Enquiry is still saved in the database.',
    )
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Using Resend's shared test sender by default — swap to your own verified
      // domain (e.g. notify@gdntmedicare.com) once you've added and verified it in Resend.
      from: 'GDNT Medicare Website <onboarding@resend.dev>',
      to: process.env.ADMIN_NOTIFICATION_EMAIL || 'orders@gdntmedicare.com',
      reply_to: enquiry.email || undefined, // lets you hit "Reply" and go straight to the customer
      subject: `New Enquiry: ${enquiry.name.replace(/[\r\n]+/g, ' ')}${enquiry.product_name ? ` — ${enquiry.product_name}` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #0F6E4E;">New enquiry received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Name</strong></td><td style="padding: 6px 0;">${esc(enquiry.name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Store/Clinic</strong></td><td style="padding: 6px 0;">${esc(enquiry.store_name) || '-'}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Phone</strong></td><td style="padding: 6px 0;">${esc(enquiry.phone)}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Email</strong></td><td style="padding: 6px 0;">${esc(enquiry.email) || '-'}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470;"><strong>Product</strong></td><td style="padding: 6px 0;">${esc(enquiry.product_name) || '-'}</td></tr>
            <tr><td style="padding: 6px 0; color: #5B6470; vertical-align: top;"><strong>Message</strong></td><td style="padding: 6px 0;">${esc(enquiry.message) || '-'}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #5B6470;">View and respond to this enquiry in your <a href="https://gdntmedicare.com/admin" style="color: #0F6E4E;">admin dashboard</a>.</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`Resend API error (${res.status}):`, body)
  }
}

// ============================================================
// REPLY TO A CUSTOMER FROM THE ADMIN DASHBOARD
// Sends the typed reply to the customer's email through Resend, with
// Reply-To pointing back to the company inbox, then marks the enquiry as
// Responded. Admin only.
//
// Needs in .env.local:
//   RESEND_API_KEY=re_...
//   EMAIL_FROM="GDNT Medicare <orders@gdntmedicare.com>"   (a sender on a domain
//       verified in Resend. Resend's shared test sender can only deliver to the
//       Resend account owner, so it cannot reach customers.)
// ============================================================
export type SendReplyResult =
  | { ok: true; to: string }
  | { ok: false; error: string }

export async function sendEnquiryReply(
  id: string,
  subject: string,
  message: string,
): Promise<SendReplyResult> {
  const supabase = await createClient()

  // Only a signed-in admin may send email from this site.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return {
      ok: false,
      error: 'Your session has expired. Please sign in again.',
    }

  const subj = (subject ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 200)
  const body = (message ?? '').trim().slice(0, 5000)
  if (!subj) return { ok: false, error: 'Please enter a subject.' }
  if (!body) return { ok: false, error: 'Please write your reply.' }

  // Recipient comes from the database, never from the browser.
  const { data: enq, error: findErr } = await supabase
    .from('enquiries')
    .select('id, name, email')
    .eq('id', id)
    .single()
  if (findErr || !enq)
    return { ok: false, error: 'Could not find this enquiry.' }
  if (!enq.email)
    return { ok: false, error: 'This customer did not give an email address.' }

  if (!process.env.RESEND_API_KEY) {
    return {
      ok: false,
      error:
        'Email sending is not set up yet. Add RESEND_API_KEY and EMAIL_FROM to .env.local and restart the server.',
    }
  }

  const from = process.env.EMAIL_FROM || 'GDNT Medicare <onboarding@resend.dev>'
  const replyTo =
    process.env.ADMIN_NOTIFICATION_EMAIL || 'orders@gdntmedicare.com'

  const html = `<div style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #14181F; max-width: 560px;">${esc(
    body,
  ).replace(/\n/g, '<br />')}</div>`

  let res: Response
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: enq.email,
        reply_to: replyTo,
        subject: subj,
        text: body,
        html,
      }),
    })
  } catch (err) {
    console.error('Reply email request failed:', err)
    return {
      ok: false,
      error:
        'Could not reach the email service. Check your internet and try again.',
    }
  }

  if (!res.ok) {
    const raw = await res.text()
    console.error(`Resend API error (${res.status}):`, raw)
    let detail = ''
    try {
      detail = JSON.parse(raw)?.message ?? ''
    } catch {}
    const testSenderLimit =
      /own email address|verify a domain|testing emails/i.test(detail)
    return {
      ok: false,
      error: testSenderLimit
        ? "Resend's test sender can only email your own account address. Verify your domain in Resend and set EMAIL_FROM to an address on it."
        : `Email was not sent${detail ? `: ${detail}` : '.'}`,
    }
  }

  // Sent. Mark as responded (a failure here must not hide the fact the mail went out).
  const { error: updErr } = await supabase
    .from('enquiries')
    .update({ status: 'Responded' })
    .eq('id', id)
  if (updErr)
    console.error('Reply sent but status update failed:', updErr.message)

  revalidatePath('/admin')
  return { ok: true, to: enq.email }
}
