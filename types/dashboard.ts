export type ServiceStatus = "healthy" | "warning" | "critical" | "unknown"

export type BankingService = {
  name: string
  code: string
  status: ServiceStatus
}

export type ServiceProvider = {
  name: string
  services: BankingService[]
}

export type DDoSProtection = {
  name: string
  enabled: boolean
  status: ServiceStatus
}

export type CDNProvider = "akamai" | "cloudflare"

export type CDNService = {
  name: string
  code: string
  provider: CDNProvider
  status: ServiceStatus
}

export type FlipRequest = {
  id: string
  services: string[]
  sourceProvider: CDNProvider
  targetProvider: CDNProvider
  status: "pending" | "approved" | "rejected"
  date: string
}

