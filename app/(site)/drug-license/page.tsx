import LegalPage from '@/components/LegalPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drug License Info',
  description:
    'Drug licence and regulatory information for GDNT Medicare Pvt. Ltd., an ethical pharmaceutical company in Meerut, Uttar Pradesh.',
  alternates: { canonical: '/drug-license' },
}

/**
 * Fill these in with the company's real licence details.
 * Rows with an empty value are hidden automatically, so nothing
 * placeholder-like is ever shown to visitors.
 */
const LICENSES: { label: string; value: string }[] = [
  { label: 'Drug Licence No.', value: '' },
  { label: 'Issued by', value: '' },
  { label: 'Valid up to', value: '' },
  { label: 'GST No.', value: '' },
  { label: 'CIN', value: '' },
]

export default function DrugLicensePage() {
  const filled = LICENSES.filter((l) => l.value.trim())

  return (
    <LegalPage
      title='Drug License Info'
      current='Drug License Info'
      updated='November 2026'
      intro='GDNT Medicare Pvt. Ltd. operates as a licensed pharmaceutical company and trades only through registered medical professionals and licensed stores.'
      sections={[
        {
          title: 'Company details',
          body: (
            <>
              <p>
                <span className='text-navy font-semibold'>
                  GDNT Medicare Pvt. Ltd.
                </span>
                <br />
                Poothkhas, Rohta Road, Meerut, Uttar Pradesh 250502
              </p>
              {filled.length > 0 && (
                <ul className='border border-line rounded-md divide-y divide-line'>
                  {filled.map((l) => (
                    <li
                      key={l.label}
                      className='flex justify-between gap-4 px-4 py-3 text-[14px]'
                    >
                      <span className='font-semibold'>{l.label}</span>
                      <span className='text-navy font-bold text-right'>
                        {l.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ),
        },
        {
          title: 'Regulatory compliance',
          body: (
            <p>
              We operate under the Drugs and Cosmetics Act, 1940 and the rules
              made under it. Our medicines are manufactured and supplied in line
              with GMP guidelines and are meant for sale through licensed
              channels only.
            </p>
          ),
        },
        {
          title: 'Who we supply',
          body: (
            <p>
              Medicines are supplied only to registered medical practitioners,
              hospitals and licensed chemists or distributors. Prescription
              drugs are not sold directly to patients, and the product listings
              on this website are for trade information and enquiries only.
            </p>
          ),
        },
        {
          title: 'Verification of licences',
          body: (
            <p>
              Licensed buyers and regulatory authorities can request a copy of
              our current licence documents for verification. Please contact us
              using the details below and mention your registration or licence
              number.
            </p>
          ),
        },
      ]}
    />
  )
}
