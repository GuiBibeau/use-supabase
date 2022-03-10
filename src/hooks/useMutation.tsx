import { useState } from 'react'
import type { Response } from '../types'
import { PostgrestFilterBuilder } from '@supabase/postgrest-js'

export const useMutation = <T,>(): Response<T> & {
  execute: (mutation: PostgrestFilterBuilder<T>) => Promise<void>
} => {
  const [mutationState, setMutationState] = useState<Response<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = async (mutation: PostgrestFilterBuilder<T>) => {
    setMutationState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const { data, error } = await mutation
      if (error) throw new Error(`Error ${error.code}: ${error.message}`)
      setMutationState((prev) =>
        prev !== null
          ? { ...prev, data, loading: false, error: null }
          : { data, loading: false, error: null }
      )
    } catch (error) {
      if (error instanceof Error) {
        setMutationState((prev) => ({
          ...prev,
          data: null,
          loading: false,
          error: error as Error,
        }))
      }
      console.error(error)
    }
  }

  return { ...mutationState, execute }
}
