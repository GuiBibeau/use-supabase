import type { SupabaseClient, User } from '@supabase/supabase-js'

export type SupabaseContextType = {
  sb: SupabaseClient | null
  user: User | null
}

export type SelectArg =
  | string
  | {
      str: string
      head?: boolean
      count?: null | 'exact' | 'planned' | 'estimated'
    }
