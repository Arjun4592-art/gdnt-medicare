'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { login } from '@/lib/actions/auth'

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)

    try {
      // On success the action redirects to /admin; it only returns on failure.
      const res = await login(
        String(fd.get('email') ?? '').trim(),
        String(fd.get('password') ?? ''),
      )
      if (res?.error) {
        setError(
          res.error === 'Invalid login credentials'
            ? 'Wrong email or password.'
            : res.error,
        )
        setLoading(false)
      }
    } catch (err) {
      // Next.js redirects are thrown internally; anything reaching here that
      // is not a redirect is a real failure.
      const digest = (err as { digest?: string } | null)?.digest
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) {
        return
      }
      console.error(err)
      setError('Could not sign in. Please try again.')
      setLoading(false)
    }
  }

  const input =
    'w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'

  return (
    <main className='min-h-screen flex items-center justify-center bg-bg-soft px-5 py-10'>
      <div className='w-full max-w-[400px]'>
        <div className='flex justify-center mb-7'>
          <Image
            src='/logo.png'
            alt='GDNT Medicare'
            width={776}
            height={322}
            priority
            className='h-[52px] w-auto'
          />
        </div>

        <div className='bg-white border border-line rounded-md p-7 sm:p-9'>
          <h1 className='text-[22px] font-semibold text-navy'>Admin login</h1>
          <p className='text-[13.5px] text-muted mt-1 mb-6'>
            Sign in to manage products and enquiries.
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-[13px] font-semibold text-navy mb-1.5'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                autoComplete='username'
                placeholder='you@example.com'
                className={input}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-[13px] font-semibold text-navy mb-1.5'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                autoComplete='current-password'
                className={input}
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-forest text-white py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-dark disabled:opacity-60'
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {error && (
              <p
                role='alert'
                className='text-[#C0392B] text-[13px] font-bold text-center'
              >
                {error}
              </p>
            )}
          </form>
        </div>

        <p className='text-center mt-6 text-[13px]'>
          <Link href='/' className='text-muted hover:text-forest'>
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  )
}
