"use client"
import { useEffect, useState } from "react"
import { ShoppingCart, LogOut } from "lucide-react"
import React from "react"
import { doc, getDoc } from "firebase/firestore"
import { db,  } from "@/lib/firebase"
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
        } else {
          console.log("No such document!")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserCart()
  }, [])
    const logout = (async()=>{
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("uid");
      toast.success('logout')
      window.location.reload();


    })

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <ToastContainer></ToastContainer>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold tracking-tighter">
          BLACKSLAVES
        </a>
        <div className="flex items-center gap-6">
          <a href="/products" className="text-sm hover:text-accent transition-colors">
            Shop
          </a>

          {isLoggedIn ? (
            <>
              <p>
                Hello, { username }
              </p>
              <Link href="/cart">
              <button className="relative p-2 hover:bg-card rounded-lg transition-colors group">
                
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {(cartCount > 0 || count > 0) && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center animate-in zoom-in-50">
                    {cartCount > 99 ? "99+" : cartCount || count}
                  </span>
                )}
              </button>
              </Link>
              <button  className="relative p-2 hover:bg-card rounded-lg transition-colors group" onClick={logout}>
              <LogOut  className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

            </>
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
