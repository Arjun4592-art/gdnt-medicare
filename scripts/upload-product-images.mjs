#!/usr/bin/env node
/**
 * Upload product images to Cloudinary and save the links in Supabase.
 *
 *  - Product exists in DB and has NO images  -> upload + fill image_url / images
 *  - Product exists in DB and HAS images     -> images skipped (use --overwrite to replace)
 *  - Product exists in DB                    -> with --fill-text, empty description / usage /
 *                                               safety / SEO fields are filled from new-products.json
 *                                               (existing text is never overwritten)
 *  - Images exist but product not in DB      -> upload + INSERT with full data
 *                                               (category, description, dosage, safety, SEO ...)
 *                                               from scripts/new-products.json
 *
 * Default is DRY-RUN (nothing uploaded / written). Add --apply to do it for real.
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-product-images.mjs --images "./New Images"
 *   node --env-file=.env.local scripts/upload-product-images.mjs --images "./New Images" --apply
 *
 * Flags:
 *   --images <dir>        folder with images           (default: ./New Images)
 *   --apply               really upload + write to DB
 *   --overwrite           also replace images of products that already have some
 *   --fill-text           for products already in DB: fill EMPTY description/usage/safety/SEO fields
 *   --map <file.json>     manual matches: { "image-folder-name": "DB product name or id", ... }
 *   --insert-unmatched    also INSERT products that have a similar-looking DB product (default: skip + ask you)
 *   --folder <path>       Cloudinary folder            (default: gdnt-medicare/products)
 *   --products-json <f>   offline dry-run: read products from a JSON file instead of Supabase
 *
 * Env (.env.local):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY            (recommended; bypasses RLS)
 *     -- or --
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY + ADMIN_EMAIL + ADMIN_PASSWORD  (your /admin login)
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------- args ----------
const argv = process.argv.slice(2)
const flag = (n) => argv.includes(`--${n}`)
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`)
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')
    ? argv[i + 1]
    : d
}
const APPLY = flag('apply')
const OVERWRITE = flag('overwrite')
const FILL_TEXT = flag('fill-text')
const INSERT_UNMATCHED = flag('insert-unmatched')
const MAP_FILE = opt('map', null)
const IMAGES_DIR = path.resolve(opt('images', './New Images'))
const CLD_FOLDER = opt('folder', 'gdnt-medicare/products')
const PRODUCTS_JSON = opt('products-json', null)

// image-folder key -> key used in the DB / chat (spelling differences)
const ALIASES = { boncared3: 'bonecared3', gedcefi200: 'gdcefi200', gomika500: 'gdmika500' } // gomika500 = typo in file name
// canonical key -> other spellings that may exist in the DB (e.g. "Bonecare-d3" vs pack's "Boncare-D3")
const ALT_KEYS = { bonecared3: ['boncared3'], gdcefi200: ['gedcefi200'] }

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// ---------- 1. scan images ----------
async function scanImages() {
  const files = (await readdir(IMAGES_DIR)).filter((f) =>
    /\.(png|jpe?g|webp)$/i.test(f),
  )
  const groups = new Map()
  for (const f of files) {
    const m =
      f.match(/^(.+?)_(\d+)-removebg-preview\.\w+$/i) ||
      f.match(/^(.+?)_(\d+)\.\w+$/i)
    if (!m) {
      console.warn(`  ! skipped (name not understood): ${f}`)
      continue
    }
    const rawKey = m[1]
    let key = norm(rawKey)
    key = ALIASES[key] || key
    if (!groups.has(key)) groups.set(key, { key, rawKey, files: [] })
    groups
      .get(key)
      .files.push({ n: Number(m[2]), file: path.join(IMAGES_DIR, f) })
  }
  for (const g of groups.values()) g.files.sort((a, b) => a.n - b.n)
  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key))
}

// ---------- 2. Cloudinary (signed upload, no extra dependency) ----------
function cldCreds() {
  const {
    CLOUDINARY_CLOUD_NAME: cloud,
    CLOUDINARY_API_KEY: key,
    CLOUDINARY_API_SECRET: secret,
  } = process.env
  if (!cloud || !key || !secret)
    throw new Error(
      'Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in .env.local',
    )
  return { cloud, key, secret }
}

async function uploadToCloudinary(filePath, publicId, tries = 3) {
  const { cloud, key, secret } = cldCreds()
  const buf = await readFile(filePath)
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const timestamp = Math.floor(Date.now() / 1000)
      // params to sign (alphabetical), excluding file / api_key / resource_type
      const toSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}`
      const signature = crypto
        .createHash('sha1')
        .update(toSign + secret)
        .digest('hex')
      const form = new FormData()
      form.append('file', new Blob([buf]), path.basename(filePath))
      form.append('api_key', key)
      form.append('timestamp', String(timestamp))
      form.append('public_id', publicId)
      form.append('overwrite', 'true')
      form.append('signature', signature)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        {
          method: 'POST',
          body: form,
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || `HTTP ${res.status}`)
      // f_auto,q_auto = smaller files, same look (transparent PNGs stay transparent)
      return json.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
    } catch (e) {
      if (attempt === tries) throw e
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
}

// ---------- 3. Supabase ----------
async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !(service || anon))
    throw new Error('Missing Supabase env vars in .env.local')
  if (service)
    return createClient(url, service, { auth: { persistSession: false } })
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
  if (!email || !password)
    throw new Error(
      'Set SUPABASE_SERVICE_ROLE_KEY, or ADMIN_EMAIL + ADMIN_PASSWORD (your /admin login)',
    )
  const sb = createClient(url, anon, { auth: { persistSession: false } })
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Admin login failed: ${error.message}`)
  return sb
}

async function loadProducts(sb) {
  if (PRODUCTS_JSON)
    return JSON.parse(await readFile(path.resolve(PRODUCTS_JSON), 'utf8'))
  const { data, error } = await sb
    .from('products')
    .select(
      'id,name,image_url,images,description,usage_dosage,safety_info,meta_title,meta_description',
    ) // all rows, active or not
  if (error) throw new Error(error.message)
  return data
}

// words that are only the dosage form, not part of the brand name
const FORM_WORDS =
  /\b(tablets?|capsules?|syrup|suspension|injections?|drops?|gel|cream|powder|dry|oral|nano|shot|ointment)\b/gi
const normLoose = (s) => norm(String(s).replace(FORM_WORDS, ' '))

function similarity(a, b) {
  if (!a || !b) return 0
  if (a === b) return 1
  const m = a.length,
    n = b.length
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    prev = cur
  }
  return 1 - prev[n] / Math.max(m, n)
}

function findProduct(products, key) {
  const keys = [key, ...(ALT_KEYS[key] || [])]
  // 1) exact (ignoring case / spaces / dashes)
  let hits = products.filter((p) => keys.includes(norm(p.name)))
  if (hits.length === 1) return { product: hits[0] }
  if (hits.length > 1) return { ambiguous: hits }
  // 2) exact after dropping dosage-form words ("Asaira-SP Tablets" == "asairasp")
  hits = products.filter((p) => keys.includes(normLoose(p.name)))
  if (hits.length === 1) return { product: hits[0], fuzzy: true }
  if (hits.length > 1) return { ambiguous: hits }
  // 3) one name starts with the other
  if (key.length >= 5) {
    hits = products.filter((p) => {
      const n = normLoose(p.name)
      return (
        n.length >= 5 && keys.some((k) => n.startsWith(k) || k.startsWith(n))
      )
    })
    if (hits.length === 1) return { product: hits[0], fuzzy: true }
    if (hits.length > 1) return { ambiguous: hits }
  }
  // 4) spelling-close names (typos like "Asaria-sp", "Gdcefi 200 kid")
  const scored = products
    .map((p) => ({
      p,
      s: Math.max(...keys.map((k) => similarity(normLoose(p.name), k))),
    }))
    .sort((a, b) => b.s - a.s)
  if (
    scored[0] &&
    scored[0].s >= 0.86 &&
    (!scored[1] || scored[0].s - scored[1].s >= 0.08)
  )
    return { product: scored[0].p, fuzzy: true }
  const suggestions = scored.filter((x) => x.s >= 0.6).slice(0, 3)
  return suggestions.length ? { suggestions } : {}
}

function applyManualMap(products, map, g) {
  const want = map[g.rawKey] ?? map[g.key]
  if (!want) return null
  const w = String(want)
  const p =
    products.find((x) => x.id === w) ||
    products.find((x) => norm(x.name) === norm(w))
  if (!p) throw new Error(`--map: no DB product "${want}" for ${g.rawKey}`)
  return p
}

const TEXT_FIELDS = [
  'description',
  'usage_dosage',
  'safety_info',
  'meta_title',
  'meta_description',
]
const isEmpty = (v) => v === null || v === undefined || String(v).trim() === ''
function buildTextPatch(product, def) {
  const patch = {}
  if (!def) return patch
  for (const f of TEXT_FIELDS)
    if (isEmpty(product[f]) && !isEmpty(def[f])) patch[f] = def[f]
  return patch
}

const hasImages = (p) =>
  (Array.isArray(p.images) && p.images.length > 0) || !!p.image_url

// ---------- main ----------
async function main() {
  console.log(
    `\nMode: ${APPLY ? 'APPLY (real upload + DB write)' : 'DRY-RUN (nothing changes)'}`,
  )
  console.log(`Images: ${IMAGES_DIR}\n`)

  const groups = await scanImages()
  const newDefs = JSON.parse(
    await readFile(path.join(__dirname, 'new-products.json'), 'utf8'),
  )
  console.log(
    `Found ${groups.length} products, ${groups.reduce((a, g) => a + g.files.length, 0)} images\n`,
  )

  let sb = null
  let products = null
  try {
    if (!PRODUCTS_JSON || APPLY) sb = await getSupabase()
    products = await loadProducts(sb)
    console.log(`DB products loaded: ${products.length}\n`)
  } catch (e) {
    if (APPLY) throw e
    console.warn(`(Supabase not available for matching: ${e.message})\n`)
  }

  const manualMap = MAP_FILE
    ? JSON.parse(await readFile(path.resolve(MAP_FILE), 'utf8'))
    : null
  const plan = []
  for (const g of groups) {
    if (!products) {
      plan.push({ g, action: 'unknown' })
      continue
    }
    const manual = manualMap ? applyManualMap(products, manualMap, g) : null
    const r = manual ? { product: manual } : findProduct(products, g.key)
    if (r.ambiguous) plan.push({ g, action: 'ambiguous', matches: r.ambiguous })
    else if (r.product) {
      const needImages = !hasImages(r.product) || OVERWRITE
      const textPatch = FILL_TEXT
        ? buildTextPatch(r.product, newDefs[g.key])
        : {}
      if (!needImages && !Object.keys(textPatch).length)
        plan.push({ g, action: 'skip-has-images', product: r.product })
      else
        plan.push({
          g,
          action: 'update',
          product: r.product,
          fuzzy: r.fuzzy,
          needImages,
          textPatch,
        })
    } else if (r.suggestions && !INSERT_UNMATCHED)
      plan.push({ g, action: 'review', suggestions: r.suggestions })
    else if (newDefs[g.key])
      plan.push({ g, action: 'insert', def: newDefs[g.key] })
    else plan.push({ g, action: 'no-data' })
  }

  const label = {
    update: 'UPDATE  (fill images / text)',
    insert: 'INSERT  (new draft product)',
    'skip-has-images': 'SKIP    (already has images)',
    ambiguous: 'SKIP    (several DB matches - fix manually)',
    'no-data': 'SKIP    (not in DB, no data in new-products.json)',
    review: 'REVIEW  (similar DB product found - not inserted)',
    unknown: 'N/A',
  }
  for (const p of plan) {
    const extra = p.suggestions
      ? ` -> maybe ${p.suggestions.map((x) => `"${x.p.name}" (${Math.round(x.s * 100)}%)`).join(', ')}`
      : p.product
        ? ` -> "${p.product.name}"${p.fuzzy ? ' (fuzzy match)' : ''}`
        : p.matches
          ? ` -> ${p.matches.map((m) => `"${m.name}"`).join(', ')}`
          : p.def
            ? ` -> "${p.def.name}"`
            : ''
    console.log(
      `${label[p.action].padEnd(48)} ${p.g.rawKey} [${p.g.files.length} img]${extra}`,
    )
  }

  if (products) {
    const matchedIds = new Set(
      plan.filter((p) => p.product).map((p) => p.product.id),
    )
    const leftovers = products.filter(
      (p) => !matchedIds.has(p.id) && !hasImages(p),
    )
    if (leftovers.length) {
      console.log(
        `\nDB products with NO images that no image folder matched (${leftovers.length}):`,
      )
      for (const p of leftovers) console.log(`   - ${p.name}`)
    }
    const reviews = plan.filter((p) => p.action === 'review')
    if (reviews.length)
      console.log(
        `\n${reviews.length} image folder(s) need a decision: fix the DB name, or add them to a --map file, or use --insert-unmatched to add them as new products.`,
      )
  }

  const todo = plan.filter(
    (p) => p.action === 'update' || p.action === 'insert',
  )
  console.log(
    `\nTo process: ${todo.filter((p) => p.action === 'update').length} update, ${todo.filter((p) => p.action === 'insert').length} insert`,
  )
  if (!APPLY) {
    console.log('\nDry-run only. Re-run with --apply to upload and save.\n')
    return
  }

  const report = []
  for (const p of todo) {
    const name = p.product?.name || p.def.name
    const baseId = slug(name)
    try {
      const urls = []
      const doImages = p.action === 'insert' || p.needImages
      if (doImages) {
        for (const f of p.g.files.slice(0, 4)) {
          const publicId = `${CLD_FOLDER}/${baseId}/${baseId}-${f.n}`
          urls.push(await uploadToCloudinary(f.file, publicId))
        }
      }
      if (p.action === 'update') {
        const patch = { ...p.textPatch }
        if (doImages) Object.assign(patch, { image_url: urls[0], images: urls })
        const { data, error } = await sb
          .from('products')
          .update(patch)
          .eq('id', p.product.id)
          .select('id')
        if (error) throw new Error(error.message)
        if (!data?.length)
          throw new Error(
            '0 rows updated (RLS? use service-role key or admin login)',
          )
      } else {
        const { error } = await sb
          .from('products')
          .insert({ ...p.def, image_url: urls[0], images: urls })
        if (error) throw new Error(error.message)
      }
      console.log(
        `  ok  ${p.action.padEnd(6)} ${name} (${urls.length} images${p.textPatch && Object.keys(p.textPatch).length ? ', text filled' : ''})`,
      )
      report.push({ product: name, action: p.action, urls })
    } catch (e) {
      console.error(`  FAIL ${name}: ${e.message}`)
      report.push({ product: name, action: p.action, error: e.message })
    }
  }

  await writeFile(
    path.join(__dirname, 'image-upload-report.json'),
    JSON.stringify(report, null, 2),
  )
  const failed = report.filter((r) => r.error).length
  console.log(
    `\nDone. ${report.length - failed} ok, ${failed} failed. Report: scripts/image-upload-report.json\n`,
  )
  if (failed) process.exitCode = 1
}

main().catch((e) => {
  console.error('\nERROR:', e.message)
  process.exit(1)
})
