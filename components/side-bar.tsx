"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react'
import { getAuth, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify"

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Slave Inventory", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
      const logout = (async()=>{
        const auth = getAuth();
        await signOut(auth);
        localStorage.removeItem("uid");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        toast.success('logout')
        window.location.reload();
  
  
      })
  
  return (
    <aside className="w-64 bg-card/50 border-r border-border/40 fixed left-0 top-0 h-screen overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/40">
        <Link href="/admin" className="text-2xl font-bold tracking-tighter">
          BLACKSLAVES
        </Link>
        <p className="text-xs text-accent font-semibold tracking-widest mt-2">ADMIN PANEL</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border/40 space-y-3">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
            onClick={logout} 
        >
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="font-semibold text-sm">AD</span>
          </div> 
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
