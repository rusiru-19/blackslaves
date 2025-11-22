"use client"
 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react'
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/side-bar"
import { doc, getDoc, collection, getDocs, query, where ,deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loading , setLoading] = useState(false)
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "slaves"));
      const PRODUCTS: any[] = [];

      console.log("Fetched products:", querySnapshot);

      querySnapshot.forEach((doc) => {
        PRODUCTS.push({ id: doc.id, ...doc.data() });
      });

      setProducts(PRODUCTS);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);   // always runs
    }
  };

  fetchData();
}, [])

const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, "slaves", id));
    setProducts(products.filter((product) => product.id !== id));
  } catch (err) {
    console.error("Error deleting product:", err);
  }
}
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="ml-64">
        {/* Header */}
 

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Slave Inventory</h1>
            </div>
            <Button asChild className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4" />
                Add Slave
              </Link>
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card/50 border border-border/40 rounded-lg focus:border-accent/50 outline-none transition-colors"
            />
          </div>

          {/* Products Table */}
          <div className="bg-card/50 border border-border/40 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-background/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Slave Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border/40 hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Package className="w-8 h-8 text-foreground/40" />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-foreground/60">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-accent">{product.price}</td>
    
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "available"
                              ? "bg-green-500/20 text-green-300"
                              : product.status != "available"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                          <button className="p-2 hover:bg-background/50 rounded-lg transition-colors text-foreground/60 hover:text-accent">
                            <Edit className="w-4 h-4" />
                          </button>
                          </Link>
                          <button className="p-2 hover:bg-background/50 rounded-lg transition-colors text-foreground/60 hover:text-destructive" onClick={() => deleteProduct(product.id) } >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

            {loading ? (
              <>
              <div className="text-center py-12">
              <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <p className="text-foreground/60">Loading ...</p>
            </div>

              </>
            ) : filteredProducts.length === 0 ? (
              <p className="text-foreground/60 col-span-full text-center">No products found.</p>
            ) : null}
        </div>
      </div>
    </div>
  )
}
