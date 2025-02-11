"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusIndicator } from "@/components/status-indicator";
import { ArrowRight, Globe, Shield, Cloud, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { L3DDoSProtection } from "@/components/l3-ddos-protection";
import { DBSGateway } from "@/components/dbs-gateway";
import type {
  BankingService,
  DDoSProtection,
  CDNService,
  CDNProvider,
  FlipRequest,
} from "@/types/dashboard";

const dnsServices: BankingService[] = [
  { name: "Internet Banking", code: "IBBR", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", status: "warning" },
  { name: "iWealth", code: "IWSM", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", status: "healthy" },
  { name: "IDEAL Mobile", code: "IDEAL-M", status: "critical" },
];

const ddosProtection: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "warning" },
  { name: "Nexus Guard", enabled: true, status: "healthy" },
];

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

const getOverallStatus = (
  items: { status: string }[]
): "healthy" | "warning" | "critical" => {
  if (items.some((item) => item.status === "critical")) return "critical";
  if (items.some((item) => item.status === "warning")) return "warning";
  return "healthy";
};

export default function DashboardPage() {
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

    toast({
      title: "Flip Request Submitted",
      description: `Request ID: ${newRequest.id} has been submitted for approval.`,
    });

    setSelectedServices([]);
    setSourceProvider(null);
    setTargetProvider(null);
    setFlowStep("initial");
  };

  const selectedServicesDetails = services.filter((s) =>
    selectedServices.includes(s.code)
  );

  const dnsStatus = getOverallStatus(dnsServices);
  const ddosStatus = getOverallStatus(ddosProtection);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
            <CardTitle className="text-lg font-medium">DNS Records</CardTitle>
            <Globe className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-0 pt-2">
            <div className="space-y-3">
              {dnsServices.map((service) => (
                <div
                  key={service.code}
                  className={`flex items-center justify-between p-3 rounded-md border-2 ${
                    service.status === "healthy"
                      ? "border-green-300"
                      : service.status === "warning"
                      ? "border-yellow-300"
                      : "border-red-300"
                  }`}
                >
                  <span className="font-medium">{service.name}</span>
                  <StatusIndicator status={service.status} size="md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
            <CardTitle className="text-lg font-medium">
              DDoS Protection
            </CardTitle>
            <Shield className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent className="px-0 pt-2">
            <div className="space-y-3">
              {ddosProtection.map((protection) => (
                <div
                  key={protection.name}
                  className={`flex items-center justify-between p-3 rounded-md border-2 ${
                    protection.status === "healthy"
                      ? "border-green-300"
                      : protection.status === "warning"
                      ? "border-yellow-300"
                      : "border-red-300"
                  }`}
                >
                  <span className="font-medium">{protection.name}</span>
                  <StatusIndicator status={protection.status} size="md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <L3DDoSProtection />
        <DBSGateway />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            CDN Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {flowStep === "initial" && (
            <div className="grid md:grid-cols-2 gap-6">
              {["akamai", "cloudflare"].map((provider) => (
                <div key={provider} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold capitalize mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-500" />
                    {provider}
                  </h3>
                  <div className="space-y-3">
                    {services
                      .filter((s) => s.provider === provider)
                      .map((service) => (
                        <div
                          key={service.code}
                          className={`flex items-center justify-between p-3 rounded-md border-2 ${
                            service.status === "healthy"
                              ? "border-green-300"
                              : service.status === "warning"
                              ? "border-yellow-300"
                              : "border-red-300"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ({service.code})
                            </div>
                          </div>
                          <StatusIndicator status={service.status} size="md" />
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
          )}

          {flowStep === "select" && sourceProvider && targetProvider && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Select Services to Flip from {sourceProvider} to{" "}
                {targetProvider}
              </h3>
              <div className="space-y-4">
                {services
                  .filter((s) => s.provider === sourceProvider)
                  .map((service) => (
                    <div
                      key={service.code}
                      className="flex items-center justify-between p-3 border rounded-md"
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
                      <StatusIndicator status={service.status} size="md" />
                    </div>
                  ))}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setFlowStep("initial")}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setFlowStep("review")}
                  disabled={selectedServices.length === 0}
                >
                  Review
                </Button>
              </div>
            </div>
          )}

          {flowStep === "review" && sourceProvider && targetProvider && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Review CDN Flip</h3>
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
                        <StatusIndicator status={service.status} size="md" />
                      </div>
                      <ArrowRight className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium capitalize">
                          {targetProvider}
                        </div>
                        <StatusIndicator status="unknown" size="md" />
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
            </div>
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
                  <h4 className="text-xl font-medium mb-4">
                    Services to flip:
                  </h4>
                  <ul className="space-y-3">
                    {selectedServicesDetails.map((service) => (
                      <li
                        key={service.code}
                        className="text-lg flex items-center"
                      >
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
        </CardContent>
      </Card>
    </div>
  );
}
