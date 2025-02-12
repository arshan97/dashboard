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
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          L3 DDoS Protection
          <StatusIndicator status={overallStatus} size="sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {tunnels.map((tunnel) => (
            <div
              key={tunnel.provider}
              className="border border-border p-2 rounded-lg"
            >
              <h3 className="font-semibold capitalize mb-2 flex items-center gap-2 text-sm">
                <StatusIndicator
                  status={
                    tunnel.endpoints.every((e) => e.status === "healthy")
                      ? "healthy"
                      : "warning"
                  }
                  size="sm"
                />
                {tunnel.provider} Tunnel
              </h3>
              <div className="grid gap-2">
                {tunnel.endpoints.map((endpoint) => (
                  <div
                    key={endpoint.name}
                    className={`flex items-center justify-between p-2 rounded-md border ${
                      endpoint.status === "healthy"
                        ? "border-green-500"
                        : endpoint.status === "warning"
                        ? "border-yellow-500"
                        : "border-red-500"
                    }`}
                  >
                    <span className="text-sm">To {endpoint.name}</span>
                    <StatusIndicator status={endpoint.status} size="sm" />
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
