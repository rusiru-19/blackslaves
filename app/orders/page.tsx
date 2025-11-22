"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/header"
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
useEffect(() => {
      const userId = localStorage.getItem('uid')

  async function loadOrders(userId:any) {

    // 1. get user doc
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const orderIds: string[] = userData.orders || [];

    // 2. fetch each order
    const orderPromises = orderIds.map(async (orderId) => {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);
      return orderSnap.exists()
        ? { id: orderId, ...orderSnap.data() }
        : null;
    });

    const fetchedOrders = await Promise.all(orderPromises);

    // 3. add to state
    setOrders(fetchedOrders.filter(Boolean));
    console.log(orders)
  }

  loadOrders(userId);
}, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">My Orders</h1>
          </div>
        {/* Orders Table */}
        <div className="bg-card/50 border border-border/40 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-background/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/40 hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-accent">{order.id}</td>
     
                    <td className="px-6 py-4 font-semibold text-accent">{order.price}$</td>
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
                      <Link href={`/orders/view/?order_id=${order.id}`}>
                      <button className="text-accent hover:text-accent/80 font-semibold text-sm transition-colors">
                        View →
                      </button>
                      </Link>
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
