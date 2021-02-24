import type { SupabaseClient, AuthChangeEvent } from '@supabase/supabase-js'
import * as React from 'react'
import type { User } from '@supabase/supabase-js'

type SupabaseContextType = {
  sb: SupabaseClient | null
  user: User | null
}

export const SupabaseContext = React.createContext<SupabaseContextType>({
  sb: null,
  user: null,
})

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

export const useSupabase = () => {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error(
      'useSupabase must be used within a SupabaseContext.Provider'
    )
  }

  return context.sb
}

export const useUser = () => {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a SupabaseContext.Provider')
  }

  return context.user
}
