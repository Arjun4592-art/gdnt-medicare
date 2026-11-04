'use client'

import { useState, FormEvent } from 'react'
import { submitEnquiry } from '@/lib/actions/enquiries'

export default function ContactForm({
  defaultProduct = '',
}: {
  defaultProduct?: string
}) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSubmitted(false)
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await submitEnquiry({
        name: formData.get('name') as string,
        store_name: formData.get('store_name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        product_name: formData.get('product_name') as string,
        product_id: null,
        message: formData.get('message') as string,
      })
      if (!res.ok) {
        setSubmitted(false)
        setError(res.error)
        return
      }
      setSubmitted(true)
      form.reset()
    } catch (err) {
      setSubmitted(false)
      setError(
        'Something went wrong. Please try again or contact us via WhatsApp/phone.',
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white border border-line rounded-md p-6 sm:p-10'>
      <h2 className='text-[24px] font-semibold text-navy mb-1'>
        Send an enquiry
      </h2>
      <p className='text-[14px] text-muted mb-7'>
        Fields marked with * are required.
      </p>
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-[13px] font-semibold text-navy mb-1.5'>
              Full name *
            </label>
            <input
              name='name'
              required
              type='text'
              placeholder='Dr. Ramesh Gupta'
              className='w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-navy mb-1.5'>
              Clinic / store name
            </label>
            <input
              name='store_name'
              type='text'
              placeholder='City Medical Store'
              className='w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
            />
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-[13px] font-semibold text-navy mb-1.5'>
              Phone number *
            </label>
            <input
              name='phone'
              required
              type='tel'
              placeholder='+91 00000 00000'
              className='w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-navy mb-1.5'>
              Email address
            </label>
            <input
              name='email'
              type='email'
              placeholder='you@example.com'
              className='w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
            />
          </div>
        </div>
        <div>
          <label className='block text-[13px] font-semibold text-navy mb-1.5'>
            Product / requirement
          </label>
          <input
            name='product_name'
            type='text'
            defaultValue={defaultProduct}
            placeholder='e.g. Amlogard 5mg — bulk quote'
            className='w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
          />
        </div>
        <div>
          <label className='block text-[13px] font-semibold text-navy mb-1.5'>
            Message
          </label>
          <textarea
            name='message'
            rows={4}
            placeholder='Tell us more about your requirement...'
            className='w-full border border-[#cfd4da] rounded-md px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-forest text-white py-3.5 rounded-md font-bold text-[14.5px] transition-colors hover:bg-forest-dark disabled:opacity-60'
        >
          {loading ? 'Sending...' : 'Send enquiry'}
        </button>
        {submitted && (
          <p
            role='status'
            className='bg-forest-pale border border-forest/20 rounded-md py-3 px-4 text-forest text-[13.5px] font-bold text-center'
          >
            Thank you. We&apos;ll get back to you shortly.
          </p>
        )}
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
  )
}
