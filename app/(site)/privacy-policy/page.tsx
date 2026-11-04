import LegalPage from '@/components/LegalPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How GDNT Medicare Pvt. Ltd. collects, uses and protects the information you share through this website.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title='Privacy Policy'
      current='Privacy Policy'
      updated='November 2026'
      intro='This policy explains what information GDNT Medicare Pvt. Ltd. collects through this website and how we use and protect it.'
      sections={[
        {
          title: 'Information we collect',
          body: (
            <>
              <p>
                When you send an enquiry through our contact form, we collect
                the details you enter: your name, store or clinic name, phone
                number, email address, the product you are asking about and your
                message.
              </p>
              <p>
                If you contact us by phone, WhatsApp or email, we also hold the
                details you share in those conversations.
              </p>
            </>
          ),
        },
        {
          title: 'How we use it',
          body: (
            <p>
              We use your information only to reply to your enquiry, share
              quotations and trade pricing, process orders and keep a record of
              our business communication. We do not use it for consumer
              advertising.
            </p>
          ),
        },
        {
          title: 'Sharing of information',
          body: (
            <p>
              We do not sell or rent your personal information. It may be shared
              only with service providers who help us run the website, host our
              data or deliver orders, and with authorities when the law requires
              it.
            </p>
          ),
        },
        {
          title: 'Data storage and security',
          body: (
            <p>
              Enquiries are stored on secure cloud infrastructure with
              restricted access. We take reasonable steps to protect your data,
              but no method of transmission over the internet is completely
              secure.
            </p>
          ),
        },
        {
          title: 'Retention',
          body: (
            <p>
              We keep enquiry records for as long as needed for business and
              legal purposes, and delete them when they are no longer required.
            </p>
          ),
        },
        {
          title: 'Your choices',
          body: (
            <p>
              You can ask us to access, correct or delete the personal
              information we hold about you by writing to the email address
              below. We will respond within a reasonable time.
            </p>
          ),
        },
        {
          title: 'Third-party links',
          body: (
            <p>
              Links such as WhatsApp open external services that have their own
              privacy practices. We are not responsible for their content or
              policies.
            </p>
          ),
        },
        {
          title: 'Changes to this policy',
          body: (
            <p>
              We may update this policy from time to time. The latest version
              will always be available on this page with its updated date.
            </p>
          ),
        },
      ]}
    />
  )
}
