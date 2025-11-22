"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Filter } from 'lucide-react'
import { AdminSidebar } from "@/components/side-bar"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react"

export default function AdminOrders() {
  type Order = {
    id: string
    firstName: string
    email?: string
    slaves?: string[]
    price?: number | string
    date?: string
    status?: string
  }

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    const fetchData = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "orders"));
      const ORDERS: any[] = [];

      console.log("Fetched ORDERS:", querySnapshot);

      querySnapshot.forEach((doc) => {
        ORDERS.push({ id: doc.id, ...doc.data() });
      });

      setOrders(ORDERS);
    } catch (err) {
      console.error("Error fetching ORDERS:", err);
    } finally {
      setLoading(false);  
    }
  };
  fetchData()

    
  })

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="ml-64">
      

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Orders</h1>
              <p className="text-foreground/60">Manage customer orders and shipments</p>
            </div>

          </div>


          {/* Orders Table */}
          <div className="bg-card/50 border border-border/40 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-background/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Slaves</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/40 hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-accent">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{order.firstName}</p>
                          <p className="text-xs text-foreground/60">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{order.slaves?.length }</td>
                      <td className="px-6 py-4 font-semibold text-accent">{order.price}$</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                      </td>
        
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
