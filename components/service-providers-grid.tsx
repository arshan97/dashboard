"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./status-indicator";
import type { ServiceProvider } from "@/types/dashboard";

const providers: ServiceProvider[] = [
  {
    name: "SingTel",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "healthy" },
      { name: "Mobile Banking", code: "MBS", status: "healthy" },
      { name: "PayLah", code: "P2P-SG", status: "healthy" },
      { name: "iWealth", code: "IWSM", status: "healthy" },
      { name: "IDEAL", code: "IDEAL", status: "healthy" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
    ],
  },
  {
    name: "StarHub",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "unknown" },
      { name: "Mobile Banking", code: "MBS", status: "unknown" },
      { name: "PayLah", code: "P2P-SG", status: "unknown" },
      { name: "iWealth", code: "IWSM", status: "unknown" },
      { name: "IDEAL", code: "IDEAL", status: "unknown" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "unknown" },
    ],
  },
  {
    name: "M1",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "healthy" },
      { name: "Mobile Banking", code: "MBS", status: "healthy" },
      { name: "PayLah", code: "P2P-SG", status: "warning" },
      { name: "iWealth", code: "IWSM", status: "healthy" },
      { name: "IDEAL", code: "IDEAL", status: "healthy" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
    ],
  },
  {
    name: "Others",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "healthy" },
      { name: "Mobile Banking", code: "MBS", status: "healthy" },
      { name: "PayLah", code: "P2P-SG", status: "healthy" },
      { name: "iWealth", code: "IWSM", status: "healthy" },
      { name: "IDEAL", code: "IDEAL", status: "healthy" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
    ],
  },
];

export function ServiceProvidersGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          End User Experience on different Service Providers in SG
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((provider) => (
            <div key={provider.name} className="space-y-4">
              <h3 className="font-semibold text-center">{provider.name}</h3>
              <div className="space-y-2">
                {provider.services.map((service) => (
                  <div
                    key={service.code}
                    className="flex items-center justify-between p-2 border rounded text-sm"
                  >
                    <div className="flex flex-col">
                      <span>{service.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({service.code})
                      </span>
                    </div>
                    <StatusIndicator status={service.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
