"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusIndicator } from "./status-indicator";
import type { CDNService, CDNProvider } from "@/types/dashboard";

const cdnServices: CDNService[] = [
  {
    name: "Internet Banking",
    code: "IBBR",
    provider: "akamai",
    status: "healthy",
  },
  {
    name: "Mobile Banking",
    code: "MBS",
    provider: "akamai",
    status: "healthy",
  },
  { name: "PayLah", code: "P2P-SG", provider: "cloudflare", status: "healthy" },
  { name: "iWealth", code: "IWSM", provider: "cloudflare", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", provider: "akamai", status: "healthy" },
];

export function CDNStatus() {
  const [services, setServices] = useState(cdnServices);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetProvider, setTargetProvider] = useState<CDNProvider | null>(
    null
  );

  const handleServiceSelect = (code: string) => {
    setSelectedServices((current) =>
      current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code]
    );
  };

  const handleFlip = (target: CDNProvider) => {
    setTargetProvider(target);
    setShowConfirmation(true);
  };

  const confirmFlip = async () => {
    if (!targetProvider) return;

    // Here you would typically make an API call to request the flip
    console.log(
      `Requesting flip to ${targetProvider} for services:`,
      selectedServices
    );

    setShowConfirmation(false);
    setSelectedServices([]);
    setTargetProvider(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>L7 CDN Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Akamai Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Akamai</h3>
            {services
              .filter((s) => s.provider === "akamai")
              .map((service) => (
                <div
                  key={service.code}
                  className="flex items-center space-x-4 p-2 border rounded"
                >
                  <Checkbox
                    checked={selectedServices.includes(service.code)}
                    onCheckedChange={() => handleServiceSelect(service.code)}
                  />
                  <StatusIndicator status={service.status} />
                  <span>{service.name}</span>
                </div>
              ))}
            <Button
              className="w-full"
              onClick={() => handleFlip("cloudflare")}
              disabled={selectedServices.length === 0}
            >
              Flip to Cloudflare
            </Button>
          </div>

          {/* Cloudflare Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cloudflare</h3>
            {services
              .filter((s) => s.provider === "cloudflare")
              .map((service) => (
                <div
                  key={service.code}
                  className="flex items-center space-x-4 p-2 border rounded"
                >
                  <Checkbox
                    checked={selectedServices.includes(service.code)}
                    onCheckedChange={() => handleServiceSelect(service.code)}
                  />
                  <StatusIndicator status={service.status} />
                  <span>{service.name}</span>
                </div>
              ))}
            <Button
              className="w-full"
              onClick={() => handleFlip("akamai")}
              disabled={selectedServices.length === 0}
            >
              Flip to Akamai
            </Button>
          </div>
        </div>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm CDN Flip</DialogTitle>
              <DialogDescription>
                Are you sure you want to flip the following services to{" "}
                {targetProvider}?
                <ul className="mt-2 space-y-1">
                  {selectedServices.map((code) => (
                    <li key={code}>
                      • {services.find((s) => s.code === code)?.name}
                    </li>
                  ))}
                </ul>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmFlip}>Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
