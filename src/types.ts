import type { SupabaseClient, User } from '@supabase/supabase-js'

export type SupabaseContextType = {
  sb: SupabaseClient | null
  user: User | null
  fetchedTables: Record<string, any[]>
}

export type TableAction = {
  type: TableActionType
  tableName: string
  data: any
}

export type Response = {
  data: any
  loading: boolean
  error: Error | null
}

export type TableDispatch = (_action: TableAction) => void

export type TableState = Record<string, any[]>

export enum TableActionType {
  FETCH_NEW_TABLE = 'fetchNewTable',
  INSERT = 'insert',
  DELETE = 'delete',
  UPDATE = 'update',
}
