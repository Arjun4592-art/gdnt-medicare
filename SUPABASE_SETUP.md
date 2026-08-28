# Supabase Setup Guide — GDNT Medicare

Follow these steps in order. Takes about 10 minutes.

## 1. Create your Supabase project
1. Go to https://supabase.com → Sign up (free) → **New Project**
2. Name it `gdnt-medicare`, set a database password (save it somewhere safe), pick a region close to India (e.g. Singapore)
3. Wait ~2 minutes for the project to spin up

## 2. Run the database schema
1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/schema.sql` from this project, copy all of it, paste into the editor
4. Click **Run** — this creates the `products` and `enquiries` tables, security rules, and inserts your 12 dummy products

## 3. Get your API keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy the **Project URL** and the **anon public** key
3. In this project, copy `.env.example` to `.env.local`
4. Paste your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

## 4. Create your admin login
1. In Supabase, go to **Authentication** → **Users** → **Add User**
2. Enter your email and a password — this is what you'll use to log into `/admin`
3. Leave "Auto Confirm User" checked

## 5. Set up email notifications (Resend — free)
Resend's free plan covers 3,000 emails/month (100/day) — more than enough for enquiry alerts.

1. Sign up free at https://resend.com (no credit card needed)
2. Go to **API Keys** → **Create API Key** → copy it
3. In `.env.local`, add:
   ```
   RESEND_API_KEY=re_xxxxxxxxx
   ADMIN_NOTIFICATION_EMAIL=your-real-email@example.com
   ```
4. That's it — by default this uses Resend's shared test sender (`onboarding@resend.dev`), which works immediately with no domain setup.
   - To send from your own address instead (e.g. `notify@gdntmedicare.com`), go to **Domains** in Resend, add and verify `gdntmedicare.com` (a few DNS records), then update the `from` address in `lib/actions/enquiries.ts`.

Without this step, enquiries still save to the dashboard fine — you just won't get an email alert.

## 6. Set up product images
1. In Supabase, go to **Storage** → **Create a new bucket**
2. Name it `product-images`, toggle **Public bucket: ON**
3. Run `supabase/schema.sql` (or re-run it — the storage policies at the bottom are safe to re-run) so the admin dashboard is allowed to upload photos
4. That's it — in the Admin Dashboard, **Add New Product** / **Edit Product** now has an "Add photo" tile. Upload up to 4 images per product directly from there; no manual URLs needed. The first image is used as the product's main photo across the site.

## 7. Run the project
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` for the site, and `http://localhost:3000/admin/login` to log into the dashboard.

## 8. Deploy
- Push this project to GitHub
- Import it on https://vercel.com (free)
- Add the same environment variables from `.env.local` in Vercel's project settings
- Deploy — done

---

**Note on the current wiring**: the public pages (`app/(site)/...`) currently still read from the static
`lib/products.ts` dummy data so the site works immediately without setup. Once your Supabase project is
live, swap those imports for the functions in `lib/actions/products.ts` (e.g. `getActiveProducts()`)
to pull real data. The admin dashboard, login, and contact form are already wired to Supabase and just need
your `.env.local` keys to go live.
