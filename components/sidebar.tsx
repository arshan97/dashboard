"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Shield, Activity, List } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/", icon: Activity },
  { name: "Requests", href: "/requests", icon: List },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card text-card-foreground h-screen p-4">
      <div className="flex items-center mb-8">
        <Shield className="h-6 w-6 mr-2" />
        <h1 className="text-lg font-semibold">Network Dashboard</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50",
                pathname === item.href && "bg-muted text-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
