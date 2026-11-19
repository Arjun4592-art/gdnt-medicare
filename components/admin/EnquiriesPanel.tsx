'use client'

import { useState, useEffect, Fragment } from 'react'
import { Enquiry } from '@/lib/enquiries'
import { sendEnquiryReply } from '@/lib/actions/enquiries'
import { Badge, EmptyState, GhostButton, PageHeader, Segmented, Th } from './ui'

// ---- helpers for replying to an enquiry ----
function waNumber(phone?: string) {
  const d = (phone || '').replace(/\D/g, '')
  if (d.length < 10) return ''
  // 10-digit Indian mobile numbers get the +91 country code
  return d.length === 10 ? `91${d}` : d.replace(/^0+/, '')
}

function replyText(e: Enquiry) {
  const topic =
    e.product && e.product !== 'General enquiry' ? ` about ${e.product}` : ''
  return `Hello ${e.name}, thank you for your enquiry${topic} at GDNT Medicare Pvt. Ltd. `
}

function defaultReplySubject(e: Enquiry) {
  const topic =
    e.product && e.product !== 'General enquiry' ? ` - ${e.product}` : ''
  return `Re: Your enquiry${topic} | GDNT Medicare`
}

function defaultReplyBody(e: Enquiry) {
  return `${replyText(e).trim()}\n\n\n\nRegards,\nGDNT Medicare Pvt. Ltd.\n+91 86798 84419`
}

function emailReplyLink(e: Enquiry) {
  const topic =
    e.product && e.product !== 'General enquiry' ? ` - ${e.product}` : ''
  const subject = `Re: Your enquiry${topic} | GDNT Medicare`
  const body = `${replyText(e)}\n\n\n\nRegards,\nGDNT Medicare Pvt. Ltd.\n+91 86798 84419`
  return `mailto:${e.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function whatsappLink(e: Enquiry) {
  return `https://wa.me/${waNumber(e.phone)}?text=${encodeURIComponent(replyText(e))}`
}

// Phone / touch devices: a real "Call" button that opens the dialer.
// Desktop (mouse): there is no dialer, so show the number and let the admin copy it.
function CallButton({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false)
  const btn =
    'items-center gap-2 bg-white border border-line px-4 py-2.5 rounded-md text-[13px] font-bold text-navy hover:border-forest hover:text-forest transition-colors'

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the number is still visible to copy by hand */
    }
  }

  return (
    <>
      <a
        href={`tel:${phone}`}
        className={`inline-flex pointer-fine:hidden ${btn}`}
      >
        Call {phone}
      </a>
      <button
        type='button'
        onClick={copy}
        title='Click to copy the number'
        className={`hidden pointer-fine:inline-flex ${btn}`}
      >
        <span className='tabular-nums'>{phone}</span>
        <span className='text-[11px] font-semibold text-muted'>
          {copied ? '✓ Copied' : 'Copy'}
        </span>
      </button>
    </>
  )
}

export default function EnquiriesPanel({
  enquiries,
  onRespond,
  onRefresh,
  focusId,
  onFocusHandled,
}: {
  enquiries: Enquiry[]
  onRespond: (id: number) => void
  onRefresh: () => Promise<void> | void
  focusId?: number | null
  onFocusHandled?: () => void
}) {
  const [filter, setFilter] = useState<'All' | 'New' | 'Responded'>('All')
  const [openId, setOpenId] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // in-dashboard email reply composer (one at a time)
  const [composeId, setComposeId] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sentNote, setSentNote] = useState('')

  function toggleRow(id: number) {
    setOpenId(openId === id ? null : id)
    setComposeId(null)
    setSendError('')
    setSentNote('')
  }

  function openComposer(e: Enquiry) {
    if (composeId === e.id) {
      setComposeId(null)
      return
    }
    setComposeId(e.id)
    setSubject(defaultReplySubject(e))
    setBody(defaultReplyBody(e))
    setSendError('')
    setSentNote('')
  }

  async function sendReply(e: Enquiry) {
    setSending(true)
    setSendError('')
    try {
      const res = await sendEnquiryReply(String(e.id), subject, body)
      if (!res.ok) {
        setSendError(res.error)
        return
      }
      setComposeId(null)
      setSentNote(`Reply sent to ${res.to}. Marked as responded.`)
      await onRefresh()
    } catch (err) {
      console.error(err)
      setSendError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // Arriving from the Overview: show all, open that enquiry and scroll to it
  useEffect(() => {
    if (focusId == null) return
    setFilter('All')
    setOpenId(focusId)
    // (not cleared on cleanup: onFocusHandled() resets focusId right away,
    // which would re-run this effect and cancel the scroll)
    window.setTimeout(() => {
      document
        .getElementById(`enquiry-${focusId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    onFocusHandled?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  async function refresh() {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }
  const filtered = enquiries.filter(
    (e) => filter === 'All' || e.status === filter,
  )
  const count = (f: 'All' | 'New' | 'Responded') =>
    f === 'All'
      ? enquiries.length
      : enquiries.filter((e) => e.status === f).length
  const filterLabels = [
    `All (${count('All')})`,
    `New (${count('New')})`,
    `Responded (${count('Responded')})`,
  ] as const

  return (
    <div>
      <PageHeader
        title='Enquiries'
        subtitle='Messages submitted through the contact form and product pages.'
        actions={
          <GhostButton icon='refresh' onClick={refresh} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </GhostButton>
        }
      />
      <div className='mb-5'>
        <Segmented
          options={filterLabels}
          value={filterLabels[['All', 'New', 'Responded'].indexOf(filter)]}
          onChange={(label) =>
            setFilter(
              (['All', 'New', 'Responded'] as const)[
                filterLabels.indexOf(label)
              ],
            )
          }
        />
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon='enquiries'
          title={
            filter === 'All'
              ? 'No enquiries yet'
              : `No ${filter.toLowerCase()} enquiries`
          }
          text='When a customer submits the contact form it will show up here.'
        />
      ) : (
        <div className='bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto shadow-[0_1px_2px_rgba(20,24,31,0.04)]'>
          <table className='w-full min-w-[800px]'>
            <thead>
              <tr>
                {[
                  'Name',
                  'Store / Clinic',
                  'Product',
                  'Contact',
                  'Date',
                  'Status',
                  'Action',
                ].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <Fragment key={e.id}>
                  <tr
                    id={`enquiry-${e.id}`}
                    onClick={() => toggleRow(e.id)}
                    className={`transition-colors cursor-pointer scroll-mt-24 ${
                      openId === e.id ? 'bg-forest-pale/40' : 'hover:bg-bg-soft'
                    }`}
                  >
                    <td className='px-6 py-4 text-[13.5px] font-bold text-navy border-b border-line'>
                      {e.name}
                      <span className='block text-[11px] font-semibold text-forest mt-0.5'>
                        {openId === e.id ? 'Hide details' : 'View details'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                      {e.store}
                    </td>
                    <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                      {e.product}
                    </td>
                    <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                      {e.contact}
                    </td>
                    <td className='px-6 py-4 text-[13.5px] border-b border-line'>
                      {e.date}
                    </td>
                    <td className='px-6 py-4 border-b border-line'>
                      <Badge tone={e.status === 'New' ? 'green' : 'gray'} dot>
                        {e.status}
                      </Badge>
                    </td>
                    <td className='px-6 py-4 border-b border-line whitespace-nowrap'>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation()
                          toggleRow(e.id)
                        }}
                        className={`px-4 py-2 rounded-md text-[12.5px] font-bold transition-colors ${
                          e.status === 'New'
                            ? 'bg-forest text-white hover:bg-forest-dark'
                            : 'bg-bg-soft text-navy hover:bg-forest-pale'
                        }`}
                      >
                        {openId === e.id
                          ? 'Close'
                          : e.status === 'New'
                            ? 'Respond'
                            : 'View'}
                      </button>
                    </td>
                  </tr>
                  {openId === e.id && (
                    <tr className='bg-bg-soft'>
                      <td
                        colSpan={7}
                        className='px-6 py-5 border-b border-line text-[13.5px]'
                      >
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                          <div>
                            <div className='text-[11px] uppercase tracking-wide text-muted font-semibold'>
                              Phone
                            </div>
                            <div className='mt-1 font-semibold text-navy'>
                              {e.phone ? (
                                <a
                                  href={`tel:${e.phone}`}
                                  className='hover:text-forest'
                                >
                                  {e.phone}
                                </a>
                              ) : (
                                '-'
                              )}
                            </div>
                          </div>
                          <div>
                            <div className='text-[11px] uppercase tracking-wide text-muted font-semibold'>
                              Email
                            </div>
                            <div className='mt-1 font-semibold text-navy break-all'>
                              {e.email ? (
                                <a
                                  href={`mailto:${e.email}`}
                                  className='hover:text-forest'
                                >
                                  {e.email}
                                </a>
                              ) : (
                                '-'
                              )}
                            </div>
                          </div>
                          <div className='sm:col-span-3'>
                            <div className='text-[11px] uppercase tracking-wide text-muted font-semibold'>
                              Message
                            </div>
                            <p className='mt-1 text-navy whitespace-pre-wrap leading-relaxed'>
                              {e.message || 'No message provided.'}
                            </p>
                          </div>
                        </div>

                        <div className='mt-5 pt-5 border-t border-line'>
                          <div className='text-[11px] uppercase tracking-wide text-muted font-semibold mb-3'>
                            Respond to this enquiry
                          </div>
                          <div className='flex flex-wrap gap-2.5'>
                            {e.email && (
                              <button
                                onClick={() => openComposer(e)}
                                className={`inline-flex items-center gap-2 border px-4 py-2.5 rounded-md text-[13px] font-bold transition-colors ${
                                  composeId === e.id
                                    ? 'bg-forest-pale border-forest text-forest'
                                    : 'bg-white border-line text-navy hover:border-forest hover:text-forest'
                                }`}
                              >
                                Reply by email
                              </button>
                            )}
                            {waNumber(e.phone) && (
                              <a
                                href={whatsappLink(e)}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 bg-white border border-line px-4 py-2.5 rounded-md text-[13px] font-bold text-navy hover:border-forest hover:text-forest transition-colors'
                              >
                                Reply on WhatsApp
                              </a>
                            )}
                            {e.phone && <CallButton phone={e.phone} />}
                            {e.status === 'New' ? (
                              <button
                                onClick={() => onRespond(e.id)}
                                className='inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-md text-[13px] font-bold hover:bg-forest-dark transition-colors sm:ml-auto'
                              >
                                Mark as responded
                              </button>
                            ) : (
                              <span className='inline-flex items-center px-4 py-2.5 rounded-md text-[13px] font-bold text-forest bg-forest-pale sm:ml-auto'>
                                Responded
                              </span>
                            )}
                          </div>
                          {sentNote && openId === e.id && (
                            <p
                              role='status'
                              className='mt-4 bg-forest-pale border border-forest/20 rounded-md px-4 py-3 text-[13px] font-bold text-forest'
                            >
                              {sentNote}
                            </p>
                          )}

                          {composeId === e.id && (
                            <div className='mt-4 bg-white border border-line rounded-md p-4 sm:p-5'>
                              <div className='grid grid-cols-1 sm:grid-cols-[70px_1fr] gap-x-4 gap-y-3 items-center'>
                                <label className='text-[12px] uppercase tracking-wide text-muted font-semibold'>
                                  To
                                </label>
                                <div className='text-[13.5px] font-semibold text-navy break-all'>
                                  {e.name} &lt;{e.email}&gt;
                                </div>
                                <label
                                  htmlFor={`subject-${e.id}`}
                                  className='text-[12px] uppercase tracking-wide text-muted font-semibold'
                                >
                                  Subject
                                </label>
                                <input
                                  id={`subject-${e.id}`}
                                  value={subject}
                                  onChange={(ev) => setSubject(ev.target.value)}
                                  className='w-full border border-[#cfd4da] rounded-md px-3 py-2.5 text-[13.5px] focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
                                />
                              </div>
                              <textarea
                                value={body}
                                onChange={(ev) => setBody(ev.target.value)}
                                rows={9}
                                aria-label='Reply message'
                                className='mt-3 w-full border border-[#cfd4da] rounded-md px-3 py-2.5 text-[13.5px] leading-relaxed focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20'
                              />
                              {sendError && (
                                <p
                                  role='alert'
                                  className='mt-3 text-[#C0392B] text-[13px] font-bold'
                                >
                                  {sendError}
                                </p>
                              )}
                              <div className='mt-3 flex flex-wrap items-center gap-3'>
                                <button
                                  onClick={() => sendReply(e)}
                                  disabled={sending}
                                  className='bg-forest text-white px-5 py-2.5 rounded-md text-[13px] font-bold hover:bg-forest-dark transition-colors disabled:opacity-60'
                                >
                                  {sending ? 'Sending...' : 'Send reply'}
                                </button>
                                <button
                                  onClick={() => setComposeId(null)}
                                  disabled={sending}
                                  className='px-4 py-2.5 rounded-md text-[13px] font-bold text-muted hover:text-navy'
                                >
                                  Cancel
                                </button>
                                <a
                                  href={emailReplyLink(e)}
                                  className='ml-auto text-[12.5px] font-semibold text-muted hover:text-forest'
                                >
                                  Open in my mail app instead
                                </a>
                              </div>
                              <p className='mt-3 text-[12px] text-muted'>
                                The customer can reply straight to your company
                                inbox. Sending also marks this enquiry as
                                responded.
                              </p>
                            </div>
                          )}

                          <p className='mt-3 text-[12px] text-muted'>
                            Reply by email or WhatsApp first, then click “Mark
                            as responded” so the team knows it is handled.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
