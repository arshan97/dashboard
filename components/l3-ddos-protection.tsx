import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status-indicator";
import type { L3Tunnel } from "@/types/dashboard";

const tunnels: L3Tunnel[] = [
  {
    provider: "akamai",
    endpoints: [
      { name: "DCE", status: "healthy" },
      { name: "DCW", status: "healthy" },
    ],
  },
  {
    provider: "cloudflare",
    endpoints: [
      { name: "DCE", status: "healthy" },
      { name: "DCW", status: "healthy" },
    ],
  },
];

export function L3DDoSProtection() {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>L3 DDoS Protection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {tunnels.map((tunnel) => (
            <div key={tunnel.provider} className="space-y-3">
              <h3 className="font-semibold capitalize">
                {tunnel.provider} Tunnel
              </h3>
              <div className="grid gap-2">
                {tunnel.endpoints.map((endpoint) => (
                  <div
                    key={endpoint.name}
                    className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={endpoint.status} />
                      <span>To {endpoint.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {endpoint.status === "healthy"
                        ? "Connected"
                        : "Issue Detected"}
                    </span>
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
