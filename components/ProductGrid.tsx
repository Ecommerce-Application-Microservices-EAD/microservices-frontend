"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useOrder } from "@/lib/OrderContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShoppingBag, Router } from "lucide-react";
import { dummyProducts } from "@/lib/dummyData";
import { useRouter } from "next/navigation";

export default function ProductGrid() {
  const [products] = useState(dummyProducts);
  const { addToCart } = useCart();
  const { addOrder } = useOrder(); 
  const router = useRouter();
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardContent className="p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-xl font-bold">${product.price}</p>
          </CardContent>
          <CardFooter className="mt-auto grid gap-2">
            <Button className="w-full" onClick={() => {addOrder(product); router.push("/order");}}>
              <ShoppingBag className="mr-2 h-4 w-4" /> Place Order
            </Button>
            <Button className="w-full" onClick={() => addToCart(product.id)}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
