import LegalPage from '@/components/LegalPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Trade',
  description:
    'Terms of trade for doctors, medical stores and distributors dealing with GDNT Medicare Pvt. Ltd.',
  alternates: { canonical: '/terms-of-trade' },
}

export default function TermsOfTradePage() {
  return (
    <LegalPage
      title='Terms of Trade'
      current='Terms of Trade'
      updated='November 2026'
      intro='These terms apply to all supply of products by GDNT Medicare Pvt. Ltd. and to the use of this website.'
      sections={[
        {
          title: 'Eligibility',
          body: (
            <p>
              We supply products only to registered medical practitioners,
              hospitals and valid drug-licence holders. By placing an enquiry or
              order, you confirm that you are legally permitted to buy and stock
              the products requested.
            </p>
          ),
        },
        {
          title: 'Website information',
          body: (
            <p>
              Product details, images, MRP and prices on this website are for
              information and may change without notice. Nothing here is medical
              advice or an offer to sell to the general public. Trade prices are
              shared on request.
            </p>
          ),
        },
        {
          title: 'Enquiries and orders',
          body: (
            <p>
              An enquiry or quotation is not a confirmed order. An order is
              accepted only when we confirm it in writing, and it remains
              subject to stock availability.
            </p>
          ),
        },
        {
          title: 'Pricing and payment',
          body: (
            <p>
              Prices are quoted in Indian Rupees and are exclusive of applicable
              taxes and freight unless stated otherwise. Payment terms are
              agreed at the time of order confirmation.
            </p>
          ),
        },
        {
          title: 'Delivery and risk',
          body: (
            <p>
              Delivery timelines are estimates. Please inspect each consignment
              on receipt and report any shortage or transit damage to us
              promptly, with photographs and the invoice number.
            </p>
          ),
        },
        {
          title: 'Returns and complaints',
          body: (
            <p>
              Medicines that are expired, damaged or not as ordered can be
              reported to us in writing with the batch number and invoice
              details. Returns and replacements are handled as per applicable
              drug regulations and are accepted only after our approval.
            </p>
          ),
        },
        {
          title: 'Storage and use',
          body: (
            <p>
              Buyers must store products as directed on the label and sell or
              dispense them only as allowed by law. Prescription medicines must
              be supplied against a valid prescription.
            </p>
          ),
        },
        {
          title: 'Limitation of liability',
          body: (
            <p>
              To the extent permitted by law, our liability is limited to the
              value of the products supplied. We are not liable for indirect or
              consequential loss, or for misuse of products after delivery.
            </p>
          ),
        },
        {
          title: 'Governing law',
          body: (
            <p>
              These terms are governed by the laws of India. Any dispute is
              subject to the jurisdiction of the courts at Meerut, Uttar
              Pradesh.
            </p>
          ),
        },
      ]}
    />
  )
}
