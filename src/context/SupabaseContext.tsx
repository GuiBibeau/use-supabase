import type { SupabaseClient, User } from '@supabase/supabase-js'
import * as React from 'react'
import { SupabaseContextType } from '../types'

export const SupabaseContext = React.createContext<SupabaseContextType>({
  sb: null,
  user: null,
})

/**
 * SupabaseContextProvider is a context provider giving access to the supabase client to child along the React tree
 *  You should pass to it an authenticated supabase client see https://supabase.io/docs/client/initializing for details
 * ```typescript
 * <SupabaseContextProvider client={supabase}>
 *    <App />
 * </SupabaseContextProvider>
 * ```
 */
export const SupabaseContextProvider: React.FC<{ client: SupabaseClient }> = ({
  children,
  client,
}) => {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const user = client.auth.user()
    if (user) {
      setUser(user)
    }
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user!)
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })
  }, [])

  return (
    <SupabaseContext.Provider value={{ user, sb: client }}>
      {children}
    </SupabaseContext.Provider>
  )
}
