"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { AdminSidebar } from "@/components/side-bar"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ToastContainer, toast } from "react-toastify"

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    weight: "",
    height: "",
    image: "",
  })

  const handleChange = (e:any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: any) => {
  e.preventDefault()

  try {

      const ID = formData.name.toLowerCase().replace(/\s+/g, "-")

      await setDoc(doc(db, "slaves", ID), {
      name: formData.name,
      id: ID,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      weight: Number(formData.weight),
      height: formData.height,
      image: formData.image,
      status: "available",
      createdAt: Timestamp.now(),
    })

    toast.success("Slave added successfully!")

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      weight: "",
      height: "",
      image: "",
    })

  } catch (error) {
    console.error("Error adding product:", error)
    toast.error("Failed to add product.")
  }
}

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
            <h1 className="text-4xl font-bold">Add New Slaves</h1>
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
              <h2 className="text-lg font-bold">Slave Details</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Slave Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
                  >
                    <option>Extra Dark</option>
                    <option>Dark</option>
                    <option>Light</option>
                    <option>Young</option>
                  </select>
                </div>
                
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className=" text-sm font-semibold mb-2">weight</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className=" text-sm font-semibold mb-2">height</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-background/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className=" text-sm font-semibold mb-2">Price</label>
                  <input
                    type="number"
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
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
