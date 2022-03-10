import { useState } from 'react'
import type { Response } from '../types'

export const useSupabaseMutation = () => {
  const [mutationState, setMutationState] = useState<Response>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = async (mutation: any) => {
    setMutationState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const { data, error } = await mutation
      if (error) throw new Error(`Error ${error.code}: ${error.message}`)
      setMutationState((prev) => ({
        ...prev,
        data,
        loading: false,
        error: null,
      }))
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
