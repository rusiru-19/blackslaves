"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, ArrowLeft, Lock } from "lucide-react";
import Header from "@/components/header";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧹 Remove item from cart
const removeItem = async (id: string) => {
  setCartItems((prev) => prev.filter((item) => item.id !== id));

  try {
    const uid = localStorage.getItem("uid");
    if (!uid) return console.error("No UID found in localStorage");

    const userRef = doc(db, "users", uid);

    // Get the user's current cart
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedCart = (userData.cart || []).filter(
        (cartItemId: string) => cartItemId !== id
      );

      // Update the cart in Firestore
      await updateDoc(userRef, { cart: updatedCart });
      console.log(`Removed product ${id} from Firestore cart.`);
    } else {
      console.warn("User document does not exist");
    }
  } catch (error) {
    console.error("Error removing item from Firestore:", error);
  }
};


  // 🔢 Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // 🧠 Fetch user cart from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const uid = localStorage.getItem("uid");
        if (!uid) {
          console.warn("User not logged in");
          setLoading(false);
          return;
        }

        // ✅ Get user doc
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("No user document found");
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const cartIds = userData?.cart || [];

        // ✅ Fetch product data for each product ID in the user's cart
        const products = await Promise.all(
          cartIds.map(async (productId: string) => {
            const productRef = doc(db, "slaves", productId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              return { id: productSnap.id, quantity: 1, ...productSnap.data() };
            }
            return null;
          })
        );

        // Remove nulls (nonexistent products)
        const validProducts = products.filter((p) => p !== null) as any[];
        setCartItems(validProducts);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // 🧮 Totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 300 ? 0 : 12;
  const tax = Math.round(subtotal * 0.5 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-foreground/60">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 🛒 Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60 mb-6">Your cart is empty</p>
                <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 bg-card/50 border border-border/40 rounded-lg hover:border-accent/30 transition-colors"
                  >
                    <div className="w-24 h-24 bg-card rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-foreground/60 text-sm mb-3">
                        Category: {item.category || "—"}
                      </p>
                      <p className="text-accent font-semibold">${item.price}</p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
    
                      <div className="text-right">
                        <p className="text-foreground/60 text-sm">Total</p>
                        <p className="text-lg font-bold text-accent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/60 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 💳 Order Summary */}
          <div className="h-fit">
            <div className="p-6 bg-card/50 border border-border/40 rounded-lg sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border/40 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 py-6 font-semibold mb-3">
                <Lock className="w-4 h-4 mr-2" />
                <Link href="/checkout" >Proceed to Checkout</Link>
                
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-lg border-border/50 hover:bg-card bg-transparent"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>

  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
