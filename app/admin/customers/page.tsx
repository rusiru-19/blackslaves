"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Mail, Phone, MapPin, Search, Clock, PersonStanding } from 'lucide-react'
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/side-bar"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  useEffect(()=>{
 const fetchData = async () => {
    try {

      const querySnapshot = await getDocs(collection(db, "users"));
      const CUSTOMERS: any[] = [];

      console.log("Fetched CUSTOMERS:", querySnapshot);

      querySnapshot.forEach((doc) => {
        CUSTOMERS.push({ id: doc.id, ...doc.data() });
      });

      setCustomers(CUSTOMERS);
    } catch (err) {
      console.error("Error fetching CUSTOMERS:", err);
    } finally {
    }
  };
  fetchData()

  })
  const filteredCustomers = customers.filter((c) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="ml-64">
       
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Customers</h1>
            <p className="text-foreground/60">Manage and view customer information</p>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
            />
          </div>

          <div className="grid gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-card/50 border border-border/40 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{customer.name}</h3>
      
                  </div>
        
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-foreground/60">Email</p>
                      <p className="text-sm font-semibold">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PersonStanding className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-foreground/60">Role</p>
                      <p className="text-sm font-semibold">{customer.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-foreground/60">Last Login</p>
                      <p className="text-sm font-semibold">{customer.lastLogin?.toDate().toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Purchase History</p>
                    <p className="text-sm font-semibold">{customer.orders} orders • {customer.totalSpent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <p className="text-foreground/60">No customers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
