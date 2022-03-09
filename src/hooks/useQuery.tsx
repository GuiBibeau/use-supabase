import { useEffect, useState } from 'react'
import type { Response } from '../types'

export const useQuery = (query: any) => {
  const [queryState, setQueryState] = useState<Response>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await query
        if (error) throw new Error(`Error ${error.code}: ${error.message}`)
        setQueryState((prev: Response) => ({
          ...prev,
          data,
          loading: false,
          error: null,
        }))
      } catch (error) {
        if (error instanceof Error) {
          setQueryState((prev: Response) => ({
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
