"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck } from "lucide-react";
import Header from "@/components/header";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [orderData, setOrderData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        // 1️⃣ Fetch order document
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          console.error("Order not found");
          setLoading(false);
          return;
        }

        const order = orderSnap.data();
        setOrderData(order);

        // 2️⃣ Fetch product details based on IDs in `slaves` array
        const productPromises = (order.slaves || []).map(async (productId: string) => {
          const productRef = doc(db, "slaves", productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            return { id: productSnap.id, ...productSnap.data() };
          }
          return null;
        });

        const productResults = (await Promise.all(productPromises)).filter(Boolean);
        setProducts(productResults);

      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/70">Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }

  // Calculations
  const subtotal = products.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl" />
              <CheckCircle className="w-24 h-24 text-accent relative" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-sm text-foreground/60">
            Order number: <span className="font-mono font-semibold text-accent">{orderData.id}</span>
          </p>
        </div>

        {/* Shipping Info */}
        <div className="p-6 bg-card/50 border border-border/40 rounded-lg mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Truck className="w-5 h-5 text-accent mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-foreground/70 text-sm">{orderData.firstName} {orderData.lastName}</p>
              <p className="text-foreground/70 text-sm">{orderData.address}</p>
              <p className="text-foreground/70 text-sm">{orderData.city}, {orderData.province} {orderData.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-3 mb-6">
            {products.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-card/30 border border-border/40 rounded-lg">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-foreground/60">Qty: {item.quantity || 1}</p>
                  </div>
                </div>
                <p className="font-semibold text-accent">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-card/50 border border-border/40 rounded-lg space-y-3">
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
            <div className="border-t border-border/40 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
