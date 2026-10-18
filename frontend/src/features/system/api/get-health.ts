import { request } from '@/shared/api/http-client'

export interface HealthStatus {
  status: 'ok'
  version: string
}

export function getHealth(): Promise<HealthStatus> {
  return request<HealthStatus>('/health')
}
