// Helpers for images hosted on Cloudinary.
// Cloudinary already resizes + converts (WebP/AVIF) on its CDN, so we ask it for the
// exact size we need instead of routing through Next's image optimizer (one hop less = faster).

export const isCloudinary = (url?: string | null): boolean =>
  !!url && url.includes('res.cloudinary.com') && url.includes('/upload/')

/** Return a width-limited, auto-format/quality version of a Cloudinary URL (never upscales). */
export function cld(url: string, width: number): string {
  if (!isCloudinary(url)) return url
  const transform = `f_auto,q_auto,c_limit,w_${width}`
  return url.replace(/\/upload\/(f_auto,q_auto\/)?/, `/upload/${transform}/`)
}
