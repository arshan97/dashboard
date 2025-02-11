"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status-indicator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { GatewayLocation } from "@/types/dashboard";

const initialLocations: GatewayLocation[] = [
  {
    name: "DCE",
    providers: [
      { name: "Singtel", status: "healthy", enabled: true },
      { name: "Starhub", status: "healthy", enabled: true },
    ],
  },
  {
    name: "DCW",
    providers: [
      { name: "Singtel", status: "healthy", enabled: true },
      { name: "Starhub", status: "warning", enabled: true },
    ],
  },
];

const getOverallStatus = (
  locations: GatewayLocation[]
): "healthy" | "warning" | "critical" => {
  const allProviders = locations.flatMap((l) => l.providers);
  if (allProviders.some((p) => p.status === "critical")) return "critical";
  if (allProviders.some((p) => p.status === "warning")) return "warning";
  return "healthy";
};

export function DBSGateway() {
  const [locations, setLocations] = useState(initialLocations);
  const [pendingChange, setPendingChange] = useState<{
    location: string;
    provider: string;
    enabled: boolean;
  } | null>(null);
  const { toast } = useToast();

  const handleToggle = (
    locationName: string,
    providerName: string,
    newEnabled: boolean
  ) => {
    setPendingChange({
      location: locationName,
      provider: providerName,
      enabled: newEnabled,
    });
  };

  const confirmChange = async () => {
    if (!pendingChange) return;

    const newLocations = locations.map((location) => {
      if (location.name === pendingChange.location) {
        return {
          ...location,
          providers: location.providers.map((provider) => {
            if (provider.name === pendingChange.provider) {
              return { ...provider, enabled: pendingChange.enabled };
            }
            return provider;
          }),
        };
      }
      return location;
    });

    setLocations(newLocations);
    setPendingChange(null);

    toast({
      title: "Gateway Status Updated",
      description: `${pendingChange.provider} in ${
        pendingChange.location
      } has been ${pendingChange.enabled ? "enabled" : "disabled"}.`,
    });
  };

  const overallStatus = getOverallStatus(locations);

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
        <CardTitle className="text-lg font-medium">DBS Gateway</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.name} className="border p-3 rounded-lg">
              <h3 className="font-semibold mb-2">{location.name}</h3>
              <div className="space-y-3">
                {location.providers.map((provider) => (
                  <div
                    key={provider.name}
                    className={`flex items-center justify-between p-3 rounded-md border-2 ${
                      provider.status === "healthy"
                        ? "border-green-300"
                        : provider.status === "warning"
                        ? "border-yellow-300"
                        : "border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIndicator status={provider.status} size="md" />
                      <span>{provider.name}</span>
                    </div>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(checked) =>
                        handleToggle(location.name, provider.name, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog
        open={!!pendingChange}
        onOpenChange={() => setPendingChange(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Gateway Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {pendingChange?.enabled ? "enable" : "disable"}{" "}
              {pendingChange?.provider} in {pendingChange?.location}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingChange(null)}>
              Cancel
            </Button>
            <Button onClick={confirmChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
