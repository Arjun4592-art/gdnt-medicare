import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='site flex flex-1 flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
