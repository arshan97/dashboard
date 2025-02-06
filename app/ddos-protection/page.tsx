"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { StatusIndicator } from "@/components/status-indicator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { DDoSProtection } from "@/types/dashboard"

const protectionServices: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "healthy" },
  { name: "Nexus Guard", enabled: true, status: "healthy" },
]

export default function DDoSProtectionPage() {
  const [services, setServices] = useState(protectionServices)
  const [confirmService, setConfirmService] = useState<DDoSProtection | null>(null)

  const handleToggle = (service: DDoSProtection) => {
    setConfirmService({ ...service, enabled: !service.enabled })
  }

  const confirmChange = () => {
    if (confirmService) {
      setServices(services.map((s) => (s.name === confirmService.name ? confirmService : s)))
      setConfirmService(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">DBS's DNS DDoS Protection</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-4">
                  <StatusIndicator status={service.status} />
                  <span>{service.name}</span>
                </div>
                <Switch checked={service.enabled} onCheckedChange={() => handleToggle(service)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!confirmService} onOpenChange={() => setConfirmService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Protection Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmService?.enabled ? "enable" : "disable"} DDoS protection for{" "}
              {confirmService?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

