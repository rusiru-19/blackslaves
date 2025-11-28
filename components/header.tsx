"use client"
import { useEffect, useState } from "react"
import { ShoppingCart, LogOut, PackageSearch, User } from "lucide-react"
import React from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { getAuth, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify"

interface HeaderProps {
  count?: number
}

export default function Header({ count = 0 }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<number>(0)
  const [username, setUsername] = useState<string>("")
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    if (count > 0) {
      setCartCount((prev) => prev + count)
    }
  }, [count])

  useEffect(() => {
    const uid = localStorage.getItem("uid")

    if (!uid) {
      setIsLoggedIn(false)
      return
    }

    setIsLoggedIn(true)

    const fetchUserCart = async () => {
      try {
        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setUsername(userData.name || "")
          const cart = userData?.cart || []
          setCartCount(cart.length)
          setRole(userData.role || "")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserCart()
  }, [])

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("uid");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1969 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1969 00:00:00 GMT";

    toast.success('Logged out');
    window.location.reload();
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown-container")) {
        setMenuOpen(false)
      }
    }
    window.addEventListener("click", handler)
    return () => window.removeEventListener("click", handler)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <a href="/" className="text-2xl font-bold tracking-tighter">
          BLACKSLAVES
        </a>

        <div className="flex items-center gap-6">

          <a href="/products" className="text-sm hover:text-accent transition-colors">
            Shop
          </a>

          {isLoggedIn ? (
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">{username}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card shadow-lg rounded-lg py-1 border border-border/40 z-50 animate-in fade-in slide-in-from-top-2">
                
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/20 transition"
                  >
                    <PackageSearch className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}

                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/20 transition relative"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart
                  {(cartCount > 0 || count > 0) && (
                    <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      {cartCount > 99 ? "99+" : cartCount || count}
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-accent/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
            </div>
          ) : (
            <a href="/login" className="text-sm hover:text-accent transition-colors">
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
