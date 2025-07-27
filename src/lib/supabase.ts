import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nuanzeznfeeevsyyayiq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YW56ZXpuZmVlZXZzeXlheWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjA3MTYsImV4cCI6MjA2OTE5NjcxNn0.EJfRwRxMyOmv1tYdd7PsKR3HJsLk1JCYBT8NkvtsOTM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)