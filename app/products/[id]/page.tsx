"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, ArrowLeft, Check } from "lucide-react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/header";
import { ToastContainer, toast } from "react-toastify";
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartcount, setcartcount] = useState(0);
  useEffect(() => {
    params.then((resolvedParams) => {
      console.log("Resolved Params:", resolvedParams);
      setProductId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProductData = async (id: string) => {
      try {
        console.log("Fetching product with ID:", id);
        const docRef = doc(db, "slaves", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          console.log("Product data:", data);
          setProduct(data);
        } else {
          console.log("No document!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData(productId);
  }, [productId]);

const handleAddToCart = async () => {


  const uid = localStorage.getItem("uid");
  if (!uid) {
    toast.error("Please log in to add items to your cart.");
    return;
  }

  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      cart: arrayUnion(product.id),
    });

      setIsAdded(true);
      setcartcount((prev) => prev + 1);
  } catch (error) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === "not-found") {
      await setDoc(doc(db, "users", uid), {
        cart: [product.id],
      });
      console.log("User document created and product added");
    } else {
      console.error("Error adding to cart:", error);
    }
  }
};


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 bg-gray-700 rounded"></div>
          <div className="h-6 w-1/2 bg-gray-600 rounded"></div>
          <div className="h-96 w-full bg-gray-700 rounded-lg"></div>
          <div className="h-6 w-3/4 bg-gray-600 rounded"></div>
          <div className="h-6 w-1/2 bg-gray-600 rounded"></div>
          <div className="h-12 w-full bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header count={cartcount}/>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <ToastContainer />
        <a
          href="/products"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </a>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex items-center justify-center bg-card/30 rounded-lg border border-border/40 p-8 min-h-96">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain max-h-96"
            />
          </div>

          <div className="space-y-8">
            <div>
              <div className="inline-block mb-4 text-accent text-sm font-semibold tracking-wider">
                {product.category?.toUpperCase()}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <p className="text-5xl font-bold text-accent mb-6">${product.price}</p>
              <p className="text-lg leading-relaxed">{product.description}</p>
              <p className="text-lg text-foreground/70 leading-relaxed">age: {product.age} years</p>
              <p className="text-lg text-foreground/70 leading-relaxed">height: {product.height} ft</p>
              <p className="text-lg text-foreground/70 leading-relaxed">weight: {product.weight}</p>
            </div>

            <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdded} 
                    className={`flex-1 rounded-lg py-6 text-lg font-semibold gap-2 transition-colors ${
                      isAdded
                        ? "bg-accent text-white cursor-not-allowed opacity-80"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
            </div>

     
          </div>
        </div>
      </div>
    </div>
  );
}