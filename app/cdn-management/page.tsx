"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/status-indicator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CDNService, CDNProvider } from "@/types/dashboard"

const cdnServices: CDNService[] = [
  { name: "Internet Banking", code: "IBBR", provider: "akamai", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", provider: "akamai", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", provider: "cloudflare", status: "healthy" },
  { name: "iWealth", code: "IWSM", provider: "cloudflare", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", provider: "akamai", status: "healthy" },
]

export default function CDNManagementPage() {
  const [services, setServices] = useState(cdnServices)
  const [selectedService, setSelectedService] = useState<CDNService | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleFlip = (service: CDNService) => {
    setSelectedService(service)
    setShowConfirmation(true)
  }

  const confirmFlip = async () => {
    if (!selectedService) return

    const newProvider: CDNProvider = selectedService.provider === "akamai" ? "cloudflare" : "akamai"

    // Here you would typically make an API call to request the flip
    console.log(`Requesting flip to ${newProvider} for service: ${selectedService.name}`)

    setServices(services.map((s) => (s.code === selectedService.code ? { ...s, provider: newProvider } : s)))

    setShowConfirmation(false)
    setSelectedService(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CDN Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>L7 CDN Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.code} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <StatusIndicator status={service.status} />
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">({service.code})</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    value={service.provider}
                    onValueChange={(value: CDNProvider) => {
                      if (value !== service.provider) {
                        handleFlip({ ...service, provider: value })
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="akamai">Akamai</SelectItem>
                      <SelectItem value="cloudflare">Cloudflare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm CDN Flip</DialogTitle>
            <DialogDescription>
              Are you sure you want to flip {selectedService?.name} from {selectedService?.provider} to{" "}
              {selectedService?.provider === "akamai" ? "Cloudflare" : "Akamai"}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={confirmFlip}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

