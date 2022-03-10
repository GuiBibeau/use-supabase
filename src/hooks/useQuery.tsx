import { useEffect, useState } from 'react'
import type { Response } from '../types'
import { PostgrestBuilder } from '@supabase/postgrest-js'

export const useQuery = <T,>(query: PostgrestBuilder<T>) => {
  const [queryState, setQueryState] = useState<Response<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await query
        if (error) throw new Error(`Error ${error.code}: ${error.message}`)
        setQueryState((prev) =>
          prev !== null
            ? { ...prev, data, loading: false, error: null }
            : { data, loading: false, error: null }
        )
      } catch (error) {
        if (error instanceof Error) {
          setQueryState((prev) => ({
            ...prev,
            data: null,
            loading: false,
            error: error as Error,
          }))
        }
        console.error(error)
      }
    })()
  }, [])

  return queryState
}
