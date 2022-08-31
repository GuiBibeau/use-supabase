import * as React from 'react'
import useSwr, { SWRConfiguration } from 'swr'
import { SupabaseContext } from '../context'
import { SelectArg } from '../types'


/**
 * A hook that implements a SWR strategy to fetch data from a Supabase table
 * @param from - The table to query
 * @param select - The fields to select. Can be either a string that defaults to '*' or an object with the following properties:
 * - str: The field to select
 * - head: If true, only the first row will be returned
 * - count: If set to 'exact', only the exact number of rows will be returned. If set to 'planned', the number of rows will be estimated. If set to 'estimated', the number of rows will be estimated.
 * @param config the configuration settings for swr 
 * @returns a swr hook object with the following properties:
 * - data: The data returned by the query
 * - error: The error returned by the query
 * - isValidating: If true, the query is still running
 * - mutate: A function to mutate the cached data
 * * ```typescript
 *  const { data, error } = useTable('users', '*')
 * ```
 */
export function useTable<T>(from: string, select: SelectArg = '*', config: SWRConfiguration = null) {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a SupabaseContext.Provider')
  }

  const selectStr = typeof select === 'string' ? select : select.str
  const selectOptions =
    typeof select === 'string'
      ? undefined
      : { head: select.head, count: select.count }

  return useSwr<T>(`${from}${selectStr}`, async (_key: string) => {
    //@ts-ignore
    const { data, error } = await context.sb
      ?.from(from)
      .select(selectStr, selectOptions)

    if (error) {
      throw error
    }

    return data
  }, config)
}
