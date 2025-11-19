"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Check, ChevronRight } from 'lucide-react'
import Header from "@/components/header"
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation"
export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<any[]>([])
  const router = useRouter()
  const [ordering, setOrdering] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    billingAddress: false,
  })

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async() => {
  setOrdering(true)
  const slaveIds = cartItems.map(item => item.id);
  const uid = localStorage.getItem('uid')
  const order_id = `${uid}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  try {
    await setDoc(doc(db, "orders", order_id), {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      zipCode: formData.zipCode,
      id: order_id,
      price: total,
      slaves: slaveIds || []
    }, { merge: true });

        await updateDoc(doc(db, "users", uid), {
      cart: [], 
      orders: arrayUnion(order_id) 
    });

  const updates = cartItems.map(async (item) => {
    const productRef = doc(db, "slaves", item.id);

    await updateDoc(productRef, {
      status: 'sold'
    });
  });
  
    await Promise.all(updates);
    setOrdering(false)
    router.push(`checkout/success/?order_id=${order_id}`);
  } catch (error) {
    setOrdering(false)
    toast.error('an error occured')
    console.log(error)
    return { success: false, error };
  }


  }

  const steps = ["Shipping",  "Review"]

  // -------------------------------
  // ✅ FETCH CART FROM FIREBASE
  // -------------------------------
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const uid = localStorage.getItem("uid")
        if (!uid) {
          console.warn("User not logged in")
          setLoading(false)
          return
        }

        const userRef = doc(db, "users", uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          console.log("No user document found")
          setLoading(false)
          return
        }

        const userData = userSnap.data()
        const cartIds = userData?.cart || []

        // Fetch each product
        const products = await Promise.all(
          cartIds.map(async (productId: string) => {
            const productRef = doc(db, "slaves", productId)
            const productSnap = await getDoc(productRef)
            if (productSnap.exists()) {
              return { id: productSnap.id, quantity: 1, ...productSnap.data() }
            }
            return null
          })
        )

        const validProducts = products.filter((p) => p !== null) as any[]
        setCartItems(validProducts)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])
  // -------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/70">Loading your cart...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ToastContainer></ToastContainer>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicators */}
            <div className="mb-12">
              <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentStep(index + 1)}
                      className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-all ${
                        index + 1 <= currentStep
                          ? "bg-accent text-accent-foreground"
                          : "bg-card/50 text-foreground/60 border border-border/40"
                      }`}
                    >
                      {index + 1 < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                    </button>
                    <span className="text-sm font-medium hidden sm:inline">{step}</span>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-foreground/30 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ----------------------------- */}
            {/* Step 1: Shipping */}
            {/* ----------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 000-0000"
                        className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">province</label>
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          placeholder="NY"
                          className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                          className="w-full px-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

      

            {/* ----------------------------- */}
            {/* Step 3: Review */}
            {/* ----------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Order Review</h2>

                {/* Shipping Summary */}
                <div className="p-6 bg-card/50 border border-border/40 rounded-lg">
                  <h3 className="font-semibold mb-3">Shipping To</h3>
                  <p className="text-foreground/70">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-foreground/70">{formData.address}</p>
                  <p className="text-foreground/70">
                    {formData.city}, {formData.province} {formData.zipCode}
                  </p>
                  <p className="text-foreground/70 text-sm mt-3">{formData.email}</p>
                </div>

                {/* Items Summary */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between p-4 bg-card/30 border border-border/40 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-accent">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Billing Summary */}
                <div className="p-6 bg-card/50 border border-border/40 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between text-foreground/70">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground/70">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-foreground/70">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border/40 pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-accent">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------- */}
            {/* Navigation Buttons */}
            {/* ----------------------------- */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                className="flex-1 rounded-lg border-border/50 hover:bg-card bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </Button>
              {currentStep < 2 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {ordering ? 'Processing Your Order ...': 'Place Your Order'}
                </Button>
              )}
            </div>
          </div>

          {/* ----------------------------- */}
          {/* ORDER SUMMARY SIDEBAR */}
          {/* ----------------------------- */}
          <div className="h-fit">
            <div className="p-6 bg-card/50 border border-border/40 rounded-lg sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground/70">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/40 pt-4 space-y-3">
                <div className="flex justify-between text-foreground/70 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70 text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping }`}</span>
                </div>
                <div className="flex justify-between text-foreground/70 text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border/40 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
