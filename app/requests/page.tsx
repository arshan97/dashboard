"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FlipRequest } from "@/types/dashboard"

const initialRequests: FlipRequest[] = [
  {
    id: "REQ-001",
    services: ["Internet Banking", "Mobile Banking"],
    sourceProvider: "akamai",
    targetProvider: "cloudflare",
    status: "pending",
    date: "2024-02-06T10:30:00Z",
  },
  {
    id: "REQ-002",
    services: ["PayLah"],
    sourceProvider: "cloudflare",
    targetProvider: "akamai",
    status: "approved",
    date: "2024-02-05T15:45:00Z",
  },
  {
    id: "REQ-003",
    services: ["IDEAL"],
    sourceProvider: "akamai",
    targetProvider: "cloudflare",
    status: "rejected",
    date: "2024-02-04T09:15:00Z",
  },
]

export default function RequestsPage() {
  const [requests] = useState<FlipRequest[]>(initialRequests)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.services.join(", ")}</TableCell>
                  <TableCell className="capitalize">{request.sourceProvider}</TableCell>
                  <TableCell className="capitalize">{request.targetProvider}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

