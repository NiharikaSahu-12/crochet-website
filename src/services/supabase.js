import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qzptkvyihslhxdesucdd.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cHRrdnlpaHNsaHhkZXN1Y2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjQ0MDUsImV4cCI6MjA5NTQ0MDQwNX0.npAtp9ZkTxzOxaaXmm7i1IyVkwWUEuPvNqN0CjKSnLs'

// If the Supabase project is unreachable (offline demo, bad credentials, DNS
// trouble), an unbounded fetch can keep the storefront stuck on its loading
// spinner for a long time before the local fallback kicks in. Abort after a
// few seconds so services switch to their local-data fallback quickly.
const REQUEST_TIMEOUT_MS = 6000

const fetchWithTimeout = (input, init = {}) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const signal = init.signal
    ? AbortSignal.any([init.signal, controller.signal])
    : controller.signal

  return fetch(input, { ...init, signal }).finally(() => clearTimeout(timer))
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  // This app is designed to fall back to local data whenever Supabase is
  // unreachable (offline demo mode). PostgREST's default retry policy would
  // otherwise hold every query for ~7s (1s + 2s + 4s backoff) before the
  // fallback runs, so fail fast and let the local data render instead.
  db: { retry: false, timeout: REQUEST_TIMEOUT_MS },
  global: { fetch: fetchWithTimeout },
})

export default supabase
