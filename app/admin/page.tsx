"use client"

import Link from "next/link"
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/side-bar"
import { collection, query, getDocs, getCountFromServer, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { use, useEffect, useState } from "react"
export default function AdminDashboard() {
    const [slave, setSlave] = useState(0);
    const [orders, setOrders] = useState(0);
    const [viiewOrders, setViewOrders] = useState<any[]>([]);
    const [customers, setCustomers] = useState(0);
    const [delivered, setDelivered] = useState(0);
    useEffect(() => {
        const fetchProductCount = async () => {
          const q = query(collection(db, "slaves"), where("status", "==", "available"));
          const snapshot = await getCountFromServer(q);
          setSlave(snapshot.data().count);
          const q1 = query(collection(db, "orders"));
          const docsSnapshot = await getDocs(q1);
          setOrders(docsSnapshot.size);
          setViewOrders(docsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          const q2 = query(collection(db, "users"), where("role", "==", "customer"));
          const customerSnapshot = await getCountFromServer(q2);
          setCustomers(customerSnapshot.data().count);

          const q3 = query(collection(db, "orders"), where("status", "==", "delivered"));
          const deliveredSnapshot = await getCountFromServer(q3);
          setDelivered(deliveredSnapshot.data().count);
        }
        fetchProductCount();
      }, []);
  
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
              { label: "Unsold Slaves", value: slave,  icon: Package },
              { label: "Sales", value: delivered,  icon: Package },              
              { label: "Orders", value: orders,  icon: ShoppingCart },
              { label: "Customers", value: customers, icon: Users },
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
                  {viiewOrders.map((order, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/40 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-foreground/60">{order.firstName}</p>
                      </div>

                      <div className="text-right mr-4">
                        <p className="font-semibold text-accent">{order.amount}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "deleivered"
                              ? "bg-green-500/20 text-green-300"
                              : order.status === "in process"
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
                    <Link href="/admin/products" className="gap-3">
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

              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
