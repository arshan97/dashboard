"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusIndicator } from "./status-indicator";
import type { DDoSProtection } from "@/types/dashboard";

const protectionServices: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "healthy" },
  { name: "Nexus Guard", enabled: true, status: "healthy" },
];

export function DDoSProtection() {
  const [services, setServices] = useState(protectionServices);
  const [pendingChanges, setPendingChanges] = useState<DDoSProtection[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleToggle = (name: string) => {
    const updatedServices = services.map((service) =>
      service.name === name
        ? { ...service, enabled: !service.enabled }
        : service
    );
    setPendingChanges(updatedServices);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmChanges = () => {
    setServices(pendingChanges);
    setPendingChanges([]);
    setShowConfirmation(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>DBS's DNS DDoS Protection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center space-x-4">
                <StatusIndicator status={service.status} />
                <span>{service.name}</span>
              </div>
              <Switch
                checked={service.enabled}
                onCheckedChange={() => handleToggle(service.name)}
              />
            </div>
          ))}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={pendingChanges.length === 0}
          >
            Submit Changes
          </Button>
        </div>

        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Protection Changes</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to update the DDoS protection settings?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmChanges}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
