"use client"
 
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ShoppingCart } from "lucide-react"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductSkeleton from "@/components/products-skeliton"
import Header from "@/components/header"
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]); // store fetched products
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "slaves"));
      const PRODUCTS: any[] = [];
      console.log("Fetched products:", querySnapshot);
      querySnapshot.forEach((doc) => {
        PRODUCTS.push({ id: doc.id, ...doc.data() });
      });
      setProducts(PRODUCTS);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-lg text-foreground/60">Discover Our Premium Mens Collection</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/40 text-foreground placeholder:text-foreground/40"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-foreground/60 my-auto" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-card/50 border border-border/40 hover:border-accent/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <ProductSkeleton />

              </>
            ) : filteredProducts.length === 0 ? (
              <p className="text-foreground/60 col-span-full text-center">No products found.</p>
            ) : null}

          {filteredProducts
            .filter(product => product.status === 'available')
            .map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer rounded-lg overflow-hidden bg-card/30 border border-border/40 hover:border-accent/50 transition-all duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-card">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-accent">${product.price}</span>
                    </div>
                    <p className="text-sm text-gray/200">height: {product.height} ft</p>
                    <p className="text-sm text-gray/200">weight: {product.weight} lbs</p>
                    <p className="text-sm text-gray/200">age: {product.age} years</p>
                    <Button className="w-full mt-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}

        </div>
      </div>
    </div>
  )
}
