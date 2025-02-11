import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Network & Firewall Dashboard",
  description: "Monitor and manage network services, DNS, and CDN",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
