"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

export default function AdminOrders() {
  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      amount: "$299.00",
      date: "Nov 10, 2025",
      status: "Completed",
      items: 1,
    },
    {
      id: "#ORD-002",
      customer: "Sarah Smith",
      email: "sarah@example.com",
      amount: "$178.50",
      date: "Nov 9, 2025",
      status: "Processing",
      items: 2,
    },
    {
      id: "#ORD-003",
      customer: "Michael Chen",
      email: "michael@example.com",
      amount: "$542.00",
      date: "Nov 8, 2025",
      status: "Shipped",
      items: 3,
    },
    {
      id: "#ORD-004",
      customer: "Emma Wilson",
      email: "emma@example.com",
      amount: "$89.99",
      date: "Nov 7, 2025",
      status: "Pending",
      items: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            LUXE
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm hover:text-accent transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="text-sm text-accent font-semibold">
              Orders
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Orders</h1>
            <p className="text-foreground/60">Manage customer orders and shipments</p>
          </div>
          <Button className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-6">
          <Button variant="outline" className="rounded-lg border-border/50 hover:bg-card gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Orders Table */}
        <div className="bg-card/50 border border-border/40 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-background/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/40 hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-accent">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{order.customer}</p>
                        <p className="text-xs text-foreground/60">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{order.items}</td>
                    <td className="px-6 py-4 font-semibold text-accent">{order.amount}</td>
                    <td className="px-6 py-4 text-foreground/70">{order.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Completed"
                            ? "bg-green-500/20 text-green-300"
                            : order.status === "Processing"
                              ? "bg-blue-500/20 text-blue-300"
                              : order.status === "Shipped"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent hover:text-accent/80 font-semibold text-sm transition-colors">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
