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

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>DBS Gateway</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {locations.map((location) => (
            <div key={location.name} className="space-y-3">
              <h3 className="font-semibold">{location.name}</h3>
              <div className="grid gap-2">
                {location.providers.map((provider) => (
                  <div
                    key={provider.name}
                    className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={provider.status} />
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
