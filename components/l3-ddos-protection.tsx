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
      { name: "DCW", status: "warning" },
    ],
  },
];

const getOverallStatus = (
  tunnels: L3Tunnel[]
): "healthy" | "warning" | "critical" => {
  const allEndpoints = tunnels.flatMap((t) => t.endpoints);
  if (allEndpoints.some((e) => e.status === "critical")) return "critical";
  if (allEndpoints.some((e) => e.status === "warning")) return "warning";
  return "healthy";
};

const overallStatus = getOverallStatus(tunnels);

export function L3DDoSProtection() {
  return (
    <Card className="p-6 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
        <CardTitle className="text-lg font-medium">
          L3 DDoS Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <div className="space-y-4">
          {tunnels.map((tunnel) => (
            <div
              key={tunnel.provider}
              className="border border-border p-3 rounded-lg"
            >
              <h3 className="font-semibold capitalize mb-2 flex items-center gap-2">
                <StatusIndicator
                  status={
                    tunnel.endpoints.every((e) => e.status === "healthy")
                      ? "healthy"
                      : "warning"
                  }
                  size="md"
                />
                {tunnel.provider} Tunnel
              </h3>
              <div className="grid gap-3">
                {tunnel.endpoints.map((endpoint) => (
                  <div
                    key={endpoint.name}
                    className={`flex items-center justify-between p-3 rounded-md border-2 ${
                      endpoint.status === "healthy"
                        ? "border-green-500 animate-flash-border-green"
                        : endpoint.status === "warning"
                        ? "border-yellow-500 animate-flash-border-yellow"
                        : "border-red-500 animate-flash-border-red"
                    }`}
                  >
                    <span>To {endpoint.name}</span>
                    <StatusIndicator status={endpoint.status} size="md" />
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
