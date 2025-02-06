import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Shield, Cloud } from "lucide-react"
import type { BankingService, DDoSProtection, CDNService } from "@/types/dashboard"

const dnsServices: BankingService[] = [
  { name: "Internet Banking", code: "IBBR", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", status: "warning" },
  { name: "iWealth", code: "IWSM", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", status: "healthy" },
  { name: "IDEAL Mobile", code: "IDEAL-M", status: "critical" },
]

const ddosProtection: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "warning" },
  { name: "Nexus Guard", enabled: true, status: "healthy" },
]

const cdnServices: CDNService[] = [
  { name: "Internet Banking", code: "IBBR", provider: "akamai", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", provider: "akamai", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", provider: "cloudflare", status: "warning" },
  { name: "iWealth", code: "IWSM", provider: "cloudflare", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", provider: "akamai", status: "critical" },
]

const allServices = [...dnsServices, ...ddosProtection, ...cdnServices]

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        status === "healthy" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"
      }`}
    />
  )
}

function HealthBar({ services }: { services: { status: string }[] }) {
  const total = services.length
  const healthy = services.filter((s) => s.status === "healthy").length
  const warning = services.filter((s) => s.status === "warning").length
  const critical = services.filter((s) => s.status === "critical").length

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(healthy / total) * 100}%` }}></div>
      <div
        className="bg-yellow-500 h-2.5 rounded-full -mt-2.5"
        style={{ width: `${(warning / total) * 100}%`, marginLeft: `${(healthy / total) * 100}%` }}
      ></div>
      <div
        className="bg-red-500 h-2.5 rounded-full -mt-2.5"
        style={{ width: `${(critical / total) * 100}%`, marginLeft: `${((healthy + warning) / total) * 100}%` }}
      ></div>
    </div>
  )
}

export default function OverviewPage() {
  const overallHealth = {
    healthy: allServices.filter((s) => s.status === "healthy").length,
    warning: allServices.filter((s) => s.status === "warning").length,
    critical: allServices.filter((s) => s.status === "critical").length,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Network & Firewall Overview</h1>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle>Overall System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-5xl font-bold">{Math.round((overallHealth.healthy / allServices.length) * 100)}%</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <StatusDot status="healthy" />
                <span>Healthy: {overallHealth.healthy}</span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusDot status="warning" />
                <span>Warning: {overallHealth.warning}</span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusDot status="critical" />
                <span>Critical: {overallHealth.critical}</span>
              </div>
            </div>
          </div>
          <HealthBar services={allServices} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              DNS Records
            </CardTitle>
            <span className="text-2xl font-bold">{dnsServices.length}</span>
          </CardHeader>
          <CardContent>
            <HealthBar services={dnsServices} />
            <div className="mt-4 space-y-2">
              {dnsServices.map((service) => (
                <div key={service.code} className="flex items-center justify-between text-sm">
                  <span>{service.name}</span>
                  <StatusDot status={service.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              DDoS Protection
            </CardTitle>
            <span className="text-2xl font-bold">{ddosProtection.length}</span>
          </CardHeader>
          <CardContent>
            <HealthBar services={ddosProtection} />
            <div className="mt-4 space-y-2">
              {ddosProtection.map((protection) => (
                <div key={protection.name} className="flex items-center justify-between text-sm">
                  <span>{protection.name}</span>
                  <StatusDot status={protection.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Cloud className="h-5 w-5 mr-2" />
              L7 CDN
            </CardTitle>
            <span className="text-2xl font-bold">{cdnServices.length}</span>
          </CardHeader>
          <CardContent>
            <HealthBar services={cdnServices} />
            <div className="mt-4 space-y-2">
              {cdnServices.map((service) => (
                <div key={service.code} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span>{service.name}</span>
                    <span className="text-xs text-muted-foreground">{service.provider}</span>
                  </div>
                  <StatusDot status={service.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

