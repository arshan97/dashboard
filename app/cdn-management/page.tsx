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
import { StatusIndicator } from "@/components/status-indicator";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { CDNService, CDNProvider, FlipRequest } from "@/types/dashboard";

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
  { name: "PayLah", code: "P2P-SG", provider: "cloudflare", status: "warning" },
  { name: "iWealth", code: "IWSM", provider: "cloudflare", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", provider: "akamai", status: "critical" },
];

export default function CDNManagementPage() {
  const [services, setServices] = useState(cdnServices);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetProvider, setTargetProvider] = useState<CDNProvider | null>(
    null
  );
  const { toast } = useToast();
  const router = useRouter();

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

  const submitFlipRequest = async () => {
    if (!targetProvider) return;

    const newRequest: FlipRequest = {
      id: `REQ-${Date.now()}`,
      services: selectedServices,
      sourceProvider: targetProvider === "akamai" ? "cloudflare" : "akamai",
      targetProvider: targetProvider,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Here you would typically make an API call to submit the flip request
    console.log("Submitting flip request:", newRequest);

    // For demo purposes, we'll store the new request in localStorage
    const existingRequests = JSON.parse(
      localStorage.getItem("flipRequests") || "[]"
    );
    localStorage.setItem(
      "flipRequests",
      JSON.stringify([...existingRequests, newRequest])
    );

    toast({
      title: "Flip Request Submitted",
      description: `Request ID: ${newRequest.id} has been submitted for approval.`,
    });

    setShowConfirmation(false);
    setSelectedServices([]);
    setTargetProvider(null);

    // Navigate to the Requests page
    router.push("/requests");
  };

  const selectedServicesDetails = services.filter((s) =>
    selectedServices.includes(s.code)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CDN Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>L7 CDN Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {["akamai", "cloudflare"].map((provider) => (
              <div key={provider} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold capitalize mb-4">
                  {provider}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {services
                    .filter((s) => s.provider === provider)
                    .map((service) => (
                      <div
                        key={service.code}
                        className="flex items-center space-x-4 p-3 border rounded-md bg-gray-50"
                      >
                        <Checkbox
                          checked={selectedServices.includes(service.code)}
                          onCheckedChange={() =>
                            handleServiceSelect(service.code)
                          }
                        />
                        <div className="flex-1">
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ({service.code})
                          </div>
                        </div>
                        <StatusIndicator status={service.status} />
                      </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() =>
                      handleFlip(
                        provider === "akamai" ? "cloudflare" : "akamai"
                      )
                    }
                    disabled={
                      selectedServices.filter(
                        (code) =>
                          services.find((s) => s.code === code)?.provider ===
                          provider
                      ).length === 0
                    }
                  >
                    Request Flip to{" "}
                    {provider === "akamai" ? "Cloudflare" : "Akamai"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Confirm CDN Flip Request
            </DialogTitle>
            <DialogDescription className="text-lg">
              You are about to submit a CDN flip request for the following
              services:
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <h4 className="text-xl font-medium mb-4">Services to flip:</h4>
            <ul className="space-y-3">
              {selectedServicesDetails.map((service) => (
                <li key={service.code} className="text-lg flex items-center">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({service.code})
                  </span>
                  <span className="mx-4 flex items-center text-blue-600">
                    {service.provider}
                    <ArrowRight className="h-6 w-6 mx-2" />
                    {targetProvider}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="text-lg"
            >
              Cancel
            </Button>
            <Button onClick={submitFlipRequest} className="text-lg">
              Submit Flip Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
