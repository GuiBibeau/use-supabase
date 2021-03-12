import * as React from 'react'
import { SupabaseContext } from '../context'

/**
 * useUser returns the Supabase user or null if no user is authenticated
 * ```typescript
 * const user = useUser();
 * ```
 */
export const useUser = () => {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a SupabaseContext.Provider')
  }

  return context.user
}
