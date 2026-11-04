import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminLoginForm from '@/components/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login | GDNT Medicare',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Already signed in: go straight to the dashboard
  if (user) {
    redirect('/admin')
  }

  return <AdminLoginForm />
}
