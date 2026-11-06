#!/usr/bin/env node
/**
 * Export the Supabase `products` table (all rows, active + hidden) to CSV and JSON.
 *
 * Usage (run inside the gdnt-medicare project folder):
 *   node --env-file=.env.local scripts/export-products.mjs
 *   node --env-file=.env.local scripts/export-products.mjs --table enquiries
 *   node --env-file=.env.local scripts/export-products.mjs --out ./backup
 *
 * Output: <out>/<table>.csv and <out>/<table>.json   (default out folder: ./export)
 *
 * Env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY            (recommended; sees every row)
 *     -- or --
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY + ADMIN_EMAIL + ADMIN_PASSWORD   (your /admin login)
 *
 * Without the service-role key or admin login, row-level security only lets you
 * read ACTIVE products, so hidden/draft products would be missing.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const argv = process.argv.slice(2)
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`)
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')
    ? argv[i + 1]
    : d
}
const TABLE = opt('table', 'products')
const OUT_DIR = path.resolve(opt('out', './export'))
const PAGE = 1000 // Supabase returns max 1000 rows per request

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !(service || anon))
    throw new Error('Missing Supabase env vars in .env.local')
  if (service)
    return createClient(url, service, { auth: { persistSession: false } })
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
  if (!email || !password) {
    console.warn(
      '! No service-role key / admin login: only public (active) rows will be exported.',
    )
    return createClient(url, anon, { auth: { persistSession: false } })
  }
  const sb = createClient(url, anon, { auth: { persistSession: false } })
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Admin login failed: ${error.message}`)
  return sb
}

function csvCell(v) {
  if (v === null || v === undefined) return ''
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(rows) {
  if (!rows.length) return ''
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))]
  const lines = [cols.join(',')]
  for (const r of rows) lines.push(cols.map((c) => csvCell(r[c])).join(','))
  // BOM so Excel opens UTF-8 (₹, –, etc.) correctly
  return '\uFEFF' + lines.join('\r\n')
}

async function main() {
  const sb = await getSupabase()
  const rows = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(error.message)
    rows.push(...data)
    if (data.length < PAGE) break
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(
    path.join(OUT_DIR, `${TABLE}.json`),
    JSON.stringify(rows, null, 2),
  )
  await writeFile(path.join(OUT_DIR, `${TABLE}.csv`), toCsv(rows))
  console.log(
    `Exported ${rows.length} rows from "${TABLE}" -> ${OUT_DIR}${path.sep}${TABLE}.csv / .json`,
  )
  if (TABLE === 'products') {
    const hidden = rows.filter((r) => r.is_active === false).length
    console.log(`(${hidden} hidden products included)`)
  }
}

main().catch((e) => {
  console.error('ERROR:', e.message)
  process.exit(1)
})
