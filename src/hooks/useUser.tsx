import * as React from 'react'
import { SupabaseContext } from '../context'

/**
 * @deprecated This is still usable but you should use https://github.com/supabase-community/supabase-auth-helpers
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
