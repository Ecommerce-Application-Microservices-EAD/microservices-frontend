// OrderPage.tsx
"use client";

import { useOrder } from "@/lib/OrderContext";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Edit, Banknote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const { orders, removeOrder } = useOrder();
  const router = useRouter();

  // Calculate total items and total price
  const totalItems = orders.reduce((count, product) => count + product.quantity, 0);
  const totalPrice = orders.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const handleRemoveOrder = (productId) => {
    removeOrder(productId); 
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold p-2">Order Product</h1>
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
                <p>${product.price.toFixed(2)}</p>
                <p>{product.quantity}</p>
                <Button onClick={() => handleRemoveOrder(product.id)} >
                  Remove
                </Button>
              </CardContent>
            ))
          ) : (
            <p className="text-center">No Items Found.</p>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="rounded-md flex flex-col items-left justify-center border-2 p-3 gap-4">
          <h1 className="text-2xl font-bold">Place Order</h1>
          <h3 className="text font-bold">Shipping and Billing</h3>
          <div className="bg-gray-100 p-3 flex flex-col gap-3">
            <div className="flex gap-2">
              <MapPin />
              <p>Shipping Address</p>
            </div>
            <div>No. 111, ABC Road, Colombo</div>
            <Button className="w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit Address
            </Button>
          </div>
          <h3 className="text font-bold">Order Summary</h3>
          <div className="bg-gray-100 p-3 flex flex-col gap-3">
            <div className="flex justify-between">
              <p>Item/s</p>
              <p>{totalItems}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping Charge</p>
              <p>$5.00</p>
            </div>
            <div className="bg-blue-100 flex justify-between p-2">
              <p>Total</p>
              <p>${(totalPrice + 5).toFixed(2)}</p>
            </div>
            <Button className="w-full">
              <Banknote className="mr-2 h-4 w-4" /> Proceed to Pay
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
