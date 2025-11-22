"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/side-bar"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { toast, ToastContainer } from "react-toastify"

export default function EditProducts({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(true)
  const [productId, setProductId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    height: "",
    weight: "",
    image: "",
  })

  // Resolve params
  useEffect(() => {
    params.then(resolved => {
      console.log("Resolved Params:", resolved)
      setProductId(resolved.id)
    })
  }, [params])

  // Load product once productId is available
  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      console.log("Fetching product from Firestore:", productId)

      try {
        const ref = doc(db, "slaves", productId)
        const snap = await getDoc(ref)

        if (!snap.exists()) {
          toast.error("Product not found!")
          console.error("Firestore: Document not found:", productId)
          setLoading(false)
          return
        }

        setFormData(snap.data() as any)
      } catch (error) {
        toast.error("Failed to load product")
      }

      setLoading(false)
    }

    fetchProduct()
  }, [productId])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!productId) return

    console.log("Updating product:", productId, formData)

    try {
      const ref = doc(db, "slaves", productId)
      await updateDoc(ref, formData)
      toast.success("Product updated!")
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  if (loading) return <p className="text-center p-10">Loading product...</p>
  if (!productId) return <p className="text-center p-10 text-red-500">Invalid product ID</p>
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <ToastContainer />
      <div className="ml-64">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Link href="/admin/products" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Inventory
            </Link>
            <h1 className="text-4xl font-bold">Edit Slaves</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="bg-card/50 border border-border/40 rounded-lg p-6">
              <label className="block text-sm font-semibold mb-4">Slave Image (URL)</label>

              {/* Preview */}
              <div className="mb-4 w-full h-64 bg-background/50 border border-border/40 rounded-lg flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <p className="text-sm text-foreground/50">No image URL provided</p>
                )}
              </div>

              {/* Image URL input */}
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition"
                required
              />
            </div>

            {/* Product Details */}
            <div className="bg-card/50 border border-border/40 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">Slaves Details</h2>

              <div>
                <label className="block text-sm font-semibold mb-2">Slaves Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50"
                    required
                  />
                </div>

              </div>
 

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">weight</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Height</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50"
                    required
                  />
                </div>

                <div>
                  <label className=" text-sm font-semibold mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="rounded-lg">
                <Link href="/admin/products">Cancel</Link>
              </Button>
              <Button type="submit" className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
