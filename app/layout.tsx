import type { Metadata } from 'next'
import { Public_Sans, Source_Serif_4 } from 'next/font/google'
import './globals.css'

// Body / UI font: Public Sans (clean, very readable at small sizes, built for institutional sites).
const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-public-sans',
  display: 'swap',
})

// Heading font: Source Serif 4 (calm, trustworthy serif — reads "pharma / medical journal", not "startup").
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default:
      'GDNT Medicare Pvt. Ltd. | Ethical Pharmaceutical Company in Meerut',
    template: '%s | GDNT Medicare Pvt. Ltd.',
  },
  description:
    'GDNT Medicare Pvt. Ltd. is an ethical pharmaceutical company based in Meerut, Uttar Pradesh, supplying genuine, quality-assured medicines to doctors and medical stores. Browse our catalog and enquire for trade pricing.',
  keywords: [
    'ethical pharmaceutical company',
    'ethical pharma company Meerut',
    'pharmaceutical manufacturer Uttar Pradesh',
    'medicine supplier India',
    'GDNT Medicare',
    'PCD pharma',
  ],
  metadataBase: new URL('https://gdntmedicare.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'GDNT Medicare Pvt. Ltd.',
    title: 'GDNT Medicare Pvt. Ltd. | Ethical Pharmaceutical Company in Meerut',
    description:
      'Ethical pharmaceutical company — quality medicines, genuine products, trusted by doctors and medical stores.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://gdntmedicare.com',
    images: [
      {
        url: '/logo.png',
        alt: 'GDNT Medicare Pvt. Ltd. logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDNT Medicare Pvt. Ltd. | Ethical Pharmaceutical Company',
    description:
      'Ethical pharmaceutical company — quality medicines, genuine products, trusted by doctors and medical stores.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GDNT Medicare Pvt. Ltd.',
  url: 'https://gdntmedicare.com',
  logo: 'https://gdntmedicare.com/logo.png',
  description:
    'GDNT Medicare Pvt. Ltd. is an ethical pharmaceutical manufacturing and supplying company based in Meerut, Uttar Pradesh, offering ethical pharmaceutical and OTC medicines.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Poothkhas, Rohta Road',
    addressLocality: 'Meerut',
    addressRegion: 'Uttar Pradesh',
    postalCode: '250502',
    addressCountry: 'IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`antialiased ${publicSans.variable} ${sourceSerif.variable}`}
    >
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  )
}
