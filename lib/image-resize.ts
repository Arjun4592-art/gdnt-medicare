// Client-side image resizing used by the product form. Runs entirely in the
// browser (canvas), so large phone/camera photos are shrunk BEFORE they are
// uploaded — faster uploads, smaller storage, faster shop pages.

export type ResizeFormat = 'webp' | 'jpeg'

export interface ResizeOptions {
  /** Longest side in px. `null` keeps the original dimensions. */
  maxSize: number | null
  /** When true, images smaller than maxSize are enlarged to it (can look soft). Default: only shrink. */
  allowUpscale: boolean
  /** Fit the image inside a square canvas with white padding (max x max). Needs maxSize. */
  square: boolean
  format: ResizeFormat
  /** 0.5 – 1 */
  quality: number
}

export interface ResizeResult {
  file: File
  originalBytes: number
  newBytes: number
  width: number
  height: number
  /** true when the file was left untouched (unsupported type or already smaller) */
  skipped: boolean
}

export const DEFAULT_RESIZE: ResizeOptions = {
  maxSize: 1000,
  allowUpscale: false,
  square: false,
  format: 'webp',
  quality: 0.85,
}

export const MIN_CUSTOM_SIZE = 100
export const MAX_CUSTOM_SIZE = 4000

export const SIZE_PRESETS: { label: string; value: number | null }[] = [
  { label: '600 px (small)', value: 600 },
  { label: '800 px', value: 800 },
  { label: '1000 px (recommended)', value: 1000 },
  { label: '1200 px (large)', value: 1200 },
  { label: 'Keep original size', value: null },
]

const RESIZABLE = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/bmp',
]

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function loadBitmap(file: File): Promise<{
  source: CanvasImageSource
  width: number
  height: number
  close: () => void
}> {
  if (typeof createImageBitmap === 'function') {
    try {
      // 'from-image' applies the EXIF rotation so phone photos aren't sideways
      const bmp = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      })
      return {
        source: bmp,
        width: bmp.width,
        height: bmp.height,
        close: () => bmp.close(),
      }
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error(`Couldn't read "${file.name}".`))
      i.src = url
    })
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      close: () => {},
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function resizeImage(
  file: File,
  opts: ResizeOptions,
): Promise<ResizeResult> {
  const untouched: ResizeResult = {
    file,
    originalBytes: file.size,
    newBytes: file.size,
    width: 0,
    height: 0,
    skipped: true,
  }
  if (!RESIZABLE.includes(file.type)) return untouched

  const bmp = await loadBitmap(file)
  try {
    const { width: w, height: h } = bmp
    const max = opts.maxSize
      ? Math.min(
          MAX_CUSTOM_SIZE,
          Math.max(MIN_CUSTOM_SIZE, Math.round(opts.maxSize)),
        )
      : null
    // By default only shrink; enlarge small images only when the admin asked for it.
    const scale = max
      ? opts.allowUpscale
        ? max / Math.max(w, h)
        : Math.min(1, max / Math.max(w, h))
      : 1
    const drawW = Math.max(1, Math.round(w * scale))
    const drawH = Math.max(1, Math.round(h * scale))

    const useSquare = opts.square && !!max
    // Square mode: pad up to max x max, but never make a canvas bigger than needed for a small image.
    const side = useSquare ? Math.max(drawW, drawH, 1) : 0
    const canvasW = useSquare ? side : drawW
    const canvasH = useSquare ? side : drawH

    const canvas = document.createElement('canvas')
    canvas.width = canvasW
    canvas.height = canvasH
    const ctx = canvas.getContext('2d')
    if (!ctx) return untouched
    ctx.imageSmoothingQuality = 'high'

    // JPEG has no transparency, and padded squares need a background — use white.
    if (opts.format === 'jpeg' || useSquare) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasW, canvasH)
    }
    ctx.drawImage(
      bmp.source,
      Math.round((canvasW - drawW) / 2),
      Math.round((canvasH - drawH) / 2),
      drawW,
      drawH,
    )

    const mime = opts.format === 'webp' ? 'image/webp' : 'image/jpeg'
    const blob = await toBlob(canvas, mime, opts.quality)
    if (!blob) return untouched

    const dimensionsChanged = canvasW !== w || canvasH !== h
    // If nothing got smaller and the format is unchanged, keep the user's original file.
    if (!dimensionsChanged && blob.size >= file.size && file.type === mime)
      return untouched

    const base = file.name.replace(/\.[^.]+$/, '') || 'image'
    const ext = opts.format === 'webp' ? 'webp' : 'jpg'
    const out = new File([blob], `${base}.${ext}`, {
      type: mime,
      lastModified: Date.now(),
    })
    return {
      file: out,
      originalBytes: file.size,
      newBytes: out.size,
      width: canvasW,
      height: canvasH,
      skipped: false,
    }
  } finally {
    bmp.close()
  }
}
