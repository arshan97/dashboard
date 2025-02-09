import { Shield } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Shield className="h-6 w-6" />
        <div>
          <h1 className="text-lg font-semibold">
            Network & Firewall Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage network services, DNS, and CDN
          </p>
        </div>
      </div>
    </header>
  );
}
