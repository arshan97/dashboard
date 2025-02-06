import { DNSRecords } from "@/components/dns-records"

export default function DNSRecordsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">DNS Records</h1>
      <DNSRecords />
    </div>
  )
}

