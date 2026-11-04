import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard | GDNT Medicare',
  robots: { index: false, follow: false },
}

// Only a logged-in admin may see the dashboard. Enquiries are protected by
// database rules that also require a login, so without a session the
// dashboard would silently show nothing.
export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
