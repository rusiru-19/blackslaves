"use client"

import Link from "next/link"
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/side-bar"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="ml-64">


        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/60">Welcome back! Here's your business overview.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Revenue", value: "$45,231.89", change: "+12.5%", icon: TrendingUp },
              { label: "Orders", value: "1,234", change: "+8.2%", icon: ShoppingCart },
              { label: "Products", value: "128", change: "+2", icon: Package },
              { label: "Customers", value: "892", change: "+5.3%", icon: Users },
            ].map((metric, i) => {
              const Icon = metric.icon
              return (
                <div
                  key={i}
                  className="p-6 bg-card/50 border border-border/40 rounded-lg hover:border-accent/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-foreground/70 text-sm font-medium">{metric.label}</p>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{metric.value}</p>
                  <p className="text-accent text-sm font-semibold">{metric.change}</p>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-card/50 border border-border/40 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">Recent Orders</h2>

                <div className="space-y-4">
                  {[
                    { id: "#ORD-001", customer: "John Doe", amount: "$299.00", status: "Completed", date: "2 hours ago" },
                    {
                      id: "#ORD-002",
                      customer: "Sarah Smith",
                      amount: "$178.50",
                      status: "Processing",
                      date: "4 hours ago",
                    },
                    { id: "#ORD-003", customer: "Michael Chen", amount: "$542.00", status: "Shipped", date: "1 day ago" },
                    { id: "#ORD-004", customer: "Emma Wilson", amount: "$89.99", status: "Pending", date: "2 days ago" },
                  ].map((order, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/40 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-foreground/60">{order.customer}</p>
                      </div>

                      <div className="text-right mr-4">
                        <p className="font-semibold text-accent">{order.amount}</p>
                        <p className="text-xs text-foreground/60">{order.date}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-6 rounded-lg border-border/50 hover:bg-card bg-transparent"
                >
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-card/50 border border-border/40 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 justify-start"
                  >
                    <Link href="/admin/products/new" className="gap-3">
                      <Package className="w-4 h-4" />
                      Add New Product
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-lg border-border/50 hover:bg-card justify-start bg-transparent"
                  >
                    <Link href="/admin/inventory" className="gap-3">
                      <BarChart3 className="w-4 h-4" />
                      Manage Inventory
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-lg border-border/50 hover:bg-card justify-start bg-transparent"
                  >
                    <Link href="/admin/customers" className="gap-3">
                      <Users className="w-4 h-4" />
                      View Customers
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-card/50 border border-border/40 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Performance</h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-foreground/70">Conversion Rate</span>
                      <span className="font-semibold">3.2%</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "32%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-foreground/70">Avg Order Value</span>
                      <span className="font-semibold">$124.50</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "62%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-foreground/70">Customer Satisfaction</span>
                      <span className="font-semibold">96%</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
