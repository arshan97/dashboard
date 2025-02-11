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

  const submitApprovalRequest = async () => {
    if (!pendingChange) return;

    // Simulating an API call to submit the approval request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Approval Request Submitted",
      description: `Request to ${
        pendingChange.enabled ? "enable" : "disable"
      } ${pendingChange.provider} in ${
        pendingChange.location
      } has been submitted for approval.`,
    });

    setPendingChange(null);
  };

  const overallStatus = getOverallStatus(locations);

  return (
    <Card className="p-6 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
        <CardTitle className="text-lg font-medium">DBS Gateway</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.name}
              className="border border-border p-3 rounded-lg"
            >
              <h3 className="font-semibold mb-2">{location.name}</h3>
              <div className="space-y-3">
                {location.providers.map((provider) => (
                  <div
                    key={provider.name}
                    className={`flex items-center justify-between p-3 rounded-md border-2 ${
                      provider.status === "healthy"
                        ? "border-green-500 animate-flash-border-green"
                        : provider.status === "warning"
                        ? "border-yellow-500 animate-flash-border-yellow"
                        : "border-red-500 animate-flash-border-red"
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
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Confirm Gateway Change Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to request to{" "}
              {pendingChange?.enabled ? "enable" : "disable"}{" "}
              {pendingChange?.provider} in {pendingChange?.location}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingChange(null)}>
              Cancel
            </Button>
            <Button onClick={submitApprovalRequest}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
