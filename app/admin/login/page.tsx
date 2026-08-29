'use client'

import { useState } from 'react'
import Image from 'next/image'
import { login } from '@/lib/actions/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-bg-soft flex items-center justify-center p-6'>
      <div className='w-full max-w-[400px] bg-white border border-line rounded-2xl p-10'>
        <div className='flex flex-col items-center mb-8'>
          <Image
            src='/logo.png'
            alt='GDNT Medicare'
            width={776}
            height={322}
            quality={100}
            className='h-12 w-auto mb-3'
          />
          <h1 className='text-xl font-extrabold text-navy'>Admin Login</h1>
          <p className='text-[13px] text-muted mt-1'>GDNT Medicare Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-bold text-navy mb-2'>
              Email
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-line rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale'
              placeholder='admin@gdntmedicare.com'
            />
          </div>
          <div>
            <label className='block text-xs font-bold text-navy mb-2'>
              Password
            </label>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-line rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-pale'
              placeholder='••••••••'
            />
          </div>
          {error && (
            <p className='text-[#C0392B] text-[13px] font-semibold'>{error}</p>
          )}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-forest text-white py-3.5 rounded-lg font-bold text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
