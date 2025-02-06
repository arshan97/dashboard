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

type FlowStep = "initial" | "select" | "review" | "confirm";

export default function CDNManagementPage() {
  const [services, setServices] = useState(cdnServices);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sourceProvider, setSourceProvider] = useState<CDNProvider | null>(
    null
  );
  const [targetProvider, setTargetProvider] = useState<CDNProvider | null>(
    null
  );
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const { toast } = useToast();
  const router = useRouter();

  const handleInitiateFlip = (source: CDNProvider, target: CDNProvider) => {
    setSourceProvider(source);
    setTargetProvider(target);
    setFlowStep("select");
  };

  const handleServiceSelect = (code: string) => {
    setSelectedServices((current) =>
      current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code]
    );
  };

  const submitFlipRequest = async () => {
    if (!sourceProvider || !targetProvider) return;

    const newRequest: FlipRequest = {
      id: `REQ-${Date.now()}`,
      services: selectedServices,
      sourceProvider: sourceProvider,
      targetProvider: targetProvider,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Store the new request in localStorage
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

    setSelectedServices([]);
    setSourceProvider(null);
    setTargetProvider(null);
    setFlowStep("initial");

    // Navigate to the Requests page
    router.push("/requests");
  };

  const selectedServicesDetails = services.filter((s) =>
    selectedServices.includes(s.code)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CDN Management</h1>
      {flowStep === "initial" && (
        <Card>
          <CardHeader>
            <CardTitle>L7 CDN Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {["akamai", "cloudflare"].map((provider) => (
                <div key={provider} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold capitalize mb-4">
                    {provider}
                  </h3>
                  <div className="space-y-4">
                    {services
                      .filter((s) => s.provider === provider)
                      .map((service) => (
                        <div
                          key={service.code}
                          className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                        >
                          <div>
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
                        handleInitiateFlip(
                          provider as CDNProvider,
                          provider === "akamai" ? "cloudflare" : "akamai"
                        )
                      }
                    >
                      Flip to {provider === "akamai" ? "Cloudflare" : "Akamai"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {flowStep === "select" && sourceProvider && targetProvider && (
        <Card>
          <CardHeader>
            <CardTitle>
              Select Services to Flip from {sourceProvider} to {targetProvider}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services
                .filter((s) => s.provider === sourceProvider)
                .map((service) => (
                  <div
                    key={service.code}
                    className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedServices.includes(service.code)}
                        onCheckedChange={() =>
                          handleServiceSelect(service.code)
                        }
                      />
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ({service.code})
                        </div>
                      </div>
                    </div>
                    <StatusIndicator status={service.status} />
                  </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setFlowStep("initial")}>
                Back
              </Button>
              <Button
                onClick={() => setFlowStep("review")}
                disabled={selectedServices.length === 0}
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {flowStep === "review" && sourceProvider && targetProvider && (
        <Card>
          <CardHeader>
            <CardTitle>Review CDN Flip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedServicesDetails.map((service) => (
                <div
                  key={service.code}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ({service.code})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium capitalize">
                        {sourceProvider}
                      </div>
                      <StatusIndicator status={service.status} />
                    </div>
                    <ArrowRight className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium capitalize">
                        {targetProvider}
                      </div>
                      <StatusIndicator status="unknown" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setFlowStep("select")}>
                Back
              </Button>
              <Button onClick={() => setFlowStep("confirm")}>Proceed</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {flowStep === "confirm" && (
        <Dialog open={true} onOpenChange={() => setFlowStep("review")}>
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
                      {sourceProvider}
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
                onClick={() => setFlowStep("review")}
                className="text-lg"
              >
                Back
              </Button>
              <Button onClick={submitFlipRequest} className="text-lg">
                Submit Flip Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
