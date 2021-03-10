import type { SupabaseClient } from '@supabase/supabase-js'
import * as React from 'react'
import type { User } from '@supabase/supabase-js'

type SupabaseContextType = {
  sb: SupabaseClient | null
  user: User | null
}

const SupabaseContext = React.createContext<SupabaseContextType>({
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

/**
 * useSupabase returns the Supabase client
 * ```typescript
 * // get full client instance
 * const supabase = useSupabase();
 * // or specific members of the SupabaseClient class
 * const { auth, from } = useSupabase();
 * ```
 */
export const useSupabase = () => {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error(
      'useSupabase must be used within a SupabaseContext.Provider'
    )
  }

  return context.sb as SupabaseClient
}

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

export function useTable(table: string) {
  const context = React.useContext(SupabaseContext);


  if (context === undefined || context === null) {
    throw new Error('useUser must be used within a SupabaseContext.Provider')
    return
  }

  const [data, setData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<{
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  const initialLoad = async () => {
    const { data: initialData, error: initialError } = await context.sb!
      .from(table)
      .select();

    if (initialData) {
      setData(initialData);
    }

    if (initialError) {
      setError(initialError);
    }
    setLoading(false);
  };

  const subscription = async () => {
    context.sb!
      .from(table)
      .on("*", (payload) => {
        switch (payload.eventType) {
          case "INSERT":
            setData((data: any) => [...data, payload.new]);
            break;
          case "UPDATE":
            const indexToUpdate = data.findIndex(
              (data: { id: number }) =>
                Number(data.id) === Number(payload.new.id)
            );
            setData((data: any) =>
              Object.assign([], data, { [indexToUpdate]: payload.new })
            );
            break;
          case "DELETE":
            setData((data: any) => [
              ...data.filter(
                (data: { id: number }) =>
                  Number(data.id) !== Number(payload.old.id)
              ),
            ]);
            break;
          default:
            break;
        }
      })
      .subscribe();
  };

  React.useEffect(() => {
    initialLoad();
  }, []);

  React.useEffect(() => {
    subscription();
  }, [loading]);

  return { data, error, loading };
}
