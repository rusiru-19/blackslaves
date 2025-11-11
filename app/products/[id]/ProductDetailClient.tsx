"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Props {
  productId: string;
}

export default function ProductDetailClient({ productId }: Props) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log("Product ID:", productId); // should now print correctly

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const docRef = doc(db, "slaves", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such product!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return <div>{product.name}</div>;
}
