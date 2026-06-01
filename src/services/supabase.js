import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qzptkvyihslhxdesucdd.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cHRrdnlpaHNsaHhkZXN1Y2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjQ0MDUsImV4cCI6MjA5NTQ0MDQwNX0.npAtp9ZkTxzOxaaXmm7i1IyVkwWUEuPvNqN0CjKSnLs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
