"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/status-indicator"
import type { BankingService } from "@/types/dashboard"

const services: BankingService[] = [
  { name: "Internet Banking", code: "IBBR", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", status: "healthy" },
  { name: "iWealth", code: "IWSM", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", status: "healthy" },
  { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
]

export function DNSRecords() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application specific DNS records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.code} className="flex flex-col items-center p-4 border rounded-lg space-y-2">
              <div className="text-sm font-medium text-center">{service.name}</div>
              <div className="text-xs text-muted-foreground">({service.code})</div>
              <StatusIndicator status={service.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

