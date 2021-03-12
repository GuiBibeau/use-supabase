import * as React from 'react'
import type { TableDispatch } from '../types'
import { TableActionType } from '../types'
import { SupabaseContext, TablesDispatchContext } from '../context'

export function useTable(table: string) {
  const { fetchedTables, sb } = React.useContext(SupabaseContext)
  const dispatch: TableDispatch = React.useContext(TablesDispatchContext)

  const [error, setError] = React.useState<{
    message: string
    details: string
    hint: string
    code: string
  } | null>(null)

  const [loading, setLoading] = React.useState(
    !fetchedTables.hasOwnProperty(table)
  )

  const initialLoad = async () => {
    if (fetchedTables.hasOwnProperty(table)) {
      return
    }

    const { data: initialData, error: initialError } = await sb!
      .from(table)
      .select()

    if (initialData) {
      dispatch({
        type: TableActionType.FETCH_NEW_TABLE,
        data: initialData,
        tableName: table,
      })
    }

    if (initialError) {
      setError(initialError)
    }
    setLoading(false)
  }

  const subscription = async () => {
    sb!
      .from(table)
      .on('*', (payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            dispatch({
              type: TableActionType.INSERT,
              data: payload.new,
              tableName: table,
            })
            break
          case 'UPDATE':
            dispatch({
              type: TableActionType.UPDATE,
              data: payload.new,
              tableName: table,
            })
            break
          case 'DELETE':
            dispatch({
              type: TableActionType.DELETE,
              data: payload.old,
              tableName: table,
            })
            break
          default:
            break
        }
      })
      .subscribe()
  }

  React.useEffect(() => {
    initialLoad()
  }, [])

  React.useEffect(() => {
    subscription()
  }, [loading])

  return { data: fetchedTables[table], error }
}
