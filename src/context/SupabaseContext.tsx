import type { SupabaseClient, User } from '@supabase/supabase-js'
import * as React from 'react'
import {
  SupabaseContextType,
  TableAction,
  TableActionType,
  TableDispatch,
  TableState,
} from '../types'

export const SupabaseContext = React.createContext<SupabaseContextType>({
  sb: null,
  user: null,
  fetchedTables: {},
})

const initialTableDispatch = (_action: TableAction) => {
  return
}

export const TablesDispatchContext = React.createContext<TableDispatch>(
  initialTableDispatch
)

function tableReducer(
  state: TableState,
  { tableName, data, type }: TableAction
) {
  switch (type) {
    case TableActionType.FETCH_NEW_TABLE: {
      return {
        ...state,
        [tableName]: data,
      }
    }
    case TableActionType.INSERT: {
      const tableCopy = [...state[tableName]]
      return {
        ...state,
        [tableName]: [...tableCopy, data],
      }
    }

    case TableActionType.UPDATE: {
      const tableCopy = [...state[tableName]]
      const indexToUpdate = tableCopy.findIndex(
        ({ id }: { id: number }) => Number(id) === Number(data.id)
      )
      console.log(tableCopy, indexToUpdate)
      return {
        ...state,
        [tableName]: Object.assign([], tableCopy, {
          [indexToUpdate]: data,
        }),
      }
    }

    case TableActionType.DELETE: {
      const tableCopy = [...state[tableName]]
      return {
        ...state,
        [tableName]: [
          ...tableCopy.filter(
            ({ id }: { id: number }) => Number(id) !== Number(data.id)
          ),
        ],
      }
    }

    default: {
      throw new Error(`Unhandled type: ${type}`)
    }
  }
}

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
  const [fetchedTables, dispatch] = React.useReducer(tableReducer, {})

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
    <SupabaseContext.Provider value={{ user, sb: client, fetchedTables }}>
      <TablesDispatchContext.Provider value={dispatch}>
        {children}
      </TablesDispatchContext.Provider>
    </SupabaseContext.Provider>
  )
}
