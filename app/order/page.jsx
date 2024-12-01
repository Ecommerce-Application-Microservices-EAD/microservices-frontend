"use client";

import { useOrder } from "@/lib/OrderContext";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function OrderPage() {
  const { orders } = useOrder();

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold p-2">Your Orders</h1>
      <div className="grid sm:grid-cols-[65%_30%] gap-4">
        <Card className="rounded-md flex flex-col border-2 p-5">
          {orders.length > 0 ? (
            orders.map((product) => (
              <CardContent
                key={product.id}
                className="flex justify-around w-full border-b-2 border-l-2 p-2"
              >
                <div className="flex gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md mb-4"
                  />
                  <h3 className="text font-bold">{product.name}</h3>
                </div>
                <p>${product.price}</p>
                <p>1</p>
              </CardContent>
            ))
          ) : (
            <p className="text-center">No orders placed yet.</p>
          )}
        </Card>
        <Card className="rounded-md flex flex-col items-left justify-center border-2 p-3 gap-4">
          <h1 className="text-2xl font-bold">Place Order</h1>
          <h3 className="text font-bold">Shipping and Billing</h3>
          <div className="bg-gray-100 p-3 flex flex-col gap-3">
            <div className="flex gap-2">
              <MapPin />
              <p>Shipping Address</p>
            </div>
            <div>Address comes here</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
