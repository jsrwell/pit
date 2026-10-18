export type Role = 'customer' | 'admin'

export interface Account {
  id: number
  name: string
  email: string
  phone: string
  role: Role
  created_at: string
}
