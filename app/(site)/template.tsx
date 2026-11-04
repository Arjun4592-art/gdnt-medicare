// A template re-mounts on every navigation, so each page fades in softly.
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='animate-page'>{children}</div>
}
