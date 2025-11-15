"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, ArrowRight, Star, Zap, Shield, TrendingUp } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Header from "@/components/header"

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "slaves"))
      const PRODUCTS: any[] = []
      querySnapshot.forEach((doc) => {
        PRODUCTS.push({ id: doc.id, ...doc.data() })
      })
      setProducts(PRODUCTS.slice(0, 8)) // Show only 8 featured products
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                  New Collection Available
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Discover Premium
                <span className="block text-accent">Mens Collection</span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-lg">
                Make Your Life style easy with affordable amount with one of our blackslave. We value privacy of every customer
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="rounded-full group">
                    Shop Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full">
                  View Collection
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-accent">500+</div>
                  <div className="text-sm text-foreground/60">Mens</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">50k+</div>
                  <div className="text-sm text-foreground/60">Successfull <br></br> Delevaries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">4.9</div>
                  <div className="text-sm text-foreground/60">Rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border border-border/40 overflow-hidden">
                {products[0] && (
                  <img
                    src={products[0].image || "/placeholder.svg"}
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-2xl shadow-xl">
                <div className="text-sm font-semibold">Starting from</div>
                <div className="text-3xl font-bold">${products[0]?.price || "99"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "10-15 day shipping" },
              { icon: Shield, title: "Top Privacy", desc: "100% protected" },
              { icon: Star, title: "Premium Quality", desc: "Top-rated Slaves" },
              { icon: TrendingUp, title: "Affordable Prices", desc: "Competitive rates" },
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="inline-flex p-4 bg-accent/10 rounded-2xl">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-foreground/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Handpicked selection of our most popular items
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-card/30 border border-border/40 p-4 space-y-4">
                  <div className="aspect-square bg-accent/10 rounded-xl animate-pulse"></div>
                  <div className="h-4 bg-accent/10 rounded animate-pulse"></div>
                  <div className="h-4 bg-accent/10 rounded w-2/3 animate-pulse"></div>
                </div>
              ))
            ) : (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="group cursor-pointer rounded-2xl overflow-hidden bg-card/30 border border-border/40 hover:border-accent/50 hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-card">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {product.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-accent">${product.price}</span>
                        <div className="flex items-center gap-1">Age:
                          <span className="text-sm font-semibold">{product.age}</span>
                        </div>
                      </div>
                      <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="rounded-full group">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-accent/20 via-accent/10 to-background">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Upgrade Your Style?</h2>
          <p className="text-xl text-foreground/70">
            Join thousands of satisfied customers and experience premium quality
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="rounded-full">
                Start Shopping
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}