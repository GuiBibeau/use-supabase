import { PostgrestBuilder } from '@supabase/postgrest-js'
import * as React from 'react'
import useSwr, { Fetcher } from 'swr'
import { SupabaseContext } from '../context'

/**
 * A hook that implements a SWR strategy to fetch data from a Supabase query any query can be passed
 * @param query a supabase client query function
 * @returns a swr hook object with the following properties:
 * - data: The data returned by the query
 * - error: The error returned by the query
 * - isValidating: If true, the query is still running
 */
export function useQuery<T>(query: PostgrestBuilder<T>) {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error('useQuery must be used within a SupabaseContext.Provider')
  }

  const fetcher: Fetcher = async () => {
    //@ts-ignore
    const { data, error } = await query

    if (error) {
      return error
    }

    return data
  }
  //@ts-ignore`
  return useSwr<T>(JSON.stringify(query), fetcher)
}
