import CertLogo from '@/components/CertLogo'

/**
 * WHO-GMP is a single certification, so its two marks (WHO + GMP) are always
 * shown together as one unit — never as two separate badges.
 *
 * size: "sm" for chips / footer, "md" for larger certification cards
 * bare: drop the white tile + border (use when the parent already draws one)
 */
export default function WhoGmpMark({
  size = 'sm',
  bare = false,
  className = '',
}: {
  size?: 'sm' | 'md'
  bare?: boolean
  className?: string
}) {
  const h = size === 'md' ? 'h-14' : 'h-8'
  return (
    <span
      className={`inline-flex items-center gap-2 ${
        bare ? '' : 'bg-white border border-line rounded px-2 py-1.5'
      } ${className}`}
    >
      <CertLogo
        src='/who-logo.png'
        alt='World Health Organization logo'
        className={`${h} w-auto`}
        fallback={<span className='text-forest font-bold text-xs'>WHO</span>}
      />
      <span className='w-px self-stretch bg-line' aria-hidden='true' />
      <CertLogo
        src='/gmp-logo.jpg'
        alt='GMP certified logo'
        className={`${h} w-auto`}
        fallback={<span className='text-forest font-bold text-xs'>GMP</span>}
      />
    </span>
  )
}
